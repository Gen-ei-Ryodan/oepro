<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Banner;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::where('is_active', true)->orderBy('order', 'asc')->get();
        return response()->json($banners);
    }

    public function store(Request $request)
    {
        // Validate request inputs
        $request->validate([
            'title' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'order' => 'required|integer'
        ]);

        // Store image publicly
        $path = $request->file('image')->store('banners', 'public');

        $banner = Banner::create([
            'title' => $request->title,
            'image_url' => Storage::url($path),
            'order' => $request->order,
            'is_active' => true
        ]);

        return response()->json($banner, 201);
    }

    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|string',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            'order' => 'sometimes|integer',
            'is_active' => 'sometimes|boolean'
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            Storage::disk('public')->delete(str_replace('/storage/', '', $banner->image_url));

            $path = $request->file('image')->store('banners', 'public');
            $banner->image_url = Storage::url($path);
        }

        $banner->update($request->only('title', 'order', 'is_active'));

        return response()->json($banner);
    }

    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);
        Storage::disk('public')->delete(str_replace('/storage/', '', $banner->image_url));
        $banner->delete();

        return response()->json(['message' => 'Banner deleted successfully']);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:banners,id',
            'orders.*.order' => 'required|integer'
        ]);

        foreach ($request->orders as $item) {
            Banner::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json(['message' => 'Banners reordered successfully']);
    }
}
