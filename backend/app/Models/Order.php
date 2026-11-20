<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $guarded = [];

    protected $casts = [
        'total_amount' => 'float',
        'payload_json' => 'array',
    ];
}
