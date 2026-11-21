<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminBannerController;

// ============================================================
// PUBLIC BUYER ROUTES
// ============================================================
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/catalog', [CatalogController::class, 'index'])->name('catalog');
Route::get('/product/{slug}', [ProductController::class, 'show'])->name('product.show');

// ============================================================
// ADMIN AUTH ROUTES
// ============================================================
Route::get('/admin/login', [AdminAuthController::class, 'loginForm'])->name('admin.login');
Route::post('/admin/login', [AdminAuthController::class, 'login'])->name('admin.login.post');
Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

// ============================================================
// ADMIN PROTECTED ROUTES
// ============================================================
Route::prefix('admin')->middleware('auth.admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        return redirect()->route('admin.produk.index');
    });

    // Produk CRUD
    Route::get('/produk', [AdminProductController::class, 'index'])->name('produk.index');
    Route::get('/produk/create', [AdminProductController::class, 'create'])->name('produk.create');
    Route::post('/produk', [AdminProductController::class, 'store'])->name('produk.store');
    Route::get('/produk/{id}/edit', [AdminProductController::class, 'edit'])->name('produk.edit');
    Route::put('/produk/{id}', [AdminProductController::class, 'update'])->name('produk.update');
    Route::delete('/produk/{id}', [AdminProductController::class, 'destroy'])->name('produk.destroy');
    Route::delete('/produk/{productId}/images/{imageId}', [AdminProductController::class, 'deleteImage'])->name('produk.images.destroy');

    // Kategori CRUD
    Route::get('/kategori', [AdminCategoryController::class, 'index'])->name('kategori.index');
    Route::post('/kategori', [AdminCategoryController::class, 'store'])->name('kategori.store');
    Route::put('/kategori/{id}', [AdminCategoryController::class, 'update'])->name('kategori.update');
    Route::delete('/kategori/{id}', [AdminCategoryController::class, 'destroy'])->name('kategori.destroy');

    // Banner CRUD
    Route::get('/banner', [AdminBannerController::class, 'index'])->name('banner.index');
    Route::post('/banner', [AdminBannerController::class, 'store'])->name('banner.store');
    Route::put('/banner/{id}', [AdminBannerController::class, 'update'])->name('banner.update');
    Route::delete('/banner/{id}', [AdminBannerController::class, 'destroy'])->name('banner.destroy');
});
