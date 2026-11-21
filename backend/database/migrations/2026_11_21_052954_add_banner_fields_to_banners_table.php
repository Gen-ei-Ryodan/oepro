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
        Schema::table('banners', function (Blueprint $table) {
            $table->string('headline')->nullable();
            $table->text('subheadline')->nullable();
            $table->string('tag')->nullable();
            $table->string('cta_text')->nullable();
            $table->string('cta_link')->nullable();
            $table->string('image_layout')->nullable()->default('cover');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->dropColumn('headline');
            $table->dropColumn('subheadline');
            $table->dropColumn('tag');
            $table->dropColumn('cta_text');
            $table->dropColumn('cta_link');
            $table->dropColumn('image_layout');
        });
    }
};
