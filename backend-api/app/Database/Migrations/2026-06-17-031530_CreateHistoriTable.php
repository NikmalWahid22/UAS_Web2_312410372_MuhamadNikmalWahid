<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateHistoriTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id_histori' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'auto_increment' => true,
            ],
            'id_barang' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
            ],
            'jenis' => [
                'type'       => 'ENUM',
                'constraint' => ['masuk', 'keluar'],
            ],
            'jumlah' => [
                'type'       => 'INT',
                'constraint' => 11,
            ],
            'keterangan' => [
                'type'       => 'TEXT',
                'null'       => true,
            ],
            'tanggal DATETIME DEFAULT CURRENT_TIMESTAMP'
        ]);
        $this->forge->addKey('id_histori', true);
        $this->forge->addForeignKey('id_barang', 'barang', 'id_barang');
        $this->forge->createTable('histori');
    }

    public function down()
    {
        $this->forge->dropTable('histori');
    }
}
