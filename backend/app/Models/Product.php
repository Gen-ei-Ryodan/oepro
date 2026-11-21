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
}
