<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Encherir extends Model
{
    
    protected $fillable = [
        'prix',
        'date_enchere',
        'user_id',    //  l'acheteur
        'produit_id', //  produit
    ];

  public function acheteur()
    {
        return $this->belongsTo(User::class, 'user_id');
    }


    public function produit() {
        return $this->belongsTo(Produit::class);
    }

}
