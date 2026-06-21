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
        $rules = [
            'id_barang'  => 'required|integer',
            'jenis'      => 'required|in_list[masuk,keluar]',
            'jumlah'     => 'required|integer|greater_than[0]',
            'keterangan' => 'permit_empty|string',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $id_barang = $this->request->getVar('id_barang');
        $jenis     = $this->request->getVar('jenis');
        $jumlah    = (int) $this->request->getVar('jumlah');

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
            'keterangan' => $this->request->getVar('keterangan'),
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
}