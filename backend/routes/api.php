<?php
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\EncherirController;
use App\Http\Controllers\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;


// Public : Tout le monde peut consulter
Route::get('/produits', [ProduitController::class, 'index']);
Route::get('/produits/{id}', [ProduitController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

// Authentification par session (Sanctum SPA)
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);


// L'acheteur/vendeur doit être connecté
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $request) => $request->user());
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    Route::post('/produits', [ProduitController::class, 'store']);
    Route::delete('/produits/{id}', [ProduitController::class, 'destroy']);
    Route::post('/produits/{id}/encherir', [EncherirController::class, 'store']);
    Route::get('/encheres', [EncherirController::class, 'index']);
});