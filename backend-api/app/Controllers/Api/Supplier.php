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
        $rules = [
            'nama_supplier' => 'required|min_length[3]|max_length[100]',
            'telepon'       => 'required|min_length[5]|max_length[20]',
            'email'         => 'permit_empty|valid_email',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $model = new SupplierModel();
        $data  = [
            'nama_supplier' => $this->request->getVar('nama_supplier'),
            'alamat'        => $this->request->getVar('alamat'),
            'telepon'       => $this->request->getVar('telepon'),
            'email'         => $this->request->getVar('email'),
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

        $rules = [
            'nama_supplier' => 'required|min_length[3]|max_length[100]',
            'telepon'       => 'required|min_length[5]|max_length[20]',
            'email'         => 'permit_empty|valid_email',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data  = [
            'nama_supplier' => $this->request->getVar('nama_supplier'),
            'alamat'        => $this->request->getVar('alamat'),
            'telepon'       => $this->request->getVar('telepon'),
            'email'         => $this->request->getVar('email'),
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
}