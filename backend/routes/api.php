<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UploadController;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/banners', [BannerController::class, 'index']);
    Route::post('/admin/banners', [BannerController::class, 'store']);
    Route::match(['put', 'post'], '/admin/banners/{id}', [BannerController::class, 'update']);
    Route::delete('/admin/banners/{id}', [BannerController::class, 'destroy']);
    Route::post('/admin/banners/reorder', [BannerController::class, 'reorder']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/admin/categories', [CategoryController::class, 'store']);
    Route::put('/admin/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id_or_slug}', [ProductController::class, 'show']);
    Route::post('/admin/products', [ProductController::class, 'store']);
    Route::put('/admin/products/{id}', [ProductController::class, 'update']);
    Route::delete('/admin/products/{id}', [ProductController::class, 'destroy']);
    Route::post('/admin/products/{id}/images', [ProductController::class, 'addImage']);
    Route::delete('/admin/products/images/{imageId}', [ProductController::class, 'removeImage']);

    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/admin/orders', [OrderController::class, 'index']);
    Route::put('/admin/orders/{id}/status', [OrderController::class, 'updateStatus']);

    Route::post('/upload', [UploadController::class, 'upload']);
});
