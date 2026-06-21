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
        // Bypass GET and OPTIONS requests (public endpoints)
        $method = strtolower($request->getMethod());
        if ($method === 'get' || $method === 'options') {
            return;
        }

        $authHeader = $request->getServer('HTTP_AUTHORIZATION');

        if (!$authHeader) {
            $response = Services::response();
            $response->setStatusCode(401);
            return $response->setJSON([
                'status'   => 401,
                'error'    => 401,
                'messages' => 'Akses Ditolak. Token tidak ditemukan!'
            ]);
        }

        $token = null;
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
        }

        if (!$token || empty($token)) {
            $response = Services::response();
            $response->setStatusCode(401);
            return $response->setJSON([
                'status'   => 401,
                'error'    => 401,
                'messages' => 'Token tidak valid atau kedaluwarsa!'
            ]);
        }

        // Decode and validate token
        $decoded = base64_decode($token, true);
        if ($decoded === false || strpos($decoded, "TOKEN-SECRET-") !== 0) {
            $response = Services::response();
            $response->setStatusCode(401);
            return $response->setJSON([
                'status'   => 401,
                'error'    => 401,
                'messages' => 'Token tidak valid atau kedaluwarsa!'
            ]);
        }

        $username = str_replace("TOKEN-SECRET-", "", $decoded);

        // Verify user exists in database
        $userModel = new \App\Models\UserModel();
        $user      = $userModel->where('username', $username)->first();

        if (!$user) {
            $response = Services::response();
            $response->setStatusCode(401);
            return $response->setJSON([
                'status'   => 401,
                'error'    => 401,
                'messages' => 'Token tidak valid atau kedaluwarsa!'
            ]);
        }

        // Role check: If filter requires 'admin', check if user is admin
        if ($arguments && in_array('admin', $arguments)) {
            if ($user['role'] !== 'admin') {
                $response = Services::response();
                $response->setStatusCode(403);
                return $response->setJSON([
                    'status'   => 403,
                    'error'    => 403,
                    'messages' => 'Akses Ditolak. Anda bukan Administrator!'
                ]);
            }
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Tidak diperlukan
    }
}