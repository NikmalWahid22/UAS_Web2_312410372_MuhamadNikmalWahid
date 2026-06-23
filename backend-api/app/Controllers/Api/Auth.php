<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;

class Auth extends ResourceController
{
    protected $format = 'json';

    public function login()
    {
        $username = '';
        $password = '';

        // Coba baca sebagai JSON dengan aman (cek header & raw body)
        $contentType = $this->request->getHeaderLine('Content-Type');
        if (strpos($contentType, 'application/json') !== false) {
            $rawBody = $this->request->getBody();
            if (!empty($rawBody)) {
                $json = json_decode($rawBody, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($json)) {
                    $username = $json['username'] ?? '';
                    $password = $json['password'] ?? '';
                }
            }
        }

        // Kalau kosong atau bukan JSON, baca dari form/POST/GET (aman, tidak pernah throw exception)
        if (empty($username)) {
            $username = $this->request->getPost('username') ?? $this->request->getGet('username') ?? '';
            $password = $this->request->getPost('password') ?? $this->request->getGet('password') ?? '';
        }

        $model = new UserModel();
        $user = $model->where('username', $username)
            ->orWhere('useremail', $username)
            ->first();

        if ($user) {
            if (
                $password === $user['userpassword'] ||
                password_verify($password, $user['userpassword'])
            ) {
                return $this->respond([
                    'status' => 200,
                    'error' => null,
                    'messages' => 'Login Berhasil',
                    'data' => [
                        'id' => $user['id'],
                        'nama' => $user['nama'],
                        'username' => $user['username'],
                        'role' => $user['role'],
                        'token' => base64_encode("TOKEN-SECRET-" . $user['username'])
                    ]
                ], 200);
            }
        }

        return $this->failUnauthorized('Username atau Password salah.');
    }

    public function register()
    {
        $nama = '';
        $username = '';
        $useremail = '';
        $userpassword = '';
        $role = '';

        // Coba baca sebagai JSON dengan aman
        $contentType = $this->request->getHeaderLine('Content-Type');
        if (strpos($contentType, 'application/json') !== false) {
            $rawBody = $this->request->getBody();
            if (!empty($rawBody)) {
                $json = json_decode($rawBody, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($json)) {
                    $nama = $json['nama'] ?? '';
                    $username = $json['username'] ?? '';
                    $useremail = $json['useremail'] ?? '';
                    $userpassword = $json['userpassword'] ?? '';
                    $role = $json['role'] ?? '';
                }
            }
        }

        // Fallback ke form/POST/GET jika kosong
        if (empty($username)) {
            $nama = $this->request->getPost('nama') ?? $this->request->getGet('nama') ?? '';
            $username = $this->request->getPost('username') ?? $this->request->getGet('username') ?? '';
            $useremail = $this->request->getPost('useremail') ?? $this->request->getGet('useremail') ?? '';
            $userpassword = $this->request->getPost('userpassword') ?? $this->request->getGet('userpassword') ?? '';
            $role = $this->request->getPost('role') ?? $this->request->getGet('role') ?? '';
        }

        $role = $role ?: 'staff_gudang';

        $rules = [
            'nama' => 'required|min_length[3]|max_length[100]',
            'username' => 'required|min_length[3]|max_length[50]|is_unique[users.username]',
            'useremail' => 'required|valid_email|is_unique[users.useremail]',
            'userpassword' => 'required|min_length[6]',
            'role' => 'permit_empty|in_list[admin,staff_gudang]',
        ];

        $data = [
            'nama' => $nama,
            'username' => $username,
            'useremail' => $useremail,
            'userpassword' => $userpassword,
            'role' => $role,
        ];

        // Jalankan validasi menggunakan array data eksplisit agar tidak men-trigger getVar internal
        $validation = \Config\Services::validation();
        $validation->setRules($rules);

        if (!$validation->run($data)) {
            return $this->failValidationErrors($validation->getErrors());
        }

        $model = new UserModel();

        $insertData = [
            'nama' => $nama,
            'username' => $username,
            'useremail' => $useremail,
            'userpassword' => password_hash($userpassword, PASSWORD_DEFAULT),
            'role' => $role,
        ];

        $model->insert($insertData);

        return $this->respondCreated([
            'status' => 201,
            'messages' => 'Registrasi Berhasil. Silakan login.'
        ]);
    }
}