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

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white/30 selection:text-white pb-20">
            <Head title="Browse Koleksi - LuxeDrop" />
            
            <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 py-6 flex items-center justify-between relative">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-2xl font-bold tracking-tighter">LuxeDrop</Link>
                    </div>

                    <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-300 absolute left-1/2 -translate-x-1/2">
                        <Link href={route('browse.index')} className="text-white transition-colors">Koleksi</Link>
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

            <div className="container mx-auto px-6 mt-12">
                {/* Flash Messages */}
                {auth?.flash?.error && (
                    <div className="mb-8 bg-red-500/10 border border-red-500/50 p-4 text-red-500 text-sm flex items-center gap-3 animate-pulse">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {auth.flash.error}
                    </div>
                )}
                {auth?.flash?.success && (
                    <div className="mb-8 bg-emerald-500/10 border border-emerald-500/50 p-4 text-emerald-500 text-sm flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {auth.flash.success}
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-white/5 pb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                            Eksplorasi <span className="font-light italic text-gray-400">Koleksi.</span>
                        </h1>
                        <p className="text-gray-400 text-sm">Temukan kendaraan impian Anda untuk perjalanan tak terlupakan.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <input 
                            type="text" 
                            placeholder="Cari kendaraan..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-[#111] border border-white/10 text-white focus:border-white focus:ring-0 px-4 py-3 text-sm w-full sm:w-64"
                        />
                        <select 
                            value={type} 
                            onChange={(e) => setType(e.target.value)}
                            className="bg-[#111] border border-white/10 text-white focus:border-white focus:ring-0 px-4 py-3 text-sm w-full sm:w-48"
                        >
                            <option value="">Semua Tipe</option>
                            <option value="supercar">Supercar</option>
                            <option value="luxury_car">Luxury Car</option>
                            <option value="exclusive_two_wheelers">Exclusive Two-Wheelers</option>
                        </select>
                        <select 
                            value={sort} 
                            onChange={(e) => setSort(e.target.value)}
                            className="bg-[#111] border border-white/10 text-white focus:border-white focus:ring-0 px-4 py-3 text-sm w-full sm:w-48"
                        >
                            <option value="">Terbaru</option>
                            <option value="asc">Harga: Rendah ke Tinggi</option>
                            <option value="desc">Harga: Tinggi ke Rendah</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles?.data && vehicles.data.length > 0 ? vehicles.data.map(vehicle => (
                        <div key={vehicle.id} className="group border border-white/5 hover:bg-[#111] transition-colors relative flex flex-col bg-[#0a0a0a]">
                            <div className="absolute top-6 left-6 z-10 border border-white/20 bg-black/50 backdrop-blur-md px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-white">
                                {vehicle.type === 'supercar' ? 'Supercar' : (vehicle.type === 'luxury_car' ? 'Luxury Car' : 'Exclusive Two-Wheelers')}
                            </div>
                            <div className="h-64 w-full overflow-hidden">
                                <img 
                                    src={vehicle.image_url || 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800'} 
                                    alt={vehicle.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                />
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold truncate">{vehicle.name}</h3>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4 mt-auto pt-8 border-t border-white/5">
                                    <div>
                                        <div className="text-[10px] font-bold tracking-[0.1em] text-gray-500 uppercase mb-1">Top Speed</div>
                                        <div className="font-semibold text-sm">{vehicle.top_speed}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold tracking-[0.1em] text-gray-500 uppercase mb-1">Tahun</div>
                                        <div className="font-semibold text-sm">{vehicle.year}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold tracking-[0.1em] text-gray-500 uppercase mb-1">Per Hari</div>
                                        <div className="font-semibold text-sm line-clamp-1">Rp {Number(vehicle.daily_price).toLocaleString('id-ID')}</div>
                                    </div>
                                </div>

                                <Link href={route('checkout.show', vehicle.id)} className="w-full mt-8 bg-white text-black font-bold uppercase tracking-widest text-xs py-4 hover:bg-gray-200 transition-colors flex items-center justify-center">
                                    Sewa Sekarang
                                </Link>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 text-center text-gray-500">
                            Tidak ada kendaraan yang ditemukan sesuai kriteria.
                        </div>
                    )}
                </div>

                {vehicles?.links && vehicles.links.length > 3 && (
                    <div className="flex justify-center mt-12 gap-2">
                        {vehicles.links.map((link, i) => (
                            link.url ? (
                                <Link 
                                    key={i} 
                                    href={link.url}
                                    className={`px-4 py-2 text-sm border ${link.active ? 'bg-white text-black border-white' : 'border-white/10 text-gray-400 hover:bg-[#111]'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span 
                                    key={i}
                                    className="px-4 py-2 text-sm border border-white/10 text-gray-400 opacity-50 cursor-not-allowed"
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
