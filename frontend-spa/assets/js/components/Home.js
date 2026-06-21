const Home = {
    template: `
    <div>

        <!-- HERO SECTION (background dari index.html) -->
        <div class="relative px-6 pt-10 pb-0 text-center">
            <div class="relative z-10 max-w-3xl mx-auto">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-500 to-blue-700 rounded-2xl shadow-lg shadow-blue-500/30 mb-5">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 11m8 4V21M4 11v10l8 4"/>
                    </svg>
                </div>
                <h1 class="text-white text-3xl md:text-4xl font-extrabold mb-3">
                    Sistem Manajemen
                    <span class="block bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                        Inventaris Barang
                    </span>
                </h1>
                <p class="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed mb-8">
                    Kelola data barang, kategori, supplier dan histori pergerakan inventaris
                    dalam satu platform terintegrasi berbasis web.
                </p>
            </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-0 mt-10 border-t border-slate-700/50">
            <div class="p-6 text-center border-r border-slate-700/50 hover:bg-white/5 transition-colors">
                <p class="text-3xl font-extrabold text-white mb-1">{{ stats[0].value }}</p>
                <div class="flex items-center justify-center gap-1.5">
                    <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <p class="text-slate-400 text-xs font-medium">Total Barang</p>
                </div>
            </div>
            <div class="p-6 text-center border-r border-slate-700/50 hover:bg-white/5 transition-colors">
                <p class="text-3xl font-extrabold text-white mb-1">{{ stats[1].value }}</p>
                <div class="flex items-center justify-center gap-1.5">
                    <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <p class="text-slate-400 text-xs font-medium">Kategori</p>
                </div>
            </div>
            <div class="p-6 text-center border-r border-slate-700/50 hover:bg-white/5 transition-colors">
                <p class="text-3xl font-extrabold text-white mb-1">{{ stats[2].value }}</p>
                <div class="flex items-center justify-center gap-1.5">
                    <div class="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <p class="text-slate-400 text-xs font-medium">Supplier</p>
                </div>
            </div>
            <div class="p-6 text-center hover:bg-white/5 transition-colors">
                <p class="text-3xl font-extrabold text-white mb-1">{{ stats[3].value }}</p>
                <div class="flex items-center justify-center gap-1.5">
                    <div class="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <p class="text-slate-400 text-xs font-medium">Total Histori</p>
                </div>
            </div>
        </div>

        <!-- KONTEN PUTIH di bawah (tabel + fitur) -->
        <div class="bg-gray-50 px-6 py-8 space-y-6">

            <!-- TABEL BARANG -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                        <h2 class="text-gray-800 font-bold text-sm">Daftar Barang Tersedia</h2>
                    </div>
                    <div class="relative">
                        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <input type="text" v-model="search" placeholder="Cari barang..."
                            class="pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-48">
                    </div>
                </div>

                <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-2">
                    <svg class="animate-spin w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <p class="text-gray-400 text-sm">Memuat data barang...</p>
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="bg-gray-50 border-b border-gray-100">
                                <th class="text-left text-gray-500 font-semibold px-6 py-3.5 text-xs uppercase tracking-wider">No</th>
                                <th class="text-left text-gray-500 font-semibold px-6 py-3.5 text-xs uppercase tracking-wider">Nama Barang</th>
                                <th class="text-left text-gray-500 font-semibold px-6 py-3.5 text-xs uppercase tracking-wider">Kategori</th>
                                <th class="text-left text-gray-500 font-semibold px-6 py-3.5 text-xs uppercase tracking-wider">Supplier</th>
                                <th class="text-left text-gray-500 font-semibold px-6 py-3.5 text-xs uppercase tracking-wider">Stok</th>
                                <th class="text-left text-gray-500 font-semibold px-6 py-3.5 text-xs uppercase tracking-wider">Harga</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-if="filteredBarang.length === 0">
                                <td colspan="6" class="text-center py-12 text-gray-400 text-sm">Tidak ada data barang</td>
                            </tr>
                            <tr v-else v-for="(item, index) in filteredBarang" :key="item.id_barang"
                                class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 text-gray-400 text-xs">{{ index + 1 }}</td>
                                <td class="px-6 py-4">
                                    <p class="text-gray-800 font-medium">{{ item.nama_barang }}</p>
                                    <p class="text-gray-400 text-xs mt-0.5">{{ item.satuan }}</p>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="bg-purple-50 text-purple-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                                        {{ item.nama_kategori ?? '-' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-gray-500 text-xs">{{ item.nama_supplier ?? '-' }}</td>
                                <td class="px-6 py-4">
                                    <span class="font-semibold text-sm"
                                        :class="item.stok <= 5 ? 'text-red-500' : item.stok <= 10 ? 'text-orange-500' : 'text-green-600'">
                                        {{ item.stok }}
                                    </span>
                                    <span class="text-gray-400 text-xs ml-1">{{ item.satuan }}</span>
                                </td>
                                <td class="px-6 py-4 text-gray-700 text-sm font-medium">
                                    Rp {{ formatHarga(item.harga) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                    <p class="text-gray-400 text-xs">
                        Menampilkan <span class="font-semibold text-gray-600">{{ filteredBarang.length }}</span> barang
                    </p>
                    <router-link to="/login" class="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1">
                        Login untuk kelola data
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </router-link>
                </div>
            </div>

            <!-- FITUR -->
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 class="text-gray-800 font-bold text-base mb-5 flex items-center gap-2">
                    <span class="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                    Fitur Utama Sistem
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div class="p-5 bg-slate-50 rounded-xl border border-gray-100 hover:bg-slate-100/50 transition-colors">
                        <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                            </svg>
                        </div>
                        <h3 class="text-gray-800 font-bold text-sm mb-1.5">Manajemen Barang</h3>
                        <p class="text-gray-400 text-xs leading-relaxed">Kelola data barang, stok, harga, dan informasi lengkap logistik inventaris secara terpusat.</p>
                    </div>
                    <div class="p-5 bg-slate-50 rounded-xl border border-gray-100 hover:bg-slate-100/50 transition-colors">
                        <div class="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                            </svg>
                        </div>
                        <h3 class="text-gray-800 font-bold text-sm mb-1.5">Histori Pergerakan</h3>
                        <p class="text-gray-400 text-xs leading-relaxed">Pantau mutasi masuk dan keluarnya pasokan barang secara real-time dan transparan.</p>
                    </div>
                    <div class="p-5 bg-slate-50 rounded-xl border border-gray-100 hover:bg-slate-100/50 transition-colors">
                        <div class="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                            </svg>
                        </div>
                        <h3 class="text-gray-800 font-bold text-sm mb-1.5">Keamanan Berlapis</h3>
                        <p class="text-gray-400 text-xs leading-relaxed">Proteksi penuh sisi klien dan API menggunakan arsitektur enkripsi stateless Bearer Token.</p>
                    </div>
                </div>
            </div>

        </div>

    </div>
    `,
    data() {
        return {
            barangList : [],
            search     : '',
            loading    : false,
            stats      : [
                { value: '0' },
                { value: '0' },
                { value: '0' },
                { value: '0' },
            ]
        }
    },
    computed: {
        filteredBarang() {
            if (!this.search) return this.barangList;
            return this.barangList.filter(b =>
                b.nama_barang.toLowerCase().includes(this.search.toLowerCase())
            );
        }
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() {
            this.loading = true;
            axios.get(apiUrl + '/api/barang')
                .then(res => {
                    this.barangList     = res.data.data;
                    this.stats[0].value = res.data.data.length;
                })
                .catch(() => {})
                .finally(() => { this.loading = false; });

            axios.get(apiUrl + '/api/kategori')
                .then(res => { this.stats[1].value = res.data.data.length; })
                .catch(() => {});

            axios.get(apiUrl + '/api/supplier')
                .then(res => { this.stats[2].value = res.data.data.length; })
                .catch(() => {});

            axios.get(apiUrl + '/api/histori')
                .then(res => { this.stats[3].value = res.data.data.length; })
                .catch(() => {});
        },
        formatHarga(harga) {
            return parseInt(harga).toLocaleString('id-ID');
        }
    }
};