<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function show(string $slug)
    {
        $product = Product::with(['category', 'images', 'variants'])
            ->where('slug', $slug)
            ->orWhere('id', $slug)
            ->firstOrFail();

        $relatedProducts = Product::with(['images', 'category'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->take(4)
            ->get();

        return view('product.show', compact('product', 'relatedProducts'));
    }
}
