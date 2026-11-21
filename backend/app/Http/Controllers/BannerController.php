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
        $formatted = [];
        foreach ($banners as $banner) {
            $formatted[] = [
                'id' => $banner->id,
                'ctaText' => $banner->cta_text,
                'ctaLink' => $banner->cta_link,
                'imageLayout' => $banner->image_layout,
                'isActive' => $banner->is_active,
                'image' => $banner->image_url ?? $banner->image,
                'title' => $banner->title,
                'headline' => $banner->headline,
                'subheadline' => $banner->subheadline,
                'tag' => $banner->tag,
                'cta_text' => $banner->cta_text,
                'cta_link' => $banner->cta_link,
                'image_layout' => $banner->image_layout,
                'is_active' => $banner->is_active,
                'image_url' => $banner->image_url,
                'order' => $banner->order,
            ];
        }
        return response()->json($formatted);
    }

    public function store(Request $request)
    {
        // Validate request inputs (keys already normalized to snake_case by frontend)
        $request->validate([
            'title' => 'required|string',
            'headline' => 'sometimes|string',
            'subheadline' => 'sometimes|string',
            'tag' => 'sometimes|string',
            'cta_text' => 'sometimes|string',
            'cta_link' => 'sometimes|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'image_layout' => 'sometimes|string',
            'order' => 'required|integer',
            'is_active' => 'sometimes|boolean'
        ]);

        // Store image publicly
        $path = $request->file('image')->store('banners', 'public');

        $banner = Banner::create([
            'title' => $request->title,
            'headline' => $request->headline,
            'subheadline' => $request->subheadline,
            'tag' => $request->tag,
            'cta_text' => $request->cta_text,
            'cta_link' => $request->cta_link,
            'image_url' => Storage::url($path),
            'image' => $path,
            'image_layout' => $request->image_layout,
            'order' => $request->order,
            'is_active' => $request->is_active ?? true
        ]);

        return response()->json($banner, 201);
    }

    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|string',
            'headline' => 'sometimes|string',
            'subheadline' => 'sometimes|string',
            'tag' => 'sometimes|string',
            'cta_text' => 'sometimes|string',
            'cta_link' => 'sometimes|string',
            'image_layout' => 'sometimes|string',
            'order' => 'sometimes|integer',
            'is_active' => 'sometimes|boolean'
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            Storage::disk('public')->delete(str_replace('/storage/', '', $banner->image_url));

            $path = $request->file('image')->store('banners', 'public');
            $banner->image_url = Storage::url($path);
            $banner->image = $path;
        }

        $banner->update($request->only(
            'title',
            'headline',
            'subheadline',
            'tag',
            'cta_text',
            'cta_link',
            'image',
            'image_layout',
            'order',
            'is_active'
        ));

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
