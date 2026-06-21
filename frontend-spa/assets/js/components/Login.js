const Login = {
    template: `
    <div class="min-h-screen flex flex-col">

        <!-- Tombol Back -->
        <div class="px-6 py-4">
            <router-link to="/"
                class="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                Kembali ke Beranda
            </router-link>
        </div>

        <!-- Form Login -->
        <div class="flex-1 flex items-center justify-center px-4 pb-16">
            <div class="w-full max-w-md">

                <!-- Logo -->
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-500 to-blue-700 rounded-2xl shadow-lg shadow-blue-500/30 mb-4">
                        <span class="text-white text-2xl font-bold">EI</span>
                    </div>
                    <h1 class="text-white text-2xl font-bold tracking-tight">E-Inventory</h1>
                    <p class="text-slate-400 text-sm mt-1">Sistem Manajemen Inventaris Barang</p>
                </div>

                <!-- Card Login -->
                <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h2 class="text-white font-semibold text-lg mb-6">Masuk ke Panel Admin</h2>

                    <form @submit.prevent="handleLogin" class="space-y-4">

                        <!-- Username -->
                        <div>
                            <label class="block text-slate-300 text-sm font-medium mb-1.5">
                                Username / Email
                            </label>
                            <input
                                type="text"
                                v-model="username"
                                placeholder="Masukkan username"
                                required
                                class="w-full bg-white/10 border border-white/20 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            >
                        </div>

                        <!-- Password -->
                        <div>
                            <label class="block text-slate-300 text-sm font-medium mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                v-model="password"
                                placeholder="Masukkan password"
                                required
                                class="w-full bg-white/10 border border-white/20 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            >
                        </div>

                        <!-- Error Message -->
                        <div v-if="errorMessage"
                            class="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                            {{ errorMessage }}
                        </div>

                        <!-- Submit Button -->
                        <button
                            type="submit"
                            :disabled="loading"
                            class="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors duration-200 text-sm mt-2 flex items-center justify-center gap-2">
                            <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            {{ loading ? 'Memverifikasi...' : 'Masuk ke Sistem' }}
                        </button>

                    </form>
                </div>

                <p class="text-center text-slate-600 text-xs mt-6">
                    E-Inventory System &copy; 2025
                </p>
            </div>
        </div>

    </div>
    `,
    data() {
        return {
            username     : '',
            password     : '',
            errorMessage : '',
            loading      : false
        }
    },
    methods: {
        handleLogin() {
            this.loading      = true;
            this.errorMessage = '';

            axios.post(apiUrl + '/api/login', {
                username: this.username,
                password: this.password
            })
            .then(response => {
                if (response.data.status === 200) {
                    const data = response.data.data;
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userToken',  data.token);
                    localStorage.setItem('userName',   data.nama);
                    localStorage.setItem('userRole',   data.role);
                    this.$router.push('/dashboard');
                    window.location.reload();
                }
            })
            .catch(error => {
                if (error.response && error.response.data.messages) {
                    this.errorMessage = error.response.data.messages;
                } else {
                    this.errorMessage = 'Terjadi kesalahan jaringan atau server.';
                }
            })
            .finally(() => {
                this.loading = false;
            });
        }
    }
};