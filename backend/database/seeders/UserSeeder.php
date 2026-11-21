<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@oepro.id'],
            [
                'name' => 'Admin OEPro',
                'password' => bcrypt('admin123')
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@oepro.com'],
            [
                'name' => 'Admin OEPro',
                'password' => bcrypt('password')
            ]
        );
    }
}