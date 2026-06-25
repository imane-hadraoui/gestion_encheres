<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Produit extends Model
{
    protected $fillable = [
        'libelle',
        'description',
        'prix_initial',
        'statut',
        'image',
        'user_id', // vendeur
        'category_id'
    ];


    public function proprietaire(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }


    public function encheres(): HasMany
    {
        return $this->hasMany(Encherir::class);
    }


    // La dernière enchère (la plus récente) sur le produit
    public function derniereEnchere(): HasOne
    {
        return $this->hasOne(Encherir::class)->latestOfMany();
    }


    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return asset('storage/' . $this->image);
    }

}
