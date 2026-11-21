<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images']);

        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('sku', 'like', "%{$q}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $products = $query->latest()->paginate(25)->withQueryString();
        $categories = Category::orderBy('name')->get();

        return view('admin.products.index', compact('products', 'categories'));
    }

    public function create()
    {
        $categories = Category::orderBy('name')->get();
        return view('admin.products.form', compact('categories'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'             => 'required|string|max:255',
            'category_id'      => 'required|exists:categories,id',
            'price'            => 'required|numeric|min:0',
            'original_price'   => 'nullable|numeric|min:0',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'stock'            => 'nullable|integer|min:0',
            'sku'              => 'nullable|string|max:100',
            'material'         => 'nullable|string|max:255',
            'fit'              => 'nullable|string|max:255',
            'description'      => 'nullable|string',
            'features_raw'     => 'nullable|string',
            'is_featured'      => 'nullable|boolean',
            'is_best_seller'   => 'nullable|boolean',
            'is_new_arrival'   => 'nullable|boolean',
            'images.*'         => 'nullable|image|max:5120',
            'variants'         => 'nullable|array',
        ]);

        $data['slug'] = Str::slug($request->name) . '-' . Str::random(5);
        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_best_seller'] = $request->boolean('is_best_seller');
        $data['is_new_arrival'] = $request->boolean('is_new_arrival');

        // Parse features
        if (!empty($request->features_raw)) {
            $lines = preg_split('/\r\n|\r|\n/', $request->features_raw);
            $data['features'] = array_values(array_filter(array_map('trim', $lines)));
        }

        // Process Variants
        $variantsList = [];
        $sizesList = [];
        if ($request->has('variants') && is_array($request->variants)) {
            foreach ($request->variants as $v) {
                if (!empty($v['name'])) {
                    $variantsList[] = [
                        'name' => trim($v['name']),
                        'price' => (float) ($v['price'] ?? $data['price']),
                        'original_price' => (float) ($v['original_price'] ?? ($data['original_price'] ?? $data['price'])),
                        'stock' => (int) ($v['stock'] ?? 25),
                        'sku' => $v['sku'] ?? ($data['sku'] . '-' . trim($v['name'])),
                    ];
                    $sizesList[] = trim($v['name']);
                }
            }
        }

        if (!empty($variantsList)) {
            $data['variants_data'] = $variantsList;
            $data['sizes'] = $sizesList;
            $data['has_variants'] = true;
        }

        // Calculate discount percent if empty
        if (empty($data['discount_percent']) && !empty($data['original_price']) && $data['original_price'] > $data['price']) {
            $data['discount_percent'] = round((($data['original_price'] - $data['price']) / $data['original_price']) * 100);
        }

        $product = Product::create($data);

        // Upload images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $idx => $file) {
                $path = $file->store('products', 'public');
                $product->images()->create([
                    'image_url'  => '/storage/' . $path,
                    'order'      => $idx,
                    'is_primary' => ($idx === 0),
                ]);
            }
        }

        return redirect()->route('admin.produk.index')->with('success', 'Produk "' . $product->name . '" berhasil dibuat.');
    }

    public function edit(int $id)
    {
        $product = Product::with(['images', 'category'])->findOrFail($id);
        $categories = Category::orderBy('name')->get();
        return view('admin.products.form', compact('product', 'categories'));
    }

    public function update(Request $request, int $id)
    {
        $product = Product::findOrFail($id);

        $data = $request->validate([
            'name'             => 'required|string|max:255',
            'category_id'      => 'required|exists:categories,id',
            'price'            => 'required|numeric|min:0',
            'original_price'   => 'nullable|numeric|min:0',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'stock'            => 'nullable|integer|min:0',
            'sku'              => 'nullable|string|max:100',
            'material'         => 'nullable|string|max:255',
            'fit'              => 'nullable|string|max:255',
            'description'      => 'nullable|string',
            'features_raw'     => 'nullable|string',
            'is_featured'      => 'nullable|boolean',
            'is_best_seller'   => 'nullable|boolean',
            'is_new_arrival'   => 'nullable|boolean',
            'new_images.*'     => 'nullable|image|max:5120',
            'image_order'      => 'nullable|array',
            'variants'         => 'nullable|array',
        ]);

        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_best_seller'] = $request->boolean('is_best_seller');
        $data['is_new_arrival'] = $request->boolean('is_new_arrival');

        // Parse features
        if (isset($request->features_raw)) {
            $lines = preg_split('/\r\n|\r|\n/', $request->features_raw);
            $data['features'] = array_values(array_filter(array_map('trim', $lines)));
        }

        // Process Variants 1 Tingkat
        if ($request->has('variants') && is_array($request->variants)) {
            $variantsList = [];
            $sizesList = [];
            foreach ($request->variants as $v) {
                if (!empty($v['name'])) {
                    $variantsList[] = [
                        'name' => trim($v['name']),
                        'price' => (float) ($v['price'] ?? $data['price']),
                        'original_price' => (float) ($v['original_price'] ?? ($data['original_price'] ?? $data['price'])),
                        'stock' => (int) ($v['stock'] ?? 25),
                        'sku' => $v['sku'] ?? ($data['sku'] . '-' . trim($v['name'])),
                    ];
                    $sizesList[] = trim($v['name']);
                }
            }
            $data['variants_data'] = $variantsList;
            $data['sizes'] = $sizesList;
            $data['has_variants'] = true;
        }

        // Discount percent recalculation
        if (!empty($data['original_price']) && $data['original_price'] > $data['price']) {
            $data['discount_percent'] = round((($data['original_price'] - $data['price']) / $data['original_price']) * 100);
        }

        // Direct update to database
        $product->update($data);

        // Upload new images if any
        if ($request->hasFile('new_images')) {
            $currentCount = $product->images()->count();
            foreach ($request->file('new_images') as $idx => $file) {
                $path = $file->store('products', 'public');
                $product->images()->create([
                    'image_url'  => '/storage/' . $path,
                    'order'      => $currentCount + $idx,
                    'is_primary' => ($currentCount === 0 && $idx === 0),
                ]);
            }
        }

        // Reorder images if image_order sent (Drag and drop)
        if ($request->has('image_order') && is_array($request->image_order)) {
            foreach ($request->image_order as $orderIdx => $imgId) {
                $product->images()->where('id', $imgId)->update([
                    'order' => $orderIdx,
                    'is_primary' => ($orderIdx === 0),
                ]);
            }
        }

        return redirect()->route('admin.produk.index')->with('success', 'Produk "' . $product->name . '" berhasil diperbarui!');
    }

    public function deleteImage(int $productId, int $imageId)
    {
        $product = Product::findOrFail($productId);
        $image = $product->images()->findOrFail($imageId);

        // Remove disk file if local storage
        if (str_starts_with($image->image_url, '/storage/')) {
            $diskPath = str_replace('/storage/', '', $image->image_url);
            Storage::disk('public')->delete($diskPath);
        }

        $image->delete();

        // If primary was deleted, set next image as primary
        if ($image->is_primary) {
            $next = $product->images()->first();
            if ($next) {
                $next->update(['is_primary' => true]);
            }
        }

        return back()->with('success', 'Foto produk berhasil dihapus.');
    }

    public function destroy(int $id)
    {
        $product = Product::findOrFail($id);

        foreach ($product->images as $img) {
            if (str_starts_with($img->image_url, '/storage/')) {
                $diskPath = str_replace('/storage/', '', $img->image_url);
                Storage::disk('public')->delete($diskPath);
            }
            $img->delete();
        }

        $product->delete();

        return redirect()->route('admin.produk.index')->with('success', 'Produk berhasil dihapus.');
    }
}
