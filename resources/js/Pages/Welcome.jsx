import { Head, Link, usePage, router } from '@inertiajs/react';
import UserMenu from '@/Components/UserMenu';
import { ChatProvider, useChat } from '@/context/ChatContext';
import ChatWidget from '@/Components/ChatWidget';

function ChatTriggerButton({ isAuthenticated }) {
    const chatContext = useChat();
    
    const handleClick = (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            router.get(route('login'));
        } else if (chatContext && chatContext.setIsChatOpen) {
            chatContext.setIsChatOpen(true);
        }
    };

    return (
        <button
            onClick={handleClick}
            className="inline-flex items-center gap-3 bg-emerald-500 text-black px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-emerald-400 transition-colors relative z-10"
        >
            Hubungi Admin via Live Chat
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        </button>
    );
}

export default function Welcome({ auth, recentVehicles = [], totalUsers = 0, totalVehicles = 0 }) {
    const { auth: pageAuth } = usePage().props;

    return (
        <ChatProvider user={auth?.user} token={pageAuth?.wsToken}>
            <Head title="LuxeDrop - Penyewaan Kendaraan Premium" />
            <div className="bg-[#0a0a0a] text-white font-sans selection:bg-white/30 selection:text-white">
                {auth?.user && <ChatWidget currentUser={auth.user} />}

                {/* HERO SECTION */}
                <section className="relative min-h-screen flex flex-col">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=2069"
                            alt="Premium Supercar Background"
                            className="w-full h-full object-cover opacity-50"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 via-[#0a0a0a]/30 to-[#0a0a0a]"></div>
                    </div>

                    {/* Navbar */}
                    <nav className="relative z-50 container mx-auto px-6 lg:px-12 py-8 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold tracking-tighter">LuxeDrop</span>
                        </div>

                        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-300 absolute left-1/2 -translate-x-1/2">
                            <Link href={route('browse.index')} className="hover:text-white transition-colors">Koleksi</Link>
                            <a href="#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</a>
                            <a href="#kontak" className="hover:text-white transition-colors">Kontak</a>
                        </div>

                        <div className="flex items-center gap-6 text-sm font-medium">
                            {auth?.user && auth.user.role !== 'admin' && (
                                <Link href={route('transactions.index')} className="text-gray-300 hover:text-white transition-colors mr-4">Riwayat Transaksi</Link>
                            )}
                            {auth?.user ? (
                                <UserMenu auth={auth} />
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-gray-300 hover:text-white transition-colors hidden md:block">
                                        Sign In
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-white text-black px-6 py-2.5 hover:bg-gray-200 transition-colors flex items-center gap-2 font-semibold"
                                    >
                                        Sign Up
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Main Hero Content */}
                    <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center py-12">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
                            <div className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </div>
                            <span className="text-[11px] font-bold tracking-[0.2em] text-gray-300 uppercase">
                                Kendaraan Tersedia dari Jakarta ke seluruh Indonesia
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight mb-6 leading-[1.1] max-w-5xl">
                            Sewa Kemewahan,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500 font-light italic pr-2">Kami Antar Kuncinya.</span>
                        </h1>

                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
                            Koleksi eksklusif supercar dan Exclusive Two-Wheelers kelas dunia, diantar langsung ke garasi Anda. Tanpa antrean. Tanpa kompromi.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <Link href={route('browse.index')} className="w-full sm:w-auto bg-white text-black px-8 py-4 flex items-center justify-center gap-3 font-semibold hover:bg-gray-200 transition-colors uppercase tracking-widest text-xs">
                                Eksplorasi Koleksi
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                            <a href="#cara-kerja" className="w-full sm:w-auto border border-white/30 text-white px-8 py-4 flex items-center justify-center gap-3 font-semibold hover:bg-white/10 transition-colors uppercase tracking-widest text-xs">
                                Cara Kerja
                            </a>
                        </div>
                    </main>

                    {/* Bottom Stats */}
                    <div className="relative z-10 w-full border-t border-white/10 bg-[#0a0a0a]/60 backdrop-blur-xl mt-auto">
                        <div className="container mx-auto px-6 py-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:divide-x divide-white/10">
                                <div className="flex flex-col items-center justify-center">
                                    <span className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">{totalVehicles}</span>
                                    <span className="text-[11px] text-gray-400 font-bold tracking-[0.2em] uppercase">Unit Eksklusif</span>
                                </div>
                                <div className="flex flex-col items-center justify-center pt-8 md:pt-0 border-t md:border-t-0 border-white/10">
                                    <span className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">{totalUsers}</span>
                                    <span className="text-[11px] text-gray-400 font-bold tracking-[0.2em] uppercase">Klien Premium</span>
                                </div>
                                <div className="flex flex-col items-center justify-center pt-8 md:pt-0 border-t md:border-t-0 border-white/10">
                                    <span className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">24/7</span>
                                    <span className="text-[11px] text-gray-400 font-bold tracking-[0.2em] uppercase">Admin</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS SECTION */}
                <section id="cara-kerja" className="relative py-32 px-6 lg:px-12 container mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
                        <div className="max-w-2xl">
                            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
                                Pengalaman<br />
                                <span className="font-light italic text-gray-400">Tanpa Celah.</span>
                            </h2>
                        </div>
                        <div className="max-w-md lg:pt-4">
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Empat langkah hening dari pemilihan hingga penjemputan—dirancang agar Anda hanya fokus pada satu hal: pengalaman berkendara.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-y border-l border-white/5">
                        {/* Step 1 */}
                        <div className="p-10 border-r border-b lg:border-b-0 border-white/5 flex flex-col group hover:bg-white/[0.02] transition-colors">
                            <div className="flex justify-between items-start mb-16">
                                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                                    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <span className="text-gray-600 font-mono text-sm">01</span>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4">Pilih & Verifikasi</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Telusuri koleksi, pilih kendaraan impian, lalu verifikasi identitas dengan aman.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="p-10 border-r border-b lg:border-b-0 border-white/5 flex flex-col group hover:bg-white/[0.02] transition-colors">
                            <div className="flex justify-between items-start mb-16">
                                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                                    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <span className="text-gray-600 font-mono text-sm">02</span>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4">Inspeksi & Pengiriman</h3>
                            <p className="text-gray-500 leading-relaxed mb-6">
                                Lacak posisi mobil Anda secara real-time hingga tiba di garasi.
                            </p>
                            <div className="mt-auto inline-flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-500 uppercase">Live Tracking Aktif</span>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="p-10 border-r border-b md:border-b-0 border-white/5 flex flex-col group hover:bg-white/[0.02] transition-colors">
                            <div className="flex justify-between items-start mb-16">
                                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                                    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <span className="text-gray-600 font-mono text-sm">03</span>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4">Nikmati Perjalanan</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Kunci diserahkan, jalanan menjadi panggung pribadi Anda.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="p-10 border-r border-white/5 flex flex-col group hover:bg-white/[0.02] transition-colors">
                            <div className="flex justify-between items-start mb-16">
                                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                                    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-gray-600 font-mono text-sm">04</span>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4">Penjemputan & Selesai</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Tim kami akan menjemput unit dengan presisi, tanpa repot.
                            </p>
                        </div>
                    </div>
                </section>

                {/* COLLECTION SECTION */}
                <section id="koleksi" className="relative py-32 border-t border-white/5">
                    <div className="container mx-auto px-6 lg:px-12 mb-16 flex flex-col sm:flex-row items-end justify-between gap-6">
                        <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                            Koleksi <span className="font-light italic text-gray-400">Kami.</span>
                        </h2>
                        <Link href={route('browse.index')} className="group flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-gray-400 hover:text-white transition-colors">
                            Lihat Seluruh Koleksi
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>

                    {/* Fleet Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full border-y border-white/5 bg-[#0a0a0a]">
                        {recentVehicles.map((vehicle, index) => (
                            <div key={vehicle.id} className={`group ${index !== 2 ? 'border-b lg:border-b-0 lg:border-r' : ''} border-white/5 hover:bg-[#111] transition-colors relative flex flex-col`}>
                                <div className="absolute top-6 left-6 z-10 border border-white/20 bg-black/50 backdrop-blur-md px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-white">
                                    {vehicle.type === 'supercar' ? 'Supercar' : (vehicle.type === 'luxury_car' ? 'Luxury Car' : 'Exclusive Two-Wheelers')}
                                </div>
                                <div className="h-72 sm:h-80 w-full overflow-hidden">
                                    <img
                                        src={vehicle.image_url || 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800'}
                                        alt={vehicle.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                    />
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-10 gap-4">
                                        <h3 className="text-2xl font-bold">{vehicle.name}</h3>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mt-auto pt-8 border-t border-white/5">
                                        <div>
                                            <div className="text-gray-500 mb-2">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                            </div>
                                            <div className="text-[10px] font-bold tracking-[0.1em] text-gray-500 uppercase mb-1">Top Speed</div>
                                            <div className="font-semibold text-sm">{vehicle.top_speed} km/j</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 mb-2">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                            <div className="text-[10px] font-bold tracking-[0.1em] text-gray-500 uppercase mb-1">Tahun</div>
                                            <div className="font-semibold text-sm">{vehicle.year}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 mb-2">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <div className="text-[10px] font-bold tracking-[0.1em] text-gray-500 uppercase mb-1">Per Hari</div>
                                            <div className="font-semibold text-sm">Rp {Number(vehicle.daily_price).toLocaleString('id-ID')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CONTACT SECTION */}
                <section id="kontak" className="relative py-32 border-t border-white/5 bg-white/[0.01]">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                            <div>
                                <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
                                    Hubungi <span className="font-light italic text-gray-400">Admin.</span>
                                </h2>
                                <p className="text-gray-400 text-lg leading-relaxed mb-12">
                                    Butuh bantuan khusus atau ingin berkonsultasi mengenai Luxury kami? Tim kami tersedia 24/7 untuk melayani Anda.
                                </p>

                                <div className="space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-gray-400">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-1">Email</div>
                                            <div className="text-white font-medium">admin@luxedrop.com</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-gray-400">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-1">Telepon</div>
                                            <div className="text-white font-medium">+62 (21) 500-LUXE</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#111] border border-white/5 p-12 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                                <h3 className="text-2xl font-bold mb-6 relative z-10">Prosedur Pengembalian</h3>
                                <p className="text-gray-400 mb-8 relative z-10 leading-relaxed">
                                    Ingin melakukan pengembalian unit sebelum atau tepat waktu? Silakan gunakan fitur Live Chat untuk berkoordinasi dengan admin terkait penjemputan unit oleh tim towing kami.
                                </p>
                                <ChatTriggerButton isAuthenticated={!!auth?.user} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer simple */}
                <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/5">
                    &copy; 2026 LuxeDrop. Semua Hak Dilindungi.
                </footer>
            </div>
        </ChatProvider>
    );
}
