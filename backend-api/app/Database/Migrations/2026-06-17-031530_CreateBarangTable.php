<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateBarangTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id_barang' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'auto_increment' => true,
            ],
            'nama_barang' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'id_kategori' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
            ],
            'id_supplier' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
            ],
            'stok' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 0,
            ],
            'harga' => [
                'type'       => 'DECIMAL',
                'constraint' => '10,2',
                'default'    => 0.00,
            ],
            'satuan' => [
                'type'       => 'VARCHAR',
                'constraint' => '20',
                'null'       => true,
            ],
            'deskripsi' => [
                'type'       => 'TEXT',
                'null'       => true,
            ],
            'created_at DATETIME DEFAULT CURRENT_TIMESTAMP'
        ]);
        $this->forge->addKey('id_barang', true);
        $this->forge->addForeignKey('id_kategori', 'kategori', 'id_kategori');
        $this->forge->addForeignKey('id_supplier', 'supplier', 'id_supplier');
        $this->forge->createTable('barang');
    }

    public function down()
    {
        $this->forge->dropTable('barang');
    }
}
