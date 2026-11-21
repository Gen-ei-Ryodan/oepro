<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class AdminBannerController extends Controller
{
    public function index()
    {
        $banners = Banner::orderBy('order')->get();
        return view('admin.banners.index', compact('banners'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'subheadline' => 'nullable|string',
            'cta_link'    => 'nullable|string|max:255',
            'order'       => 'nullable|integer|min:1',
            'is_active'   => 'nullable|boolean',
            'image'       => 'nullable|image|max:5120',
        ]);

        $data['is_active'] = $request->boolean('is_active');
        $data['order'] = $data['order'] ?? (Banner::max('order') + 1);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('banners', 'public');
            $data['image_url'] = '/storage/' . $path;
        }

        Banner::create($data);

        return redirect()->route('admin.banner.index')->with('success', 'Banner berhasil ditambahkan.');
    }

    public function update(Request $request, int $id)
    {
        $banner = Banner::findOrFail($id);

        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'subheadline' => 'nullable|string',
            'cta_link'    => 'nullable|string|max:255',
            'order'       => 'nullable|integer|min:1',
            'is_active'   => 'nullable|boolean',
            'image'       => 'nullable|image|max:5120',
        ]);

        $data['is_active'] = $request->boolean('is_active');

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('banners', 'public');
            $data['image_url'] = '/storage/' . $path;
        }

        $banner->update($data);

        return redirect()->route('admin.banner.index')->with('success', 'Banner berhasil diperbarui.');
    }

    public function destroy(int $id)
    {
        Banner::findOrFail($id)->delete();
        return redirect()->route('admin.banner.index')->with('success', 'Banner berhasil dihapus.');
    }
}
