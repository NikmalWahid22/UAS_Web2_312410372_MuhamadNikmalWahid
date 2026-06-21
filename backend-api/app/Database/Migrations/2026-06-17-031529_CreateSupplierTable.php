<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateSupplierTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id_supplier' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'auto_increment' => true,
            ],
            'nama_supplier' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'alamat' => [
                'type'       => 'TEXT',
                'null'       => true,
            ],
            'telepon' => [
                'type'       => 'VARCHAR',
                'constraint' => '20',
                'null'       => true,
            ],
            'email' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
                'null'       => true,
            ],
        ]);
        $this->forge->addKey('id_supplier', true);
        $this->forge->createTable('supplier');
    }

    public function down()
    {
        $this->forge->dropTable('supplier');
    }
}
