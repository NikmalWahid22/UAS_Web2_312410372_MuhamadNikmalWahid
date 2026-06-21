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
        $rules = [
            'nama_kategori' => 'required|min_length[3]|max_length[100]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $model = new KategoriModel();
        $data  = [
            'nama_kategori' => $this->request->getVar('nama_kategori'),
            'deskripsi'     => $this->request->getVar('deskripsi'),
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

        $rules = [
            'nama_kategori' => 'required|min_length[3]|max_length[100]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data  = [
            'nama_kategori' => $this->request->getVar('nama_kategori'),
            'deskripsi'     => $this->request->getVar('deskripsi'),
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
}