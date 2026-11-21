<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use RuntimeException;

class ProductSeeder extends Seeder
{
    private const IMAGE_ROOT = 'assets/';

    /**
     * Seed categories, products and product images from the catalog JSON files.
     */
    public function run(): void
    {
        $dataDir = $this->dataDirectory();

        $categories = json_decode(file_get_contents($dataDir.'/categories.json'), true, 512, JSON_THROW_ON_ERROR);
        $products = json_decode(file_get_contents($dataDir.'/products.json'), true, 512, JSON_THROW_ON_ERROR);

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                ['name' => $category['name']]
            );
        }

        $categoryIds = Category::pluck('id', 'slug');

        foreach ($products as $product) {
            $record = Product::updateOrCreate(
                ['slug' => $product['slug']],
                [
                    'name' => $product['name'],
                    'category_id' => $categoryIds[$product['category_slug']] ?? null,
                    'description' => $product['description'] ?? null,
                    'price' => $product['price'],
                    'original_price' => $product['original_price'] ?? null,
                    'discount_percent' => $product['discount_percent'] ?? 0,
                    'rating' => $product['rating'] ?? 0,
                    'sku' => $product['sku'] ?? null,
                    'material' => $product['material'] ?? null,
                    'fit' => $product['fit'] ?? null,
                    'sizes' => $product['sizes'] ?? [],
                    'colors' => $product['colors'] ?? [],
                    'features' => $product['features'] ?? [],
                    'stock' => $product['stock'] ?? 0,
                    'sold_count' => $product['sold_count'] ?? 0,
                    'is_best_seller' => (bool) ($product['is_best_seller'] ?? false),
                    'is_featured' => (bool) ($product['is_featured'] ?? false),
                    'is_new_arrival' => (bool) ($product['is_new_arrival'] ?? false),
                ]
            );

            $record->images()->delete();

            foreach (array_values($product['images'] ?? []) as $index => $image) {
                $record->images()->create([
                    'image_url' => '/storage/'.Str::after($image, self::IMAGE_ROOT),
                    'order' => $index,
                    'is_primary' => $index === 0,
                ]);
            }
        }
    }

    /**
     * Resolve the catalog data directory: repo root on dev, database/data once deployed.
     */
    private function dataDirectory(): string
    {
        foreach ([dirname(base_path()).'/data', base_path('database/data')] as $directory) {
            if (is_file($directory.'/products.json')) {
                return $directory;
            }
        }

        throw new RuntimeException('Catalog data directory not found (products.json).');
    }
}
