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
        
        $featuredProducts = Product::with(['images', 'category'])
            ->where('is_featured', true)
            ->latest()
            ->take(8)
            ->get();
            
        $bestSellers = Product::with(['images', 'category'])
            ->where('is_best_seller', true)
            ->latest()
            ->take(8)
            ->get();
            
        $newArrivals = Product::with(['images', 'category'])
            ->where('is_new_arrival', true)
            ->latest()
            ->take(8)
            ->get();

        return view('home.index', compact('banners', 'categories', 'featuredProducts', 'bestSellers', 'newArrivals'));
    }
}
