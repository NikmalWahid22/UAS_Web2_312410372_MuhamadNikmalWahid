<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\Http\RequestInterface;
use CodeIgniter\Http\ResponseInterface;
use Config\Services;

class ApiAuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        // Allow preflight OPTIONS (WAJIB untuk CORS)
        if ($request->getMethod() === 'options') {
            return;
        }

        // GET tetap HARUS DI-SECURE kalau pakai filter
        // jadi HAPUS bypass GET (ini bug di versi kamu)
        
        $authHeader = $request->getServer('HTTP_AUTHORIZATION');

        if (!$authHeader) {
            return $this->unauthorized('Token tidak ditemukan!');
        }

        // Ambil token Bearer
        if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return $this->unauthorized('Token tidak valid!');
        }

        $token = $matches[1];

        if (empty($token)) {
            return $this->unauthorized('Token tidak valid atau kosong!');
        }

        // Decode token
        $decoded = base64_decode($token, true);

        if ($decoded === false || strpos($decoded, "TOKEN-SECRET-") !== 0) {
            return $this->unauthorized('Token tidak valid atau kedaluwarsa!');
        }

        $username = str_replace("TOKEN-SECRET-", "", $decoded);

        // Cek user di DB
        $userModel = new \App\Models\UserModel();
        $user = $userModel->where('username', $username)->first();

        if (!$user) {
            return $this->unauthorized('User tidak ditemukan!');
        }

        // ROLE CHECK
        if (!empty($arguments) && in_array('admin', $arguments)) {
            if ($user['role'] !== 'admin') {
                return $this->forbidden('Akses ditolak. Bukan admin!');
            }
        }

        // OPTIONAL: inject user ke request (biar controller bisa pakai)
        $request->setHeader('X-User-Id', $user['id']);
        $request->setHeader('X-User-Role', $user['role']);
    }

    private function unauthorized($message)
    {
        $response = Services::response();
        return $response->setStatusCode(401)->setJSON([
            'status' => 401,
            'message' => $message
        ]);
    }

    private function forbidden($message)
    {
        $response = Services::response();
        return $response->setStatusCode(403)->setJSON([
            'status' => 403,
            'message' => $message
        ]);
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // tidak dipakai
    }
}