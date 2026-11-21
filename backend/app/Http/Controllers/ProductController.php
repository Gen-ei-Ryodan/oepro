<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

        if (empty($validatedData['slug'])) {
            $validatedData['slug'] = Str::slug($validatedData['name']) . '-' . uniqid();
        }

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
            'price' => 'sometimes|numeric',
            'original_price' => 'sometimes|nullable|numeric',
            'discount_percent' => 'sometimes|nullable|integer',
            'stock' => 'sometimes|nullable|integer',
            'material' => 'sometimes|nullable|string',
            'fit' => 'sometimes|nullable|string',
            'description' => 'sometimes|nullable|string',
            'sku' => 'sometimes|nullable|string',
            'is_best_seller' => 'sometimes|boolean',
            'is_featured' => 'sometimes|boolean',
            'is_new_arrival' => 'sometimes|boolean',
        ]);

        foreach (['sizes', 'colors', 'features'] as $jsonField) {
            if ($request->has($jsonField)) {
                $val = $request->$jsonField;
                if (is_string($val)) {
                    $decoded = json_decode($val, true);
                    $validatedData[$jsonField] = $decoded !== null ? $decoded : $val;
                } else {
                    $validatedData[$jsonField] = $val;
                }
            }
        }

        $product->update($validatedData);

        // Update or create variants
        $variants = $request->variants;
        if (is_string($variants)) {
            $variants = json_decode($variants, true) ?? [];
        }
        if (is_array($variants)) {
            foreach ($variants as $variantData) {
                if (is_array($variantData)) {
                    $sizeName = $variantData['size'] ?? $variantData['name'] ?? '';
                    if (!empty($sizeName)) {
                        $product->variants()->updateOrCreate(
                            ['product_id' => $product->id, 'size' => $sizeName],
                            ['stock' => $variantData['stock'] ?? 0]
                        );
                    }
                }
            }
        }

        // Handle images order and is_primary
        $images = $request->images;
        if (is_string($images)) {
            $images = json_decode($images, true) ?? [];
        }
        if (is_array($images)) {
            $incomingUrls = [];
            foreach ($images as $index => $imageData) {
                $imageUrl = is_array($imageData)
                    ? ($imageData['url'] ?? $imageData['image_url'] ?? '')
                    : (is_string($imageData) ? $imageData : '');

                if (!empty($imageUrl)) {
                    $incomingUrls[] = $imageUrl;
                    $isPrimary = is_array($imageData)
                        ? ($imageData['is_primary'] ?? ($index === 0))
                        : ($index === 0);

                    // Update existing or create new with explicit order & is_primary
                    $image = $product->images()
                        ->where('image_url', $imageUrl)
                        ->first();
                    if ($image) {
                        $image->update([
                            'order' => $index,
                            'is_primary' => $isPrimary
                        ]);
                    } else {
                        $product->images()->create([
                            'image_url' => $imageUrl,
                            'order' => $index,
                            'is_primary' => $isPrimary
                        ]);
                    }
                }
            }

            // Remove images that were removed by admin
            if (!empty($incomingUrls)) {
                $product->images()->whereNotIn('image_url', $incomingUrls)->delete();
            }
        }

        return response()->json($product->load(['images', 'variants', 'category']));
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

        $imageUrl = Storage::disk('public')->url($path);

        $image = $product->images()->create([
            'image_url' => $imageUrl,
            'order' => 1,
            'is_primary' => true
        ]);

        return response()->json($image, 201);
    }

    public function removeImage($imageId)
    {
        $image = ProductImage::findOrFail($imageId);
        Storage::disk('public')->delete(str_replace('/storage/', '', $image->image_url));
        $image->delete();
        return response()->json(['message' => 'Image removed successfully']);
    }
}
