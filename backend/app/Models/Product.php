<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $guarded = [];

    protected $casts = [
        'price' => 'float',
        'original_price' => 'float',
        'discount_percent' => 'integer',
        'rating' => 'float',
        'min_order' => 'integer',
        'stock' => 'integer',
        'sold_count' => 'integer',
        'sizes' => 'array',
        'colors' => 'array',
        'features' => 'array',
        'variants_data' => 'array',
        'has_variants' => 'boolean',
        'is_best_seller' => 'boolean',
        'is_featured' => 'boolean',
        'is_new_arrival' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('order', 'asc');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function toArray()
    {
        $array = parent::toArray();
        if (!empty($this->variants_data)) {
            $array['variants'] = $this->variants_data;
        } elseif (empty($array['variants']) && !empty($this->sizes)) {
            $cat = ($this->category ? $this->category->name : '') ?: $this->name;
            $catLower = strtolower($cat);
            $basePrice = $this->price;
            $baseOrig = $this->original_price ?: round($basePrice * 1.25 / 1000) * 1000;

            $poloTiers = [
                'XS' => [92000, 119000], 'S' => [92000, 119000], 'M' => [92000, 119000], 'L' => [92000, 119000], 'XL' => [92000, 119000],
                '2XL' => [100000, 125000], '3XL' => [108000, 135000], '4XL' => [116000, 145000], '5XL' => [124000, 155000],
                '6XL' => [132000, 165000], '7XL' => [140000, 175000], '8XL' => [148000, 185000]
            ];
            $lsTiers = [
                'XS' => [72000, 89000], 'S' => [72000, 89000], 'M' => [72000, 89000], 'L' => [72000, 89000], 'XL' => [72000, 89000],
                '2XL' => [79000, 98000], '3XL' => [86000, 107000], '4XL' => [93000, 116000], '5XL' => [100000, 125000],
                '6XL' => [107000, 134000], '7XL' => [114000, 143000], '8XL' => [121000, 151000]
            ];
            $tsTiers = [
                'XS' => [62000, 79000], 'S' => [62000, 79000], 'M' => [62000, 79000], 'L' => [62000, 79000], 'XL' => [62000, 79000],
                '2XL' => [67000, 85000], '3XL' => [72000, 90000], '4XL' => [77000, 96000], '5XL' => [82000, 103000],
                '6XL' => [87000, 109000], '7XL' => [92000, 115000], '8XL' => [97000, 121000]
            ];

            $tierTable = str_contains($catLower, 'polo') ? $poloTiers : (str_contains($catLower, 'longsleeve') || str_contains($catLower, 'lengan panjang') ? $lsTiers : $tsTiers);

            $primaryImg = $this->images->first()?->image_url ?? '';
            $flat = [];
            foreach ($this->sizes as $sz) {
                $szUpper = strtoupper(trim($sz));
                $pair = $tierTable[$szUpper] ?? [$basePrice, $baseOrig];
                $flat[] = [
                    'id' => 'var-' . $this->id . '-' . strtolower($szUpper),
                    'name' => $szUpper,
                    'price' => $pair[0],
                    'original_price' => $pair[1],
                    'stock' => 25,
                    'sku' => ($this->sku ?: 'OEP') . '-' . $szUpper,
                    'image' => $primaryImg,
                ];
            }
            $array['variants'] = $flat;
        }
        return $array;
    }
}
