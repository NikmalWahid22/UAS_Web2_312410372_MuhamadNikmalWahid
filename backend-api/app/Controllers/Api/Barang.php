<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\BarangModel;

class Barang extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new BarangModel();
        return $this->respond([
            'status' => 200,
            'data'   => $model->getBarangLengkap()
        ]);
    }

    public function show($id = null)
    {
        $model = new BarangModel();
        $data  = $model->find($id);

        if (!$data) {
            return $this->failNotFound('Barang tidak ditemukan.');
        }

        return $this->respond(['status' => 200, 'data' => $data]);
    }

    public function create()
    {
        $rules = [
            'nama_barang'  => 'required|min_length[3]|max_length[100]',
            'id_kategori'  => 'required|integer',
            'id_supplier'  => 'required|integer',
            'stok'         => 'required|integer|greater_than_equal_to[0]',
            'harga'        => 'required|numeric|greater_than_equal_to[0]',
            'satuan'       => 'required|min_length[1]|max_length[20]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $id_kategori = $this->request->getVar('id_kategori');
        $id_supplier = $this->request->getVar('id_supplier');

        // Check if category exists
        $kategoriModel = new \App\Models\KategoriModel();
        if (!$kategoriModel->find($id_kategori)) {
            return $this->fail('Kategori tidak ditemukan.', 400);
        }

        // Check if supplier exists
        $supplierModel = new \App\Models\SupplierModel();
        if (!$supplierModel->find($id_supplier)) {
            return $this->fail('Supplier tidak ditemukan.', 400);
        }

        $model = new BarangModel();
        $data  = [
            'nama_barang'  => $this->request->getVar('nama_barang'),
            'id_kategori'  => $id_kategori,
            'id_supplier'  => $id_supplier,
            'stok'         => $this->request->getVar('stok'),
            'harga'        => $this->request->getVar('harga'),
            'satuan'       => $this->request->getVar('satuan'),
            'deskripsi'    => $this->request->getVar('deskripsi'),
        ];

        $model->insert($data);

        return $this->respondCreated([
            'status'   => 201,
            'messages' => 'Barang berhasil ditambahkan.'
        ]);
    }

    public function update($id = null)
    {
        $model = new BarangModel();

        if (!$model->find($id)) {
            return $this->failNotFound('Barang tidak ditemukan.');
        }

        $rules = [
            'nama_barang'  => 'required|min_length[3]|max_length[100]',
            'id_kategori'  => 'required|integer',
            'id_supplier'  => 'required|integer',
            'stok'         => 'required|integer|greater_than_equal_to[0]',
            'harga'        => 'required|numeric|greater_than_equal_to[0]',
            'satuan'       => 'required|min_length[1]|max_length[20]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $id_kategori = $this->request->getVar('id_kategori');
        $id_supplier = $this->request->getVar('id_supplier');

        // Check if category exists
        $kategoriModel = new \App\Models\KategoriModel();
        if (!$kategoriModel->find($id_kategori)) {
            return $this->fail('Kategori tidak ditemukan.', 400);
        }

        // Check if supplier exists
        $supplierModel = new \App\Models\SupplierModel();
        if (!$supplierModel->find($id_supplier)) {
            return $this->fail('Supplier tidak ditemukan.', 400);
        }

        $data  = [
            'nama_barang'  => $this->request->getVar('nama_barang'),
            'id_kategori'  => $id_kategori,
            'id_supplier'  => $id_supplier,
            'stok'         => $this->request->getVar('stok'),
            'harga'        => $this->request->getVar('harga'),
            'satuan'       => $this->request->getVar('satuan'),
            'deskripsi'    => $this->request->getVar('deskripsi'),
        ];

        $model->update($id, $data);

        return $this->respond([
            'status'   => 200,
            'messages' => 'Barang berhasil diubah.'
        ]);
    }

    public function delete($id = null)
    {
        $model = new BarangModel();

        if (!$model->find($id)) {
            return $this->failNotFound('Barang tidak ditemukan.');
        }

        $model->delete($id);

        return $this->respondDeleted([
            'status'   => 200,
            'messages' => 'Barang berhasil dihapus.'
        ]);
    }
}