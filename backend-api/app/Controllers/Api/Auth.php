<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;

class Auth extends ResourceController
{
    protected $format = 'json';

    public function login()
    {
        $username = strtolower($this->request->getVar('username'));
        $password = $this->request->getVar('password');

        if (!$username || !$password) {
            return $this->respond([
                'status'   => 400,
                'error'    => true,
                'messages' => 'Username dan password wajib diisi'
            ], 400);
        }

        $model = new UserModel();

        $user = $model->groupStart()
            ->where('username', $username)
            ->orWhere('useremail', $username)
            ->groupEnd()
            ->first();

        if (!$user) {
            return $this->respond([
                'status'   => 401,
                'error'    => true,
                'messages' => 'Username atau password salah'
            ], 401);
        }

        // cek password (plain + hash support)
        $isValidPassword =
            ($password === $user['userpassword']) ||
            password_verify($password, $user['userpassword']);

        if (!$isValidPassword) {
            return $this->respond([
                'status'   => 401,
                'error'    => true,
                'messages' => 'Username atau password salah'
            ], 401);
        }

        // TOKEN SIMPLE (sesuai permintaan kamu)
        $token = base64_encode("TOKEN-SECRET-" . $user['username']);

        return $this->respond([
            'status'   => 200,
            'error'    => null,
            'messages' => 'Login berhasil',
            'data'     => [
                'id'       => $user['id'],
                'nama'     => $user['nama'],
                'username' => $user['username'],
                'role'     => $user['role'],
                'token'    => $token
            ]
        ], 200);
    }

    public function register()
    {
        $rules = [
            'nama'         => 'required|min_length[3]|max_length[100]',
            'username'     => 'required|min_length[3]|max_length[50]|is_unique[users.username]',
            'useremail'    => 'required|valid_email|is_unique[users.useremail]',
            'userpassword' => 'required|min_length[6]',
            'role'         => 'permit_empty|in_list[admin,staff_gudang]',
        ];

        if (!$this->validate($rules)) {
            return $this->respond([
                'status'   => 400,
                'error'    => true,
                'messages' => $this->validator->getErrors()
            ], 400);
        }

        $model = new UserModel();

        $role = $this->request->getVar('role') ?? 'staff_gudang';

        $data = [
            'nama'         => $this->request->getVar('nama'),
            'username'     => strtolower($this->request->getVar('username')),
            'useremail'    => $this->request->getVar('useremail'),
            'userpassword' => password_hash($this->request->getVar('userpassword'), PASSWORD_DEFAULT),
            'role'         => $role,
        ];

        $model->insert($data);

        return $this->respondCreated([
            'status'   => 201,
            'error'    => null,
            'messages' => 'Registrasi berhasil'
        ]);
    }
}