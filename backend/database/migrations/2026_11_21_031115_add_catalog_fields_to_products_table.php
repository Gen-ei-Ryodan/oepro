<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('sku')->nullable()->after('slug');
            $table->decimal('original_price', 12, 2)->nullable()->after('price');
            $table->unsignedInteger('discount_percent')->default(0)->after('original_price');
            $table->decimal('rating', 3, 1)->default(0)->after('discount_percent');
            $table->unsignedInteger('stock')->default(0)->after('min_order');
            $table->unsignedInteger('sold_count')->default(0)->after('stock');
            $table->string('material')->nullable()->after('description');
            $table->string('fit')->nullable()->after('material');
            $table->json('sizes')->nullable()->after('fit');
            $table->json('colors')->nullable()->after('sizes');
            $table->json('features')->nullable()->after('colors');
            $table->boolean('is_best_seller')->default(false)->after('features');
            $table->boolean('is_featured')->default(false)->after('is_best_seller');
            $table->boolean('is_new_arrival')->default(false)->after('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'sku',
                'original_price',
                'discount_percent',
                'rating',
                'stock',
                'sold_count',
                'material',
                'fit',
                'sizes',
                'colors',
                'features',
                'is_best_seller',
                'is_featured',
                'is_new_arrival',
            ]);
        });
    }
};
