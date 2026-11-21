<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Banner;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Default Admin User
        User::firstOrCreate(
            ['email' => 'admin@oepro.com'],
            [
                'name' => 'Admin OEPro',
                'password' => bcrypt('password')
            ]
        );

        // Default banner
        Banner::firstOrCreate(
            ['id' => 1],
            [
                'title' => 'Hero Banner',
                'headline' => 'Welcome to OEPro',
                'subheadline' => 'Premium quality apparel',
                'image_url' => '/assets/banners/hero-banner-new.jpg',
                'image_layout' => 'full-width',
                'order' => 0,
                'is_active' => true
            ]
        );

        $this->call(UserSeeder::class);
        $this->call(ProductSeeder::class);
    }
}
