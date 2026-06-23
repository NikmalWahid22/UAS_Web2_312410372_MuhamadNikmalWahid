<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\HistoriModel;
use App\Models\BarangModel;

class Histori extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new HistoriModel();
        return $this->respond([
            'status' => 200,
            'data'   => $model->getHistoriLengkap()
        ]);
    }

    public function create()
    {
        $input = $this->getRequestInput();

        $rules = [
            'id_barang'  => 'required|integer',
            'jenis'      => 'required|in_list[masuk,keluar]',
            'jumlah'     => 'required|integer|greater_than[0]',
            'keterangan' => 'permit_empty|string',
        ];

        $validation = \Config\Services::validation();
        $validation->setRules($rules);

        if (!$validation->run($input)) {
            return $this->failValidationErrors($validation->getErrors());
        }

        $id_barang = $input['id_barang'];
        $jenis     = $input['jenis'];
        $jumlah    = (int) $input['jumlah'];

        $barangModel = new BarangModel();
        $barang = $barangModel->find($id_barang);

        if (!$barang) {
            return $this->failNotFound('Barang tidak ditemukan.');
        }

        // Cek jika stok tidak mencukupi untuk transaksi keluar
        if ($jenis === 'keluar' && $barang['stok'] < $jumlah) {
            return $this->fail('Stok barang tidak mencukupi. Stok saat ini: ' . $barang['stok'], 400);
        }

        $historiModel = new HistoriModel();
        
        // Simpan histori
        $historiModel->insert([
            'id_barang'  => $id_barang,
            'jenis'      => $jenis,
            'jumlah'     => $jumlah,
            'keterangan' => $input['keterangan'] ?? null,
        ]);

        // Update stok barang otomatis
        $stokBaru = $jenis === 'masuk'
            ? $barang['stok'] + $jumlah
            : $barang['stok'] - $jumlah;

        $barangModel->update($id_barang, ['stok' => $stokBaru]);

        return $this->respondCreated([
            'status'   => 201,
            'messages' => 'Histori berhasil ditambahkan dan stok diperbarui.'
        ]);
    }

    public function delete($id = null)
    {
        $historiModel = new HistoriModel();
        $histori = $historiModel->find($id);

        if (!$histori) {
            return $this->failNotFound('Histori tidak ditemukan.');
        }

        // Ambil info barang untuk rollback stok
        $barangModel = new BarangModel();
        $barang = $barangModel->find($histori['id_barang']);

        if ($barang) {
            // Rollback stok:
            // Jika transaksi masuk dihapus -> stok dikurangi
            // Jika transaksi keluar dihapus -> stok ditambah
            $stokBaru = $histori['jenis'] === 'masuk'
                ? $barang['stok'] - $histori['jumlah']
                : $barang['stok'] + $histori['jumlah'];

            // Pengecekan agar stok hasil rollback tidak menjadi negatif
            if ($stokBaru < 0) {
                return $this->fail('Tidak dapat menghapus histori karena akan menyebabkan stok barang menjadi negatif.', 400);
            }

            $barangModel->update($histori['id_barang'], ['stok' => $stokBaru]);
        }

        $historiModel->delete($id);

        return $this->respondDeleted([
            'status'   => 200,
            'messages' => 'Histori berhasil dihapus dan stok barang telah disesuaikan kembali.'
        ]);
    }

    protected function getRequestInput()
    {
        $input = [];
        $contentType = $this->request->getHeaderLine('Content-Type');
        if (strpos($contentType, 'application/json') !== false) {
            $rawBody = $this->request->getBody();
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