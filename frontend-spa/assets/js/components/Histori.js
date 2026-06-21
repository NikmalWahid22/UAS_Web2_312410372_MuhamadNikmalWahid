const Histori = {
    template: `
    <div>

        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-gray-800 font-bold text-xl">Histori Barang</h1>
                <p class="text-gray-400 text-sm mt-0.5">Pantau pergerakan barang masuk dan keluar</p>
            </div>
            <button v-if="userRole === 'admin'"
                @click="openTambah"
                class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors duration-200 shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Catat Histori
            </button>
        </div>

        <!-- Filter & Search -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
            <div class="flex gap-3">
                <div class="relative flex-1">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <input
                        type="text"
                        v-model="search"
                        placeholder="Cari nama barang..."
                        class="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                </div>
                <select v-model="filterJenis"
                    class="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                    <option value="">Semua Jenis</option>
                    <option value="masuk">Masuk</option>
                    <option value="keluar">Keluar</option>
                </select>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-4">
                <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                    </svg>
                </div>
                <div>
                    <p class="text-green-800 font-bold text-xl">{{ totalMasuk }}</p>
                    <p class="text-green-600 text-xs font-medium">Total Barang Masuk</p>
                </div>
            </div>
            <div class="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-4">
                <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
                    </svg>
                </div>
                <div>
                    <p class="text-red-700 font-bold text-xl">{{ totalKeluar }}</p>
                    <p class="text-red-500 text-xs font-medium">Total Barang Keluar</p>
                </div>
            </div>
        </div>

        <!-- Tabel -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-100">
                            <th class="text-left text-gray-500 font-semibold px-6 py-3.5 text-xs uppercase tracking-wider">No</th>
                            <th class="text-left text-gray-500 font-semibold px-6 py-3.5 text-xs uppercase tracking-wider">Nama Barang</th>
                            <th class="text-left text-gray-500 font-semibold px-6 py-3.5 text-xs uppercase tracking-wider">Jenis</th>
                            <th class="text-left text-gray-500 font-semibold px-6 py-3.5 text-xs uppercase tracking-wider">Jumlah</th>
                            <th class="text-left text-gray-500 font-semibold px-6 py-3.5 text-xs uppercase tracking-wider">Keterangan</th>
                            <th class="text-left text-gray-500 font-semibold px-6 py-3.5 text-xs uppercase tracking-wider">Tanggal</th>
                            <th v-if="userRole === 'admin'" class="text-left text-gray-500 font-semibold px-6 py-3.5 text-xs uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-if="loading">
                            <td :colspan="userRole === 'admin' ? 7 : 6" class="text-center py-12">
                                <div class="flex flex-col items-center gap-2">
                                    <svg class="animate-spin w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    <p class="text-gray-400 text-sm">Memuat data...</p>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="filteredHistori.length === 0">
                            <td :colspan="userRole === 'admin' ? 7 : 6" class="text-center py-12">
                                <p class="text-gray-400 text-sm">Tidak ada data histori</p>
                            </td>
                        </tr>
                        <tr v-else v-for="(item, index) in filteredHistori" :key="item.id_histori"
                            class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 text-gray-400 text-xs">{{ index + 1 }}</td>
                            <td class="px-6 py-4">
                                <p class="text-gray-800 font-medium">{{ item.nama_barang }}</p>
                            </td>
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg"
                                    :class="item.jenis === 'masuk'
                                        ? 'bg-green-50 text-green-600'
                                        : 'bg-red-50 text-red-500'">
                                    <span>{{ item.jenis === 'masuk' ? '↑' : '↓' }}</span>
                                    {{ item.jenis === 'masuk' ? 'Masuk' : 'Keluar' }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="font-bold text-sm"
                                    :class="item.jenis === 'masuk' ? 'text-green-600' : 'text-red-500'">
                                    {{ item.jenis === 'masuk' ? '+' : '-' }}{{ item.jumlah }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-gray-500 text-sm">
                                {{ item.keterangan ?? '-' }}
                            </td>
                            <td class="px-6 py-4 text-gray-400 text-xs">
                                {{ formatTanggal(item.tanggal) }}
                            </td>
                            <td class="px-6 py-4" v-if="userRole === 'admin'">
                                <button @click="hapus(item.id_histori)"
                                    class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- MODAL TAMBAH -->
        <div v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
            style="background: rgba(0,0,0,0.5)">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">

                <!-- Modal Header -->
                <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 class="text-gray-800 font-semibold text-base">Catat Histori Barang</h3>
                    <button @click="closeModal"
                        class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="px-6 py-5 space-y-4">

                    <div>
                        <label class="block text-gray-600 text-sm font-medium mb-1.5">Barang <span class="text-red-500">*</span></label>
                        <select v-model="form.id_barang"
                            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white">
                            <option value="">Pilih Barang</option>
                            <option v-for="b in barangList" :key="b.id_barang" :value="b.id_barang">
                                {{ b.nama_barang }} (Stok: {{ b.stok }})
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-gray-600 text-sm font-medium mb-1.5">Jenis <span class="text-red-500">*</span></label>
                        <div class="grid grid-cols-2 gap-3">
                            <button type="button"
                                @click="form.jenis = 'masuk'"
                                :class="form.jenis === 'masuk'
                                    ? 'bg-green-50 border-green-400 text-green-700'
                                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'"
                                class="border-2 rounded-xl py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2">
                                <span>↑</span> Barang Masuk
                            </button>
                            <button type="button"
                                @click="form.jenis = 'keluar'"
                                :class="form.jenis === 'keluar'
                                    ? 'bg-red-50 border-red-400 text-red-600'
                                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'"
                                class="border-2 rounded-xl py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2">
                                <span>↓</span> Barang Keluar
                            </button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-gray-600 text-sm font-medium mb-1.5">Jumlah <span class="text-red-500">*</span></label>
                        <input type="number" v-model="form.jumlah" placeholder="0" min="1"
                            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                    </div>

                    <div>
                        <label class="block text-gray-600 text-sm font-medium mb-1.5">Keterangan</label>
                        <textarea v-model="form.keterangan" placeholder="Keterangan (opsional)" rows="2"
                            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"></textarea>
                    </div>

                    <!-- Error -->
                    <div v-if="errorMsg" class="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                        {{ errorMsg }}
                    </div>

                </div>

                <!-- Modal Footer -->
                <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                    <button @click="closeModal"
                        class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors font-medium">
                        Batal
                    </button>
                    <button @click="simpan" :disabled="loadingSave"
                        class="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl transition-colors flex items-center gap-2">
                        <svg v-if="loadingSave" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        {{ loadingSave ? 'Menyimpan...' : 'Simpan' }}
                    </button>
                </div>

            </div>
        </div>

    </div>
    `,
    data() {
        return {
            historiList  : [],
            barangList   : [],
            search       : '',
            filterJenis  : '',
            loading      : false,
            loadingSave  : false,
            showModal    : false,
            errorMsg     : '',
            userRole     : localStorage.getItem('userRole') ?? 'staff',
            form         : {
                id_barang  : '',
                jenis      : 'masuk',
                jumlah     : '',
                keterangan : ''
            }
        }
    },
    computed: {
        filteredHistori() {
            return this.historiList.filter(h => {
                const matchSearch = !this.search ||
                    h.nama_barang.toLowerCase().includes(this.search.toLowerCase());
                const matchJenis = !this.filterJenis || h.jenis === this.filterJenis;
                return matchSearch && matchJenis;
            });
        },
        totalMasuk() {
            return this.historiList
                .filter(h => h.jenis === 'masuk')
                .reduce((sum, h) => sum + parseInt(h.jumlah), 0);
        },
        totalKeluar() {
            return this.historiList
                .filter(h => h.jenis === 'keluar')
                .reduce((sum, h) => sum + parseInt(h.jumlah), 0);
        }
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() {
            this.loading = true;
            axios.get(apiUrl + '/api/histori')
                .then(res => { this.historiList = res.data.data; })
                .catch(() => {})
                .finally(() => { this.loading = false; });

            axios.get(apiUrl + '/api/barang')
                .then(res => { this.barangList = res.data.data; })
                .catch(() => {});
        },
        openTambah() {
            this.errorMsg  = '';
            this.form      = { id_barang: '', jenis: 'masuk', jumlah: '', keterangan: '' };
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.errorMsg  = '';
        },
        simpan() {
            if (!this.form.id_barang) {
                this.errorMsg = 'Pilih barang terlebih dahulu!';
                return;
            }
            if (!this.form.jumlah || this.form.jumlah <= 0) {
                this.errorMsg = 'Jumlah harus lebih dari 0!';
                return;
            }
            this.loadingSave = true;
            axios.post(apiUrl + '/api/histori', this.form)
                .then(() => {
                    this.closeModal();
                    this.loadData();
                })
                .catch(() => { this.errorMsg = 'Gagal menyimpan data. Coba lagi.'; })
                .finally(() => { this.loadingSave = false; });
        },
        hapus(id) {
            if (confirm('Yakin ingin menghapus histori ini?')) {
                axios.delete(apiUrl + '/api/histori/' + id)
                    .then(() => { this.loadData(); })
                    .catch(() => { alert('Gagal menghapus histori.'); });
            }
        },
        formatTanggal(tanggal) {
            if (!tanggal) return '-';
            return new Date(tanggal).toLocaleDateString('id-ID', {
                day   : '2-digit',
                month : 'short',
                year  : 'numeric',
                hour  : '2-digit',
                minute: '2-digit'
            });
        }
    }
};
