<?php

namespace App\Models;

use CodeIgniter\Model;

class HistoriModel extends Model
{
    protected $table         = 'histori';
    protected $primaryKey    = 'id_histori';
    protected $allowedFields = ['id_barang', 'jenis', 'jumlah', 'keterangan', 'tanggal'];

    public function getHistoriLengkap()
    {
        return $this->db->table('histori')
            ->select('histori.*, barang.nama_barang')
            ->join('barang', 'barang.id_barang = histori.id_barang', 'left')
            ->orderBy('histori.tanggal', 'DESC')
            ->get()
            ->getResultArray();
    }
}