<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     
Run the database seeds.*/
  public function run(): void{$users = [['name' => 'Ahmed Amrani','email' => 'ahmed@gmail.com','password' => Hash::make('password123'),'telephone' => '0661234567','type' => 'vendeur',],['name' => 'Sanaa Bennani','email' => 'sanaa@gmail.com','password' => Hash::make('password123'),'telephone' => '0662345678','type' => 'acheteur',],];

        foreach ($users as $user) {
            DB::table('users')->insert([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => $user['password'],
                'telephone' => $user['telephone'],
                'type' => $user['type'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}