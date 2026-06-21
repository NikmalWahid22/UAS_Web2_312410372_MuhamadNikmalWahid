<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// =============================================
// PUBLIC ROUTES (tanpa token)
// =============================================

// API Login & Register
$routes->post('api/login', 'Api\Auth::login');
$routes->options('api/login', static function () {
    return service('response')->setStatusCode(204);
});
$routes->post('api/register', 'Api\Auth::register');
$routes->options('api/register', static function () {
    return service('response')->setStatusCode(204);
});

// GET semua data (publik, boleh diakses tanpa token)
$routes->get('api/barang',    'Api\Barang::index');
$routes->get('api/barang/(:num)', 'Api\Barang::show/$1');
$routes->get('api/kategori',       'Api\Kategori::index');
$routes->get('api/kategori/(:num)', 'Api\Kategori::show/$1');
$routes->get('api/supplier',       'Api\Supplier::index');
$routes->get('api/supplier/(:num)', 'Api\Supplier::show/$1');
$routes->get('api/histori',   'Api\Histori::index');

// OPTIONS untuk CORS preflight
$routes->options('api/barang',         static fn() => service('response')->setStatusCode(204));
$routes->options('api/barang/(:num)',   static fn() => service('response')->setStatusCode(204));
$routes->options('api/kategori',        static fn() => service('response')->setStatusCode(204));
$routes->options('api/kategori/(:num)', static fn() => service('response')->setStatusCode(204));
$routes->options('api/supplier',        static fn() => service('response')->setStatusCode(204));
$routes->options('api/supplier/(:num)', static fn() => service('response')->setStatusCode(204));
$routes->options('api/histori',         static fn() => service('response')->setStatusCode(204));
$routes->options('api/histori/(:num)',  static fn() => service('response')->setStatusCode(204));

// =============================================
// PROTECTED ROUTES (wajib token)
// =============================================

// Barang
$routes->post('api/barang',           'Api\Barang::create',     ['filter' => 'apiauth:admin']);
$routes->put('api/barang/(:num)',      'Api\Barang::update/$1',  ['filter' => 'apiauth:admin']);
$routes->delete('api/barang/(:num)',   'Api\Barang::delete/$1',  ['filter' => 'apiauth:admin']);

// Kategori
$routes->post('api/kategori',          'Api\Kategori::create',   ['filter' => 'apiauth:admin']);
$routes->put('api/kategori/(:num)',     'Api\Kategori::update/$1',['filter' => 'apiauth:admin']);
$routes->delete('api/kategori/(:num)', 'Api\Kategori::delete/$1',['filter' => 'apiauth:admin']);

// Supplier
$routes->post('api/supplier',          'Api\Supplier::create',   ['filter' => 'apiauth:admin']);
$routes->put('api/supplier/(:num)',     'Api\Supplier::update/$1',['filter' => 'apiauth:admin']);
$routes->delete('api/supplier/(:num)', 'Api\Supplier::delete/$1',['filter' => 'apiauth:admin']);

// Histori
$routes->post('api/histori',           'Api\Histori::create',    ['filter' => 'apiauth']);
$routes->delete('api/histori/(:num)',   'Api\Histori::delete/$1', ['filter' => 'apiauth:admin']);

$routes->setAutoRoute(false);