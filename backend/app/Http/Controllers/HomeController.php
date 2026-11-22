<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Category;
use App\Models\Product;

class HomeController extends Controller
{
    public function index()
    {
        $banners = Banner::where('is_active', true)->orderBy('order')->get();
        $categories = Category::withCount('products')->orderBy('name')->get();
        
        $selectedCategory = request('category');
        $productsQuery = Product::with(['images', 'category'])->latest();

        if ($selectedCategory) {
            $productsQuery->whereHas('category', function ($q) use ($selectedCategory) {
                $q->where('slug', $selectedCategory);
            });
        }

        $allProducts = $productsQuery->get();
        $totalProductsCount = Product::count();

        return view('home.index', compact('banners', 'categories', 'allProducts', 'selectedCategory', 'totalProductsCount'));
    }
}
