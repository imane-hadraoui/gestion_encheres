<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProduitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hypothèse des IDs de catégories : 
        // 1 = Art & Culture, 2 = Mode & Bijoux, 3 = Électronique, 4 = Sport & Véhicules

        $produits = [
            [
                'libelle' => 'Tableau d\'art moderne',
                'description' => 'Une magnifique peinture abstraite colorée pour décorer votre intérieur.',
                'prix_initial' => 250.00,
                'statut' => 'disponible',
                'image' => 'art.jpg',
                'category_id' => 1, 
                'user_id' => 1,
            ],
            [
                'libelle' => 'Bande Dessinée Pop Art',
                'description' => 'Livre de collection style BD américaine rétro avec illustrations originales.',
                'prix_initial' => 15.50,
                'statut' => 'disponible',
                'image' => 'bd.jpg',
                'category_id' => 1,
                'user_id' => 2,
            ],
            [
                'libelle' => 'Bijoux Traditionnels',
                'description' => 'Ensemble de bracelets et colliers artisanaux sertis de pierres colorées.',
                'prix_initial' => 85.00,
                'statut' => 'disponible',
                'image' => 'bijoux.jpg',
                'category_id' => 2,
                'user_id' => 1,
            ],
            [
                'libelle' => 'Appareil Photo Canon',
                'description' => 'Appareil photo reflex professionnel idéal pour le studio et l\'extérieur.',
                'prix_initial' => 1200.00,
                'statut' => 'disponible',
                'image' => 'canon.jpg',
                'category_id' => 3,
                'user_id' => 2,
            ],
            [
                'libelle' => 'Montre Astronomique de Luxe',
                'description' => 'Montre mécanique haut de gamme avec cadran représentant la carte du monde.',
                'prix_initial' => 4500.00,
                'statut' => 'disponible',
                'image' => 'montre.avif',
                'category_id' => 2,
                'user_id' => 1,
            ],
            [
                'libelle' => 'Montre Classique Bleue',
                'description' => 'Montre analogique élégante avec bracelet en acier et cadran bleu épuré.',
                'prix_initial' => 199.99,
                'statut' => 'disponible',
                'image' => 'montre.webp',
                'category_id' => 2,
                'user_id' => 2,
            ],
            [
                'libelle' => 'Montre de Plongée Noire',
                'description' => 'Montre étanche avec lunette rotative et aiguilles luminescentes.',
                'prix_initial' => 350.00,
                'statut' => 'disponible',
                'image' => 'montres.jpg',
                'category_id' => 2,
                'user_id' => 1,
            ],
            [
                'libelle' => 'Console PlayStation 5',
                'description' => 'Console PS5 édition standard accompagnée de sa manette DualSense sans fil.',
                'prix_initial' => 499.99,
                'statut' => 'disponible',
                'image' => 'ps5.jpg',
                'category_id' => 3,
                'user_id' => 2,
            ],
            [
                'libelle' => 'Montre de Luxe Rolex',
                'description' => 'Montre de collection automatique haut de gamme Submariner.',
                'prix_initial' => 9500.00,
                'statut' => 'disponible',
                'image' => 'rolex.jpg',
                'category_id' => 2,
                'user_id' => 1,
            ],
            [
                'libelle' => 'Vélo de Course Jaune',
                'description' => 'Vélo de route ultra léger avec cadre aérodynamique idéal pour le cyclisme.',
                'prix_initial' => 750.00,
                'statut' => 'disponible',
                'image' => 'velo.jpg',
                'category_id' => 4,
                'user_id' => 2,
            ],
            [
                'libelle' => 'Supercar Bugatti Chiron',
                'description' => 'Modèle de sport d\'exception alliant puissance extrême et design luxueux.',
                'prix_initial' => 2500000.00,
                'statut' => 'disponible',
                'image' => 'voitures.jpg',
                'category_id' => 4,
                'user_id' => 1,
            ],
        ];

        // Horodatage récent (échelonné) pour que les produits apparaissent
        // dans la liste (filtre : créés il y a moins de 3 jours).
        foreach ($produits as $index => $produit) {
            $date = Carbon::now()->subHours($index * 5);
            $produits[$index]['created_at'] = $date;
            $produits[$index]['updated_at'] = $date;
        }

        DB::table('produits')->insert($produits);
    }
}
