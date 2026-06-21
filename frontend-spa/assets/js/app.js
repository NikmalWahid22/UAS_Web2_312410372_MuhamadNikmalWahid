const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

const apiUrl = 'http://localhost:8080';
axios.defaults.baseURL = apiUrl; // Set base URL secara global untuk Axios

// =========================================================================
// AXIOS INTERCEPTORS
// =========================================================================
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            alert('Sesi Anda telah berakhir. Silakan login kembali.');
            localStorage.clear();
            window.location.href = '#/login';
            window.location.reload();
        }
        return Promise.reject(error);
    }
);
// =========================================================================

// Routes
const routes = [
    { path: '/',          component: Home },
    { path: '/login',     component: Login },
    { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/barang',    component: Barang,    meta: { requiresAuth: true } },
    { path: '/kategori',  component: Kategori,  meta: { requiresAuth: true } },
    { path: '/supplier',  component: Supplier,  meta: { requiresAuth: true } },
    { path: '/histori',  component: Histori,  meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// Navigation Guard
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
    
    if ((to.path === '/login' || to.path === '/') && isAuthenticated) {
        next('/dashboard');
    } 
    // Jika halaman butuh auth dan user belum login
    else if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        alert('Akses Ditolak! Silakan login terlebih dahulu.');
        next('/login');
    } 
    else {
        next();
    }
});

// App Instance
const app = createApp({
    data() {
        return {
            isLoggedIn : false,
            userName   : '',
            userRole   : '',
            pageTitle  : 'Dashboard Utama'
        }
    },
    mounted() {
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.userName   = localStorage.getItem('userName') ?? '';
        this.userRole   = localStorage.getItem('userRole') ?? '';
    },
    methods: {
        logout() {
            if (confirm('Yakin ingin keluar?')) {
                localStorage.clear();
                this.isLoggedIn = false;
                this.userName   = '';
                this.userRole   = '';
                this.$router.push('/');
            }
        }
    },
    watch: {
        $route(to) {
            const titles = {
                '/dashboard': 'Dashboard Ringkasan',
                '/barang': 'Manajemen Data Inventaris Barang',
                '/kategori': 'Manajemen Kategori Barang',
                '/supplier': 'Daftar Supplier / Vendor',
            };
            this.pageTitle = titles[to.path] || 'E-Inventory';
        }
    }
});

app.use(router);
app.mount('#app');