<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Session\TokenMismatchException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'auth.admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // Jika method not allowed pada area admin, kembalikan user secara aman
        $exceptions->render(function (MethodNotAllowedHttpException $e, Request $request) {
            if ($request->is('admin*')) {
                if (!session('admin_logged_in')) {
                    return redirect()->route('admin.login')->with('error', 'Sesi Anda telah berakhir, silakan login kembali.');
                }
                return redirect()->route('admin.produk.index')->with('error', 'Metode request tidak didukung.');
            }
        });

        // Token mismatch (CSRF Expired / Sesi habis)
        $exceptions->render(function (TokenMismatchException $e, Request $request) {
            if ($request->is('admin*')) {
                return redirect()->route('admin.login')->with('error', 'Sesi form Anda telah kedaluwarsa. Silakan login kembali.');
            }
            return redirect()->back()->with('error', 'Sesi form kedaluwarsa. Silakan coba lagi.');
        });
    })->create();
