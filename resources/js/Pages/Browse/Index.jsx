import { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import UserMenu from '@/Components/UserMenu';

export default function BrowseIndex({ auth, vehicles = { data: [], links: [] }, filters = {} }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [type, setType] = useState(filters?.type || '');
    const [sort, setSort] = useState(filters?.sort || '');
    
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(route('browse.index'), { search, type, sort }, {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, type, sort]);

    const typeFilters = [
        { value: '', label: 'Semua' },
        { value: 'supercar', label: 'Supercar' },
        { value: 'luxury_car', label: 'Luxury Car' },
        { value: 'exclusive_two_wheelers', label: 'Two-Wheelers' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30 selection:text-white pb-20 relative">
            <Head title="Browse Koleksi - LuxeDrop" />

            {/* Ambient Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[150px] -translate-y-1/2" />
            </div>
            
            <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-6 py-6 flex items-center justify-between relative">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">LuxeDrop</Link>
                    </div>

                    <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-300 absolute left-1/2 -translate-x-1/2">
                        <Link href={route('browse.index')} className="text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-emerald-500 after:shadow-[0_0_10px_rgba(16,185,129,0.5)]">Koleksi</Link>
                        <Link href="/#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</Link>
                        <Link href="/#kontak" className="hover:text-white transition-colors">Kontak</Link>
                    </div>

                    <div className="flex items-center gap-6">
                        {auth.user && auth.user.role !== 'admin' && (
                            <Link href={route('transactions.index')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors mr-4">Riwayat Transaksi</Link>
                        )}
                        <UserMenu auth={auth} />
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 mt-12 relative z-10">
                {/* Flash Messages */}
                {auth?.flash?.error && (
                    <div className="mb-8 bg-red-500/10 border border-red-500/30 p-4 text-red-400 text-sm flex items-center gap-3 rounded-lg animate-fade-in">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {auth.flash.error}
                    </div>
                )}
                {auth?.flash?.success && (
                    <div className="mb-8 bg-emerald-500/10 border border-emerald-500/30 p-4 text-emerald-400 text-sm flex items-center gap-3 rounded-lg animate-fade-in">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {auth.flash.success}
                    </div>
                )}

                {/* Header */}
                <div className="mb-12 animate-fade-in-up">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">
                        Eksplorasi <span className="font-light italic text-gray-400">Koleksi.</span>
                    </h1>
                    <p className="text-gray-500 text-sm max-w-lg">Temukan kendaraan impian Anda untuk perjalanan tak terlupakan.</p>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col lg:flex-row gap-6 mb-12 pb-8 border-b border-white/5 animate-fade-in-up stagger-1">
                    {/* Category Chips */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {typeFilters.map(f => (
                            <button
                                key={f.value}
                                onClick={() => setType(f.value)}
                                className={`px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] rounded-full border transition-all duration-300 ${
                                    type === f.value 
                                        ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]' 
                                        : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 lg:ml-auto">
                        {/* Search */}
                        <div className="relative">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input 
                                type="text" 
                                placeholder="Cari kendaraan..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-[#111] border border-white/10 text-white focus:border-white/30 focus:ring-0 pl-11 pr-4 py-3 text-sm w-full sm:w-64 rounded-lg transition-colors"
                            />
                        </div>
                        {/* Sort */}
                        <select 
                            value={sort} 
                            onChange={(e) => setSort(e.target.value)}
                            className="bg-[#111] border border-white/10 text-white focus:border-white/30 focus:ring-0 px-4 py-3 text-sm w-full sm:w-52 rounded-lg transition-colors"
                        >
                            <option value="">Terbaru</option>
                            <option value="asc">Harga: Rendah ke Tinggi</option>
                            <option value="desc">Harga: Tinggi ke Rendah</option>
                        </select>
                    </div>
                </div>

                {/* Vehicle Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles?.data && vehicles.data.length > 0 ? vehicles.data.map((vehicle, index) => (
                        <div 
                            key={vehicle.id} 
                            className="group border border-white/5 hover:border-white/10 transition-all duration-500 relative flex flex-col bg-[#0a0a0a] hover:bg-[#111] rounded-xl overflow-hidden animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Type Badge */}
                            <div className="absolute top-5 left-5 z-10 border border-white/20 bg-black/60 backdrop-blur-xl px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-white rounded-full">
                                {vehicle.type === 'supercar' ? 'Supercar' : (vehicle.type === 'luxury_car' ? 'Luxury Car' : 'Two-Wheelers')}
                            </div>

                            {/* Image */}
                            <div className="h-64 w-full overflow-hidden relative">
                                <img 
                                    src={vehicle.image_url || 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800'} 
                                    alt={vehicle.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-70 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
                            </div>

                            {/* Content */}
                            <div className="p-7 flex flex-col flex-1">
                                <h3 className="text-xl font-bold truncate mb-1 group-hover:text-emerald-400 transition-colors">{vehicle.name}</h3>
                                <p className="text-xs text-gray-600 mb-6">Unit Premium • {vehicle.year}</p>
                                
                                {/* Specs */}
                                <div className="grid grid-cols-3 gap-4 mt-auto pt-6 border-t border-white/5">
                                    <div>
                                        <div className="text-[10px] font-bold tracking-[0.1em] text-gray-600 uppercase mb-1">Top Speed</div>
                                        <div className="font-semibold text-sm">{vehicle.top_speed}</div>
                                    </div>
                                    <div className="border-l border-white/5 pl-4">
                                        <div className="text-[10px] font-bold tracking-[0.1em] text-gray-600 uppercase mb-1">Tahun</div>
                                        <div className="font-semibold text-sm">{vehicle.year}</div>
                                    </div>
                                    <div className="border-l border-white/5 pl-4">
                                        <div className="text-[10px] font-bold tracking-[0.1em] text-gray-600 uppercase mb-1">Per Hari</div>
                                        <div className="font-semibold text-sm text-emerald-400 line-clamp-1">Rp {Number(vehicle.daily_price).toLocaleString('id-ID')}</div>
                                    </div>
                                </div>

                                <Link 
                                    href={route('checkout.show', vehicle.id)} 
                                    className="w-full mt-6 bg-white text-black font-bold uppercase tracking-widest text-xs py-3.5 hover:bg-gray-100 transition-all flex items-center justify-center gap-2 rounded-lg group-hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]"
                                >
                                    Sewa Sekarang
                                    <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-24 text-center">
                            <div className="w-20 h-20 mx-auto rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-sm">Tidak ada kendaraan yang ditemukan sesuai kriteria.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {vehicles?.links && vehicles.links.length > 3 && (
                    <div className="flex justify-center mt-14 gap-2">
                        {vehicles.links.map((link, i) => (
                            link.url ? (
                                <Link 
                                    key={i} 
                                    href={link.url}
                                    className={`px-4 py-2.5 text-sm border rounded-lg transition-all ${link.active ? 'bg-white text-black border-white font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'border-white/10 text-gray-400 hover:bg-[#111] hover:text-white hover:border-white/20'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span 
                                    key={i}
                                    className="px-4 py-2.5 text-sm border border-white/5 text-gray-600 cursor-not-allowed rounded-lg"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
