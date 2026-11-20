<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'images', 'variants'])->latest()->get();
        return response()->json($products);
    }

    public function show($id_or_slug)
    {
        $product = Product::with(['category', 'images', 'variants'])
            ->where('id', $id_or_slug)
            ->orWhere('slug', $id_or_slug)
            ->firstOrFail();
        return response()->json($product);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'category_id' => 'required|integer|exists:categories,id',
            'price' => 'required|numeric',
            'variants' => 'sometimes|array'
        ]);

        $product = Product::create($validatedData);

        // Create variants if present
        if ($request->has('variants')) {
            foreach ($request->variants as $variantData) {
                $product->variants()->create($variantData);
            }
        }

        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|string',
            'category_id' => 'sometimes|integer|exists:categories,id',
            'price' => 'sometimes|numeric'
        ]);

        $product->update($validatedData);

        // Update or create variants
        if ($request->has('variants')) {
            foreach ($request->variants as $variantData) {
                $product->variants()->updateOrCreate(['id' => $variantData['id']], $variantData);
            }
        }

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->images()->each(fn($image) => $image->delete());
        $product->variants()->delete();
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function addImage(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $path = $request->file('image')->store('products', 'public');

        $image = $product->images()->create([
            'url' => Storage::url($path)
        ]);

        return response()->json($image, 201);
    }

    public function removeImage($imageId)
    {
        $image = ProductImage::findOrFail($imageId);
        Storage::disk('public')->delete(str_replace('/storage/', '', $image->url));
        $image->delete();
        return response()->json(['message' => 'Image removed successfully']);
    }
}
