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
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('title');
    $table->string('image_url');
    $table->string('link_url')->nullable();
    $table->string('target_type')->default('all');
    $table->string('aspect_ratio')->default('16:9');
    $table->integer('order')->default(0);
    $table->boolean('is_active')->default(true);
    $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};
