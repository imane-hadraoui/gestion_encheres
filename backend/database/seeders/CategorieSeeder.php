<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorieSeeder extends Seeder
{
    /**
     
Run the database seeds.*/
  public function run(): void{$categories = [['nom' => 'Art & Peinture', 'image' => 'art.jpg'],['nom' => 'Bandes Dessinées', 'image' => 'bd.jpg'],['nom' => 'Bijoux Tradis', 'image' => 'bijoux.jpg'],['nom' => 'Montres & Horlogerie', 'image' => 'montre.jpg'],['nom' => 'Automobile & Véhicules', 'image' => 'voitures.jpg'],['nom' => 'Électronique & Tech', 'image' => 'electronique.jpg'],['nom' => 'Mode & Vêtements', 'image' => 'mode.jpg'],['nom' => 'Jeux Vidéo & Consoles', 'image' => 'jeux_video.jpg'],['nom' => 'Livres & Collections', 'image' => 'livres.jpg'],['nom' => 'Maison & Décoration', 'image' => 'maison.jpg'],];

        foreach ($categories as $cat) {
            DB::table('categories')->insert([
                'nom' => $cat['nom'],
                'image' => $cat['image'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}