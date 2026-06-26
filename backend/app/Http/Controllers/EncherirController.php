<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use App\Models\Encherir;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;


class EncherirController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if ($user->type === 'acheteur') {
            return response()->json(Encherir::with(['acheteur', 'produit'])->where('user_id',Auth::id())->get(), 200);
        } else {
            return response()->json(Encherir::with(['acheteur', 'produit'])
            ->whereHas('produit', function ($query) {
                $query->where('user_id', Auth::id()); 
                })->get(), 200);
        }
    }


    public function store(Request $request, $id)
    {
        $produit = Produit::findOrFail($id);

        // Un vendeur ne peut pas enchérir sur son propre produit
        if ($produit->user_id === Auth::id()) {
            return response()->json(['error' => 'Vous ne pouvez pas enchérir sur votre propre produit'], 403);
        }

        if ($produit->created_at->diffInDays(Carbon::now()) >= 3) {
            return response()->json(['error' => 'Le délai de 3 jours est expiré'], 403);
        }

        $derniereEnchere = Encherir::where('produit_id', $id)->latest()->first();
        $prixActuel = $derniereEnchere ? $derniereEnchere->prix : $produit->prix_initial;
        $nouveauPrix = $prixActuel * 1.10; 

        $enchere = Encherir::create([
            'user_id' => Auth::id(), 
            'produit_id' => $id,
            'prix' => $nouveauPrix,
            'date_enchere' => Carbon::now()
        ]);

        return response()->json([
            'message' => 'Enchère enregistrée',
            'nouveau_prix' => $nouveauPrix,
            'enchere' => $enchere
        ], 201);
    }

}
