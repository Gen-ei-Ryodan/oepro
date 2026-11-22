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

        // Ambil mapping warna -> slug produk lain di kategori yang sama
        $categoryProducts = Product::select('id', 'name', 'slug', 'category_id')
            ->where('category_id', $product->category_id)
            ->get();

        $colorSlugMap = [];
        foreach ($categoryProducts as $cp) {
            $parts = explode(' - ', $cp->name);
            if (isset($parts[1])) {
                $colorName = trim($parts[1]);
                $colorSlugMap[strtolower($colorName)] = $cp->slug;
            }
        }

        return view('product.show', compact('product', 'relatedProducts', 'colorSlugMap'));
    }
}
