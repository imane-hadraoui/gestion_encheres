<?php

namespace App\Http\Controllers;
use App\Models\Produit;
use App\Models\Encherir;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;


class ProduitController extends Controller
{

    public function index(Request $request)
    {
        $query = Produit::withMax('encheres as encheres_max_prix', 'prix');

        if ($request->boolean('mine')) {
            // Vue vendeur : uniquement ses propres produits (toutes dates)
            // + le dernier enchérisseur pour l'affichage sur la carte
            $query->where('user_id', Auth::id());
            $query->with('derniereEnchere.acheteur');
        } else {
            // Vue publique : produits créés il y a moins de 3 jours
            $query->where('created_at', '>=', Carbon::now()->subDays(3));
        }

        if ($request->filled('search')) {
            $searchTerm = $request->search;

            // Groupe de conditions pour s'assurer que le filtre LIKE ne casse pas d'autres clauses logiques
            $query->where(function($q) use ($searchTerm) {
                $q->where('libelle', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('description', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Filtre par catégorie
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        $produits = $query->latest()->paginate(12);

        $produits->getCollection()->transform(function ($produit) {
            $produit->date_fin = $produit->created_at
                ? $produit->created_at->addDays(3)->toIso8601String()
                : null;
            return $produit;
        });

        return response()->json($produits);
    }


    public function show($id)
    {
        $produit = Produit::withMax('encheres as encheres_max_prix', 'prix')
            ->with([
                'proprietaire',
                'encheres' => function ($query) {
                    $query->with('acheteur')->orderByDesc('prix');
                },
            ])
            ->findOrFail($id);

        // Date de fin calculée : 3 jours après la création (même règle que l'index)
        $produit->date_fin = $produit->created_at
            ? $produit->created_at->addDays(3)->toIso8601String()
            : null;

        return response()->json($produit);
    }


    public function store(Request $request)
    {
        $request->validate([
            'libelle' => 'required|string',
            'description' => 'required',
            'prix_initial' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // On enregistre le fichier dans storage/app/public/images et on ne garde
        // que le nom de fichier (cohérent avec l'affichage /storage/images/<image>).
        $file = $request->file('image');
        $filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
        $file->storeAs('images', $filename, 'public');

        $produit = Produit::create([
            'libelle' => $request->libelle,
            'description' => $request->description,
            'prix_initial' => $request->prix_initial,
            'category_id' => $request->category_id,
            'user_id' => Auth::id(),
            'statut' => 'disponible',
            'image' => $filename,
        ]);

        return response()->json([
            'message' => 'Produit créé avec succès',
            'produit' => $produit
        ], 201);
    }


    public function destroy($id)
    {
        $produit = Produit::findOrFail($id);

        // Seul le vendeur propriétaire peut supprimer son produit
        if ($produit->user_id !== Auth::id()) {
            return response()->json([
                'error' => "Vous n'êtes pas autorisé à supprimer ce produit.",
            ], 403);
        }

        // On ne peut pas supprimer un produit déjà enchéri
        if ($produit->encheres()->exists()) {
            return response()->json([
                'error' => 'Impossible de supprimer un produit déjà enchéri.',
            ], 422);
        }

        // Suppression de l'image associée
        if ($produit->image) {
            Storage::disk('public')->delete('images/' . $produit->image);
        }

        $produit->delete();

        return response()->json([
            'message' => 'Produit supprimé avec succès.',
        ]);
    }


}
