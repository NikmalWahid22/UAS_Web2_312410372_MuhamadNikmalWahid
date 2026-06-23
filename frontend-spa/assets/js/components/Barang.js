const Barang = {
    template: `
    <div>

        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-gray-800 font-bold text-xl">Data Barang</h1>
                <p class="text-gray-400 text-sm mt-0.5">Kelola seluruh data barang inventaris</p>
            </div>
            <button v-if="userRole === 'admin'"
                @click="openTambah"
                class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors duration-200 shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Tambah Barang
            </button>
        </div>

        <!-- Search -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
            <div class="relative">
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
        </div>

        <!-- Tabel -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-100">
                            <th class="text-left text-gray-500 font-semibold px-6 py-3.5 text-xs uppercase tracking-wider">No</th>
                            <th class="text-left text-gray-500 font-semibold px-6 py-3.5 text-xs uppercase tracking-wider">Nama Barang</th>
                            <th class="text-left text-gray-500 font-semibold px-6 py-3.5 text-xs uppercase tracking-wider">Kategori</th>
                            <th class="text-left text-gray-500 font-semibold px-6 py-3.5 text-xs uppercase tracking-wider">Supplier</th>
                            <th class="text-left text-gray-500 font-semibold px-6 py-3.5 text-xs uppercase tracking-wider">Stok</th>
                            <th class="text-left text-gray-500 font-semibold px-6 py-3.5 text-xs uppercase tracking-wider">Harga</th>
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
                        <tr v-else-if="filteredBarang.length === 0">
                            <td :colspan="userRole === 'admin' ? 7 : 6" class="text-center py-12">
                                <p class="text-gray-400 text-sm">Tidak ada data barang</p>
                            </td>
                        </tr>
                        <tr v-else v-for="(item, index) in filteredBarang" :key="item.id_barang"
                            class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 text-gray-400 text-xs">{{ index + 1 }}</td>
                            <td class="px-6 py-4">
                                <div>
                                    <p class="text-gray-800 font-medium">{{ item.nama_barang }}</p>
                                    <p class="text-gray-400 text-xs mt-0.5">{{ item.satuan }}</p>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="bg-purple-50 text-purple-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                                    {{ item.nama_kategori ?? '-' }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="text-gray-600 text-xs">{{ item.nama_supplier ?? '-' }}</span>
                            </td>
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
                            <td class="px-6 py-4" v-if="userRole === 'admin'">
                                <div class="flex items-center gap-2">
                                    <button @click="openEdit(item)"
                                        class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                    </button>
                                    <button @click="hapus(item.id_barang)"
                                        class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- MODAL TAMBAH / EDIT -->
        <div v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
            style="background: rgba(0,0,0,0.5)">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">

                <!-- Modal Header -->
                <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 class="text-gray-800 font-semibold text-base">
                        {{ isEdit ? 'Edit Barang' : 'Tambah Barang' }}
                    </h3>
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
                        <label class="block text-gray-600 text-sm font-medium mb-1.5">Nama Barang <span class="text-red-500">*</span></label>
                        <input type="text" v-model="form.nama_barang" placeholder="Masukkan nama barang"
                            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-gray-600 text-sm font-medium mb-1.5">Kategori</label>
                            <select v-model="form.id_kategori"
                                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white">
                                <option value="">Pilih Kategori</option>
                                <option v-for="k in kategoriList" :key="k.id_kategori" :value="k.id_kategori">
                                    {{ k.nama_kategori }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-600 text-sm font-medium mb-1.5">Supplier</label>
                            <select v-model="form.id_supplier"
                                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white">
                                <option value="">Pilih Supplier</option>
                                <option v-for="s in supplierList" :key="s.id_supplier" :value="s.id_supplier">
                                    {{ s.nama_supplier }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-gray-600 text-sm font-medium mb-1.5">Stok</label>
                            <input type="number" v-model="form.stok" placeholder="0" min="0"
                                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                        </div>
                        <div>
                            <label class="block text-gray-600 text-sm font-medium mb-1.5">Satuan</label>
                            <input type="text" v-model="form.satuan" placeholder="pcs / unit / kg"
                                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                        </div>
                    </div>

                    <div>
                        <label class="block text-gray-600 text-sm font-medium mb-1.5">Harga (Rp)</label>
                        <input type="number" v-model="form.harga" placeholder="0" min="0"
                            class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                    </div>

                    <div>
                        <label class="block text-gray-600 text-sm font-medium mb-1.5">Deskripsi</label>
                        <textarea v-model="form.deskripsi" placeholder="Deskripsi barang (opsional)" rows="3"
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
            barangList: [],
            kategoriList: [],
            supplierList: [],
            search: '',
            loading: false,
            loadingSave: false,
            showModal: false,
            isEdit: false,
            errorMsg: '',
            userRole: localStorage.getItem('userRole') ?? 'staff',
            form: {
                id_barang: null,
                nama_barang: '',
                id_kategori: '',
                id_supplier: '',
                stok: 0,
                harga: 0,
                satuan: '',
                deskripsi: ''
            }
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
                .then(res => { this.barangList = res.data.data; })
                .catch(() => { })
                .finally(() => { this.loading = false; });

            axios.get(apiUrl + '/api/kategori')
                .then(res => { this.kategoriList = res.data.data; })
                .catch(() => { });

            axios.get(apiUrl + '/api/supplier')
                .then(res => { this.supplierList = res.data.data; })
                .catch(() => { });
        },
        openTambah() {
            this.isEdit = false;
            this.errorMsg = '';
            this.form = { id_barang: null, nama_barang: '', id_kategori: '', id_supplier: '', stok: 0, harga: 0, satuan: '', deskripsi: '' };
            this.showModal = true;
        },
        openEdit(item) {
            this.isEdit = true;
            this.errorMsg = '';
            this.form = { ...item };
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.errorMsg = '';
        },
        simpan() {
            if (!this.form.nama_barang) {
                this.errorMsg = 'Nama barang wajib diisi!';
                return;
            }

            this.loadingSave = true;

            // Kirim sebagai form data
            const payload = {
                nama_barang: this.form.nama_barang,
                id_kategori: this.form.id_kategori,
                id_supplier: this.form.id_supplier,
                stok: this.form.stok,
                harga: this.form.harga,
                satuan: this.form.satuan,
                deskripsi: this.form.deskripsi ?? ''
            };

            const config = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            };

            const request = this.isEdit
                ? axios.put(apiUrl + '/api/barang/' + this.form.id_barang, params, config)
                : axios.post(apiUrl + '/api/barang', params, config);

            request
                .then(() => {
                    this.closeModal();
                    this.loadData();
                })
                .catch(err => {
                    this.errorMsg = err.response?.data?.messages?.errors
                        ? Object.values(err.response.data.messages.errors).join(', ')
                        : 'Gagal menyimpan data.';
                })
                .finally(() => {
                    this.loadingSave = false;
                });
        },
        hapus(id) {
            if (confirm('Yakin ingin menghapus barang ini?')) {
                axios.delete(apiUrl + '/api/barang/' + id)
                    .then(() => { this.loadData(); })
                    .catch(() => { alert('Gagal menghapus data.'); });
            }
        },
        formatHarga(harga) {
            return parseInt(harga).toLocaleString('id-ID');
        }
    }
};