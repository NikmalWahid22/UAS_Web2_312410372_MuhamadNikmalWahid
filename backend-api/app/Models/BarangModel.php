<?php

namespace App\Models;

use CodeIgniter\Model;

class BarangModel extends Model
{
    protected $table         = 'barang';
    protected $primaryKey    = 'id_barang';
    protected $allowedFields = [
        'nama_barang',
        'id_kategori',
        'id_supplier',
        'stok',
        'harga',
        'satuan',
        'deskripsi'
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = '';

    public function getBarangLengkap()
    {
        return $this->db->table('barang')
            ->select('barang.*, kategori.nama_kategori, supplier.nama_supplier')
            ->join('kategori', 'kategori.id_kategori = barang.id_kategori', 'left')
            ->join('supplier', 'supplier.id_supplier = barang.id_supplier', 'left')
            ->get()
            ->getResultArray();
    }
}