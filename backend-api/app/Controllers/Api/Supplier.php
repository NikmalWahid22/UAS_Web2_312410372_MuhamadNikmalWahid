<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\SupplierModel;

class Supplier extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new SupplierModel();
        return $this->respond([
            'status' => 200,
            'data'   => $model->findAll()
        ]);
    }

    public function show($id = null)
    {
        $model = new SupplierModel();
        $data  = $model->find($id);

        if (!$data) {
            return $this->failNotFound('Supplier tidak ditemukan.');
        }

        return $this->respond(['status' => 200, 'data' => $data]);
    }

    public function create()
    {
        $input = $this->getRequestInput();

        $rules = [
            'nama_supplier' => 'required|min_length[3]|max_length[100]',
            'telepon'       => 'required|min_length[5]|max_length[20]',
            'email'         => 'permit_empty|valid_email',
        ];

        $validation = \Config\Services::validation();
        $validation->setRules($rules);

        if (!$validation->run($input)) {
            return $this->failValidationErrors($validation->getErrors());
        }

        $model = new SupplierModel();
        $data  = [
            'nama_supplier' => $input['nama_supplier'] ?? '',
            'alamat'        => $input['alamat'] ?? null,
            'telepon'       => $input['telepon'] ?? '',
            'email'         => $input['email'] ?? null,
        ];

        $model->insert($data);

        return $this->respondCreated([
            'status'   => 201,
            'messages' => 'Supplier berhasil ditambahkan.'
        ]);
    }

    public function update($id = null)
    {
        $model = new SupplierModel();

        if (!$model->find($id)) {
            return $this->failNotFound('Supplier tidak ditemukan.');
        }

        $input = $this->getRequestInput();

        $rules = [
            'nama_supplier' => 'required|min_length[3]|max_length[100]',
            'telepon'       => 'required|min_length[5]|max_length[20]',
            'email'         => 'permit_empty|valid_email',
        ];

        $validation = \Config\Services::validation();
        $validation->setRules($rules);

        if (!$validation->run($input)) {
            return $this->failValidationErrors($validation->getErrors());
        }

        $data  = [
            'nama_supplier' => $input['nama_supplier'] ?? '',
            'alamat'        => $input['alamat'] ?? null,
            'telepon'       => $input['telepon'] ?? '',
            'email'         => $input['email'] ?? null,
        ];

        $model->update($id, $data);

        return $this->respond([
            'status'   => 200,
            'messages' => 'Supplier berhasil diubah.'
        ]);
    }

    public function delete($id = null)
    {
        $model = new SupplierModel();

        if (!$model->find($id)) {
            return $this->failNotFound('Supplier tidak ditemukan.');
        }

        $model->delete($id);

        return $this->respondDeleted([
            'status'   => 200,
            'messages' => 'Supplier berhasil dihapus.'
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