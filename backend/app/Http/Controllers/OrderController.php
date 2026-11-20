<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'customer_name' => 'required|string',
            'customer_phone' => 'required|string',
            'customer_address' => 'required|string',
            'total_amount' => 'required|numeric',
            'payload_json' => 'required|json'
        ]);

        $order = Order::create($validatedData);

        return response()->json($order, 201);
    }

    public function index()
    {
        $orders = Order::latest()->get();
        return response()->json($orders);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validatedData = $request->validate([
            'status' => 'required|string'
        ]);

        $order->update($validatedData);

        return response()->json($order);
    }
}
