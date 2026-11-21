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
            $table->json('variants_data')->nullable()->after('features');
            $table->string('variant_level1_name')->nullable()->after('variants_data');
            $table->string('variant_level2_name')->nullable()->after('variant_level1_name');
            $table->boolean('has_variants')->default(true)->after('variant_level2_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['variants_data', 'variant_level1_name', 'variant_level2_name', 'has_variants']);
        });
    }
};
