<?php

namespace App\Controllers\Api;

use App\Models\BarangModel;
use CodeIgniter\RESTful\ResourceController;

class Barang extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new BarangModel();

        return $this->respond([
            'status' => 200,
            'data'   => $model->getBarangLengkap(),
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
        $input = $this->getRequestInput();
        $rules = $this->validationRules();

        $validation = \Config\Services::validation();
        $validation->setRules($rules);

        if (!$validation->run($input)) {
            return $this->failValidationErrors($validation->getErrors());
        }

        $idKategori = $input['id_kategori'];
        $idSupplier = $input['id_supplier'];

        $kategoriModel = new \App\Models\KategoriModel();
        if (!$kategoriModel->find($idKategori)) {
            return $this->fail('Kategori tidak ditemukan.', 400);
        }

        $supplierModel = new \App\Models\SupplierModel();
        if (!$supplierModel->find($idSupplier)) {
            return $this->fail('Supplier tidak ditemukan.', 400);
        }

        $model = new BarangModel();
        $model->insert([
            'nama_barang' => $input['nama_barang'],
            'id_kategori' => $idKategori,
            'id_supplier' => $idSupplier,
            'stok'        => $input['stok'],
            'harga'       => $input['harga'],
            'satuan'      => $input['satuan'],
            'deskripsi'   => $input['deskripsi'] ?? null,
        ]);

        return $this->respondCreated([
            'status'   => 201,
            'messages' => 'Barang berhasil ditambahkan.',
        ]);
    }

    public function update($id = null)
    {
        $model = new BarangModel();

        if (!$model->find($id)) {
            return $this->failNotFound('Barang tidak ditemukan.');
        }

        $input = $this->getRequestInput();

        if (empty($input)) {
            return $this->fail('Request body kosong atau format JSON tidak valid.', 400);
        }

        $validation = \Config\Services::validation();
        $validation->setRules($this->validationRules());

        if (!$validation->run($input)) {
            return $this->failValidationErrors($validation->getErrors());
        }

        $kategoriModel = new \App\Models\KategoriModel();
        if (!$kategoriModel->find($input['id_kategori'])) {
            return $this->fail('Kategori tidak ditemukan.', 400);
        }

        $supplierModel = new \App\Models\SupplierModel();
        if (!$supplierModel->find($input['id_supplier'])) {
            return $this->fail('Supplier tidak ditemukan.', 400);
        }

        try {
            $updated = $model->update($id, [
                'nama_barang' => $input['nama_barang'],
                'id_kategori' => $input['id_kategori'],
                'id_supplier' => $input['id_supplier'],
                'stok'        => $input['stok'],
                'harga'       => $input['harga'],
                'satuan'      => $input['satuan'],
                'deskripsi'   => $input['deskripsi'] ?? null,
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Gagal update barang ID {id}: {message}', [
                'id'      => $id,
                'message' => $e->getMessage(),
            ]);

            return $this->failServerError('Gagal mengubah barang. Silakan cek log server.');
        }

        if (!$updated) {
            return $this->fail('Barang gagal diubah.', 400);
        }

        return $this->respond([
            'status'   => 200,
            'messages' => 'Barang berhasil diubah.',
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
            'messages' => 'Barang berhasil dihapus.',
        ]);
    }

    protected function getRequestInput(): array
    {
        $rawBody = trim((string) file_get_contents('php://input'));

        if ($rawBody !== '') {
            $data = json_decode($rawBody, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
                return $data;
            }
        }

        $data = $this->request->getPost();
        if (!empty($data)) {
            return $data;
        }

        $data = $this->request->getRawInput();
        if (!empty($data)) {
            return $data;
        }

        if ($rawBody !== '' && strpos($this->request->getHeaderLine('Content-Type'), 'application/json') === false) {
            parse_str($rawBody, $output);
            return is_array($output) ? $output : [];
        }

        return [];
    }

    protected function validationRules(): array
    {
        return [
            'nama_barang' => 'required|min_length[3]|max_length[100]',
            'id_kategori' => 'required|integer',
            'id_supplier' => 'required|integer',
            'stok'        => 'required|integer|greater_than_equal_to[0]',
            'harga'       => 'required|numeric|greater_than_equal_to[0]',
            'satuan'      => 'required|min_length[1]|max_length[20]',
        ];
    }
}
