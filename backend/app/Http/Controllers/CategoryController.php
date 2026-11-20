<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:categories,name'
        ]);

        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name)
        ]);

        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([  
            'name' => 'sometimes|string|unique:categories,name,' . $category->id
        ]);

        $category->update($request->only(['name']));

        return response()->json($category);
    }

    public function destroy($id)
    {
        Category::destroy($id);
        return response()->json(['message' => 'Category deleted successfully']);
    }
}
