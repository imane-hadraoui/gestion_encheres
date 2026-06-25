<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('produits', function (Blueprint $table) {
            $table->id();
            $table->string('libelle'); 
            $table->text('description')->nullable();
            $table->string('image'); 
            $table->decimal('prix_initial', 10, 2); 
            $table->string('statut')->default('disponible'); 
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('category_id')->constrained('categories'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
