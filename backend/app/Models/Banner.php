<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = [
        'title',
        'headline',
        'subheadline',
        'tag',
        'cta_text',
        'cta_link',
        'image_url',
        'image_layout',
        'order',
        'is_active',
    ];

    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];
}
