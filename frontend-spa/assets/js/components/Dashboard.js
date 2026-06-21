const Dashboard = {
    template: `
    <div>
        <!-- Welcome Banner -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
            <div class="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div class="absolute right-16 bottom-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2"></div>
            <div class="relative z-10">
                <p class="text-blue-200 text-sm font-medium mb-1">Selamat Datang,</p>
                <h1 class="text-2xl font-bold mb-1">{{ userName }}</h1>
                <p class="text-blue-200 text-sm">
                    <span class="bg-white/20 px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide">{{ userRole }}</span>
                    <span class="ml-2">{{ today }}</span>
                </p>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                <div class="flex items-center justify-between mb-4">
                    <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                    </div>
                    <span class="text-xs text-green-500 font-medium bg-green-50 px-2 py-0.5 rounded-full">Total</span>
                </div>
                <p class="text-2xl font-bold text-gray-800">{{ stats.totalBarang }}</p>
                <p class="text-gray-400 text-xs mt-0.5">Total Barang</p>
            </div>

            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                <div class="flex items-center justify-between mb-4">
                    <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                        <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                        </svg>
                    </div>
                    <span class="text-xs text-purple-500 font-medium bg-purple-50 px-2 py-0.5 rounded-full">Total</span>
                </div>
                <p class="text-2xl font-bold text-gray-800">{{ stats.totalKategori }}</p>
                <p class="text-gray-400 text-xs mt-0.5">Kategori</p>
            </div>

            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                <div class="flex items-center justify-between mb-4">
                    <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                    </div>
                    <span class="text-xs text-green-500 font-medium bg-green-50 px-2 py-0.5 rounded-full">Total</span>
                </div>
                <p class="text-2xl font-bold text-gray-800">{{ stats.totalSupplier }}</p>
                <p class="text-gray-400 text-xs mt-0.5">Supplier</p>
            </div>

            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                <div class="flex items-center justify-between mb-4">
                    <div class="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                        <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                    </div>
                    <span class="text-xs text-orange-500 font-medium bg-orange-50 px-2 py-0.5 rounded-full">Total</span>
                </div>
                <p class="text-2xl font-bold text-gray-800">{{ stats.totalHistori }}</p>
                <p class="text-gray-400 text-xs mt-0.5">Total Histori</p>
            </div>

        </div>

        <!-- Bottom Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- Stok Rendah -->
            <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 class="text-gray-800 font-semibold text-sm">Barang Stok Rendah</h2>
                    <span class="text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full font-medium">⚠ Perhatian</span>
                </div>
                <div class="p-6">
                    <div v-if="stokRendah.length === 0" class="text-center py-8">
                        <p class="text-4xl mb-2">✅</p>
                        <p class="text-gray-400 text-sm">Semua stok dalam kondisi aman</p>
                    </div>
                    <div v-else class="space-y-3">
                        <div v-for="item in stokRendah" :key="item.id_barang"
                            class="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-gray-800 text-sm font-medium">{{ item.nama_barang }}</p>
                                    <p class="text-gray-400 text-xs">{{ item.nama_kategori }}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <span class="text-orange-600 font-bold text-sm">{{ item.stok }}</span>
                                <p class="text-gray-400 text-xs">{{ item.satuan }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Histori Terbaru -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h2 class="text-gray-800 font-semibold text-sm">Aktivitas Terbaru</h2>
                </div>
                <div class="p-4">
                    <div v-if="historiTerbaru.length === 0" class="text-center py-8">
                        <p class="text-gray-400 text-sm">Belum ada aktivitas</p>
                    </div>
                    <div v-else class="space-y-3">
                        <div v-for="h in historiTerbaru" :key="h.id_histori"
                            class="flex items-start gap-3">
                            <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                :class="h.jenis === 'masuk' ? 'bg-green-100' : 'bg-red-100'">
                                <span class="text-xs">{{ h.jenis === 'masuk' ? '↑' : '↓' }}</span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-gray-700 text-xs font-medium truncate">{{ h.nama_barang }}</p>
                                <p class="text-xs mt-0.5"
                                    :class="h.jenis === 'masuk' ? 'text-green-500' : 'text-red-500'">
                                    {{ h.jenis === 'masuk' ? '+' : '-' }}{{ h.jumlah }} unit
                                </p>
                                <p class="text-gray-400 text-xs">{{ formatTanggal(h.tanggal) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- Quick Access -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6" v-if="userRole === 'admin'">
            <router-link to="/barang"
                class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 text-center group">
                <div class="w-10 h-10 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2 transition-colors">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                </div>
                <p class="text-gray-700 text-xs font-medium">Tambah Barang</p>
            </router-link>

            <router-link to="/kategori"
                class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-200 text-center group">
                <div class="w-10 h-10 bg-purple-50 group-hover:bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2 transition-colors">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                </div>
                <p class="text-gray-700 text-xs font-medium">Tambah Kategori</p>
            </router-link>

            <router-link to="/supplier"
                class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-200 text-center group">
                <div class="w-10 h-10 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2 transition-colors">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                </div>
                <p class="text-gray-700 text-xs font-medium">Tambah Supplier</p>
            </router-link>

            <router-link to="/histori"
                class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 text-center group">
                <div class="w-10 h-10 bg-orange-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2 transition-colors">
                    <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                </div>
                <p class="text-gray-700 text-xs font-medium">Catat Histori</p>
            </router-link>
        </div>

    </div>
    `,
    data() {
        return {
            userName      : localStorage.getItem('userName') ?? 'User',
            userRole      : localStorage.getItem('userRole') ?? 'staff',
            today         : new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            stats         : { totalBarang: 0, totalKategori: 0, totalSupplier: 0, totalHistori: 0 },
            stokRendah    : [],
            historiTerbaru: [],
        }
    },
    mounted() {
        this.loadDashboard();
    },
    methods: {
        loadDashboard() {
            // Total barang + stok rendah
            axios.get(apiUrl + '/api/barang')
                .then(res => {
                    const data         = res.data.data;
                    this.stats.totalBarang = data.length;
                    this.stokRendah    = data.filter(b => b.stok <= 5).slice(0, 5);
                })
                .catch(() => {});

            // Total kategori
            axios.get(apiUrl + '/api/kategori')
                .then(res => { this.stats.totalKategori = res.data.data.length; })
                .catch(() => {});

            // Total supplier
            axios.get(apiUrl + '/api/supplier')
                .then(res => { this.stats.totalSupplier = res.data.data.length; })
                .catch(() => {});

            // Total histori + terbaru
            axios.get(apiUrl + '/api/histori')
                .then(res => {
                    const data              = res.data.data;
                    this.stats.totalHistori = data.length;
                    this.historiTerbaru     = data.slice(0, 5);
                })
                .catch(() => {});
        },
        formatTanggal(tanggal) {
            if (!tanggal) return '-';
            return new Date(tanggal).toLocaleDateString('id-ID', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
        }
    }
};