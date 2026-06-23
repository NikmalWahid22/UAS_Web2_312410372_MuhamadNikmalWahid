<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;

class Auth extends ResourceController
{
    protected $format = 'json';

    public function login()
    {
        // Coba baca dari JSON dulu, kalau gagal baca dari form data
        $json = $this->request->getJSON();

        if ($json) {
            $username = $json->username ?? '';
            $password = $json->password ?? '';
        } else {
            $username = $this->request->getVar('username');
            $password = $this->request->getVar('password');
        }

        $model = new UserModel();
        $user  = $model->where('username', $username)
                    ->orWhere('useremail', $username)
                    ->first();

        if ($user) {
            if ($password === $user['userpassword'] ||
                password_verify($password, $user['userpassword'])) {
                return $this->respond([
                    'status'   => 200,
                    'error'    => null,
                    'messages' => 'Login Berhasil',
                    'data'     => [
                        'id'       => $user['id'],
                        'nama'     => $user['nama'],
                        'username' => $user['username'],
                        'role'     => $user['role'],
                        'token'    => base64_encode("TOKEN-SECRET-" . $user['username'])
                    ]
                ], 200);
            }
        }

        return $this->failUnauthorized('Username atau Password salah.');
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
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $model = new UserModel();

        $role = $this->request->getVar('role') ?: 'staff_gudang';

        $data = [
            'nama'         => $this->request->getVar('nama'),
            'username'     => $this->request->getVar('username'),
            'useremail'    => $this->request->getVar('useremail'),
            'userpassword' => password_hash($this->request->getVar('userpassword'), PASSWORD_DEFAULT),
            'role'         => $role,
        ];

        $model->insert($data);

        return $this->respondCreated([
            'status'   => 201,
            'messages' => 'Registrasi Berhasil. Silakan login.'
        ]);
    }
}