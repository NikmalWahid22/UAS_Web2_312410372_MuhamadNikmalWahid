<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// =============================================
// ROOT (biar tidak 404 di "/")
// =============================================
$routes->get('/', function () {
    return service('response')->setJSON([
        'status' => 200,
        'message' => 'API E-Inventory aktif'
    ]);
});

// =============================================
// PUBLIC ROUTES (tanpa token)
// =============================================

// AUTH
$routes->post('api/login', 'Api\Auth::login');
$routes->post('api/register', 'Api\Auth::register');

// =============================================
// GET DATA (PUBLIC READ)
// =============================================

$routes->get('api/barang', 'Api\Barang::index');
$routes->get('api/barang/(:num)', 'Api\Barang::show/$1');

$routes->get('api/kategori', 'Api\Kategori::index');
$routes->get('api/kategori/(:num)', 'Api\Kategori::show/$1');

$routes->get('api/supplier', 'Api\Supplier::index');
$routes->get('api/supplier/(:num)', 'Api\Supplier::show/$1');

$routes->get('api/histori', 'Api\Histori::index');
$routes->get('api/histori/(:num)', 'Api\Histori::show/$1');

// =============================================
// CORS PRE-FLIGHT (OPTIONS)
// =============================================

$routes->options('api/(:any)', static function () {
    return service('response')->setStatusCode(204);
});

// =============================================
// PROTECTED ROUTES (BUTUH TOKEN)
// =============================================

// BARANG
$routes->post('api/barang', 'Api\Barang::create', ['filter' => 'apiauth:admin']);
$routes->put('api/barang/(:num)', 'Api\Barang::update/$1', ['filter' => 'apiauth:admin']);
$routes->delete('api/barang/(:num)', 'Api\Barang::delete/$1', ['filter' => 'apiauth:admin']);

// KATEGORI
$routes->post('api/kategori', 'Api\Kategori::create', ['filter' => 'apiauth:admin']);
$routes->put('api/kategori/(:num)', 'Api\Kategori::update/$1', ['filter' => 'apiauth:admin']);
$routes->delete('api/kategori/(:num)', 'Api\Kategori::delete/$1', ['filter' => 'apiauth:admin']);

// SUPPLIER
$routes->post('api/supplier', 'Api\Supplier::create', ['filter' => 'apiauth:admin']);
$routes->put('api/supplier/(:num)', 'Api\Supplier::update/$1', ['filter' => 'apiauth:admin']);
$routes->delete('api/supplier/(:num)', 'Api\Supplier::delete/$1', ['filter' => 'apiauth:admin']);

// HISTORI
$routes->post('api/histori', 'Api\Histori::create', ['filter' => 'apiauth']);
$routes->delete('api/histori/(:num)', 'Api\Histori::delete/$1', ['filter' => 'apiauth:admin']);

$routes->setAutoRoute(false);