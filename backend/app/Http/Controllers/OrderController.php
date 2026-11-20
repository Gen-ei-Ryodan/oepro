<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;

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

        $request->validate([
            'status' => 'required|string|in:pending,processing,completed,cancelled'
        ]);

        $order->update(['status' => $request->status]);

        return response()->json($order);
    }
}
