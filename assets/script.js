/**
 * Melody Furniture - Admin Panel Automation Script
 * Berfungsi untuk merender Top Navbar dan Aside Menu secara dinamis pada halaman Admin.
 */

document.addEventListener("DOMContentLoaded", function () {
    // 1. Ambil data halaman aktif dan judul halaman dari atribut tag <body>
    const currentPage = document.body.getAttribute("data-page") || "dashboard";
    const pageTitle = document.body.getAttribute("data-title") || "Dashboard Utama";

    // 2. Daftar Menu Navigasi (Sesuai dengan Sidebar Dashboard Utama)
    const menuItems = [
        { id: 'dashboard', name: 'Dashboard Utama', icon: 'dashboard', url: 'dashboard_admin.html' },
        { id: 'pesanan', name: 'Manajemen Pesanan', icon: 'shopping_cart', url: 'order_admin.html' },
        { id: 'stok', name: 'Katalog & Stok', icon: 'inventory_2', url: 'katalog_admin.html' },
        { id: 'wa-template', name: 'WA Automation Hub', icon: 'smart_toy', url: 'wa_admin.html' },
        { id: 'promo', name: 'Voucher & Promo', icon: 'confirmation_number', url: 'voucher_admin.html' }
    ];

    // 3. Render Mobile Overlay (Backdrop saat sidebar mobile aktif)
    const overlayHtml = `<div class="fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300" id="mobile-overlay" onclick="toggleSidebar()"></div>`;
    document.body.insertAdjacentHTML('afterbegin', overlayHtml);

    // 4. Olah & Render Aside Menu (Sidebar)
    let sidebarLinksHtml = '';
    menuItems.forEach(item => {
        // REVISI LOGIKA: Menggunakan toleransi multi-nama (alias) agar pencocokan data-page fleksibel
        const isActive = item.id === currentPage || 
                         (item.id === 'promo' && (currentPage === 'voucher' || currentPage === 'promo')) ||
                         (item.id === 'stok' && (currentPage === 'katalog' || currentPage === 'stok')) ||
                         (item.id === 'wa-template' && (currentPage === 'wa-automation' || currentPage === 'wa-template'));
        
        // Pilih class tailwind berdasarkan status aktif/tidaknya menu
        const linkClass = isActive 
            ? "flex items-center gap-3 px-4 py-3 text-secondary font-bold border-r-4 border-secondary bg-bg-alt dark:bg-surface-container-high rounded-lg transition-all duration-200 text-sm group"
            : "flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:text-primary hover:bg-surface-container/50 dark:hover:bg-surface-container-highest rounded-lg transition-all duration-200 text-sm font-medium group";
        
        const iconClass = isActive 
            ? "text-secondary" 
            : "text-gray-400 group-hover:text-primary transition-colors";

        sidebarLinksHtml += `
            <a class="${linkClass}" href="${item.url}">
                <span class="material-symbols-outlined ${iconClass}">${item.icon}</span>
                <span>${item.name}</span>
            </a>
        `;
    });

    const sidebarHtml = `
        <aside class="bg-bg-main dark:bg-brand-blue-dark h-screen w-64 fixed left-0 top-0 border-r border-border-subtle dark:border-outline-variant z-50 transition-transform duration-300 ease-in-out -translate-x-full md:translate-x-0" id="sidebar">
            <div class="flex flex-col h-full py-6">
                <div class="px-6 mb-6 flex items-center justify-between">
                    <span class="font-headline-md text-xl font-extrabold text-primary dark:text-primary-fixed tracking-tight">Admin Panel</span>
                    <button class="md:hidden p-1 text-on-surface-variant hover:bg-bg-alt rounded-lg transition-colors focus:outline-none" onclick="toggleSidebar()">
                        <span class="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>
                <nav class="flex-1 overflow-y-auto px-4 space-y-1.5">
                    ${sidebarLinksHtml}
                </nav>
            </div>
        </aside>
    `;
    document.body.insertAdjacentHTML('afterbegin', sidebarHtml);

    // 5. Render Top App Bar (Navbar Atas dengan Dropdown Menu Profile Baru)
    const headerHtml = `
        <header class="bg-bg-main dark:bg-brand-blue-dark fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] h-16 border-b border-border-subtle dark:border-outline-variant z-30 flex justify-between items-center px-4 sm:px-6 lg:px-8 transition-all">
            <div class="flex items-center gap-3">
                <button class="md:hidden p-2 text-primary dark:text-primary-fixed hover:bg-bg-alt rounded-lg transition-colors focus:outline-none" onclick="toggleSidebar()">
                    <span class="material-symbols-outlined text-2xl">menu</span>
                </button>
                <h1 class="font-headline-sm text-base sm:text-lg font-bold text-primary dark:text-primary-fixed truncate">${pageTitle}</h1>
            </div>
            <div class="flex items-center gap-2 sm:gap-4">
                <div class="hidden sm:flex items-center bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-full text-xs font-semibold select-none">
                    <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
                    WA Server: Connected
                </div>
                <button class="relative p-2 text-on-surface-variant dark:text-surface-variant hover:bg-bg-alt dark:hover:bg-surface-container-high rounded-lg transition-colors focus:outline-none">
                    <span class="material-symbols-outlined text-2xl">notifications</span>
                    <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                <div class="relative">
                    <button id="profile-menu-button" onclick="toggleProfileDropdown(event)" class="flex items-center gap-2 p-1 pr-2 sm:pr-3 rounded-lg hover:bg-bg-alt dark:hover:bg-surface-container-high cursor-pointer transition-colors focus:outline-none">
                        <img alt="Admin Profile" class="w-8 h-8 rounded-lg object-cover border border-border-subtle shadow-sm shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYLDMKnEzPJSGgJUn5_sXJthmdFo36LE1B8RIPeCzfOJqrshrUEUVOlFXMjsw41flHU6wsZ7Ltxa5lM7jmYlzQ5fuWU8uLxxl5GlvLUcB7I4a8pwgInfbKMqac1M2IJEO1Szf_YMu0TSVvDkUJDoxsKa_6oqRPJTlSqnN48OiahFROcE3G1Nw8hzdT5CHcXW7t0rm_SH7Yul4Lz0G4f1_f2abq4zfdF_dv84Fhfld3Zpp_31CwzD8Ur1eoGixfMqn7VKD5JI47oYU"/>
                        <span class="hidden lg:block text-xs font-semibold text-primary dark:text-primary-fixed max-w-[100px] truncate">Admin Main</span>
                        <span class="material-symbols-outlined text-gray-400 text-lg transition-transform duration-200" id="profile-arrow">keyboard_arrow_down</span>
                    </button>
                    
                    <div id="profile-dropdown" class="absolute right-0 mt-2 w-48 bg-white dark:bg-brand-blue-dark rounded-xl border border-border-subtle dark:border-outline-variant shadow-lg py-1 hidden z-50 transition-all">
                        <div class="px-4 py-2 border-b border-border-subtle dark:border-outline-variant lg:hidden">
                            <p class="text-xs font-bold text-primary dark:text-primary-fixed truncate">Admin Main</p>
                        </div>
                        <a href="admin_login.html" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-error font-semibold hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                            <span class="material-symbols-outlined text-lg">logout</span>
                            <span>Keluar (Logout)</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    `;

    // Masukkan header ke dalam pembungkus konten utama
    const mainWrapper = document.getElementById("main-wrapper") || document.querySelector(".md\\:ml-64");
    if (mainWrapper) {
        mainWrapper.insertAdjacentHTML('afterbegin', headerHtml);
    } else {
        console.warn("Peringatan: Elemen kontainer pembungkus utama (id='main-wrapper') tidak ditemukan. Top Navbar gagal disisipkan.");
    }
});

// 6. Fungsi Global Toggle Sidebar Mobile Canvas
window.toggleSidebar = function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    }
};

// REVISI: Fungsi Global Toggle Dropdown Menu Profil Admin
window.toggleProfileDropdown = function (event) {
    event.stopPropagation(); // Mencegah event bubbling langsung memicu penutupan
    const dropdown = document.getElementById('profile-dropdown');
    const arrow = document.getElementById('profile-arrow');
    
    if (dropdown) {
        const isHidden = dropdown.classList.contains('hidden');
        // Tutup semua instance dropdown terbuka terlebih dahulu jika ada modul lain kelak
        dropdown.classList.toggle('hidden');
        if (arrow) {
            arrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    }
};

// REVISI: Event Listener Global untuk menutup Dropdown jika pengguna melakukan klik di luar area komponen
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('profile-dropdown');
    const button = document.getElementById('profile-menu-button');
    const arrow = document.getElementById('profile-arrow');
    
    if (dropdown && !dropdown.classList.contains('hidden')) {
        if (button && !button.contains(event.target)) {
            dropdown.classList.add('hidden');
            if (arrow) {
                arrow.style.transform = 'rotate(0deg)';
            }
        }
    }
});