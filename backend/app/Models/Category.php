<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    

    use HasFactory;

    protected $fillable = ['nom', 'image'];

    public function produits(): HasMany
    {
        return $this->hasMany(Produit::class);
    }


}
