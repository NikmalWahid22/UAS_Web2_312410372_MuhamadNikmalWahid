<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\KategoriModel;

class Kategori extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new KategoriModel();
        return $this->respond([
            'status' => 200,
            'data'   => $model->findAll()
        ]);
    }

    public function show($id = null)
    {
        $model = new KategoriModel();
        $data  = $model->find($id);

        if (!$data) {
            return $this->failNotFound('Kategori tidak ditemukan.');
        }

        return $this->respond(['status' => 200, 'data' => $data]);
    }

    public function create()
    {
        $input = $this->getRequestInput();

        $rules = [
            'nama_kategori' => 'required|min_length[3]|max_length[100]',
        ];

        $validation = \Config\Services::validation();
        $validation->setRules($rules);

        if (!$validation->run($input)) {
            return $this->failValidationErrors($validation->getErrors());
        }

        $model = new KategoriModel();
        $data  = [
            'nama_kategori' => $input['nama_kategori'] ?? '',
            'deskripsi'     => $input['deskripsi'] ?? null,
        ];

        $model->insert($data);

        return $this->respondCreated([
            'status'   => 201,
            'messages' => 'Kategori berhasil ditambahkan.'
        ]);
    }

    public function update($id = null)
    {
        $model = new KategoriModel();
        
        if (!$model->find($id)) {
            return $this->failNotFound('Kategori tidak ditemukan.');
        }

        $input = $this->getRequestInput();

        $rules = [
            'nama_kategori' => 'required|min_length[3]|max_length[100]',
        ];

        $validation = \Config\Services::validation();
        $validation->setRules($rules);

        if (!$validation->run($input)) {
            return $this->failValidationErrors($validation->getErrors());
        }

        $data  = [
            'nama_kategori' => $input['nama_kategori'] ?? '',
            'deskripsi'     => $input['deskripsi'] ?? null,
        ];

        $model->update($id, $data);

        return $this->respond([
            'status'   => 200,
            'messages' => 'Kategori berhasil diubah.'
        ]);
    }

    public function delete($id = null)
    {
        $model = new KategoriModel();

        if (!$model->find($id)) {
            return $this->failNotFound('Kategori tidak ditemukan.');
        }

        $model->delete($id);

        return $this->respondDeleted([
            'status'   => 200,
            'messages' => 'Kategori berhasil dihapus.'
        ]);
    }

    protected function getRequestInput()
    {
        $input = [];
        $contentType = $this->request->getHeaderLine('Content-Type');
        if (strpos($contentType, 'application/json') !== false) {
            $rawBody = file_get_contents('php://input');
            if (!empty($rawBody)) {
                $json = json_decode($rawBody, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($json)) {
                    $input = $json;
                }
            }
        }
        return array_merge(
            $this->request->getGet() ?? [],
            $this->request->getPost() ?? [],
            $input
        );
    }
}