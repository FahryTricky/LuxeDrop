import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminIndex({ auth, vehicles, totalUnits, activeRentals, weeklyRevenue }) {
    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus unit kendaraan ini? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(route('admin.vehicles.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Manajemen Kendaraan - LuxeDrop" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 animate-fade-in-up">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">
                        Manajemen <span className="font-light italic text-gray-400">Kendaraan.</span>
                    </h1>
                    <p className="text-sm text-gray-500">Kelola data unit Supercar, Luxury Car, dan Two-Wheelers.</p>
                </div>
                <Link
                    href={route('admin.vehicles.create')}
                    className="btn-emerald rounded-lg flex items-center gap-2 py-3"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Unit
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-in-up stagger-1">
                <div className="bg-[#111] border border-white/5 p-6 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Total Unit</div>
                        <div className="text-2xl font-bold">{totalUnits || 0}</div>
                    </div>
                </div>
                <div className="bg-[#111] border border-white/5 p-6 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Penyewa Aktif</div>
                        <div className="text-2xl font-bold">{activeRentals || 0}</div>
                    </div>
                </div>
                <div className="bg-[#111] border border-white/5 p-6 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Pendapatan Minggu Ini</div>
                        <div className="text-2xl font-bold">Rp {Number(weeklyRevenue || 0).toLocaleString('id-ID')}</div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#111] border border-white/5 shadow-2xl rounded-xl overflow-hidden animate-fade-in-up stagger-2">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-5 pl-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kode Unit</th>
                                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Preview</th>
                                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nama Unit</th>
                                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tipe</th>
                                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tahun</th>
                                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Harga / Hari</th>
                                <th className="p-5 pr-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {vehicles.data.map((vehicle) => (
                                <tr key={vehicle.id} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="p-5 pl-6">
                                        <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-xs font-mono text-emerald-400 font-bold">
                                            {vehicle.unit_code}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-black border border-white/5">
                                            <img
                                                src={vehicle.image_url || 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=200'}
                                                alt={vehicle.name}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-5 text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                        {vehicle.name}
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${vehicle.type === 'supercar' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                (vehicle.type === 'luxury_car' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20')
                                            }`}>
                                            {vehicle.type === 'supercar' ? 'Supercar' : (vehicle.type === 'luxury_car' ? 'Luxury Car' : 'Two-Wheelers')}
                                        </span>
                                    </td>
                                    <td className="p-5 text-sm text-gray-400 font-mono">{vehicle.year}</td>
                                    <td className="p-5 text-sm font-medium text-emerald-400">Rp {Number(vehicle.daily_price).toLocaleString('id-ID')}</td>
                                    <td className="p-5 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link
                                                href={route('admin.vehicles.edit', vehicle.id)}
                                                className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center hover:bg-blue-500/10 hover:border-blue-500/20 transition-colors group/btn"
                                                title="Edit"
                                            >
                                                <svg className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(vehicle.id)}
                                                className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/20 transition-colors group/btn"
                                                title="Hapus"
                                            >
                                                <svg className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {vehicles.data.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="p-16 text-center">
                                        <div className="w-16 h-16 mx-auto rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center mb-4">
                                            <svg className="w-7 h-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 text-sm">Belum ada data kendaraan.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {vehicles.links && vehicles.links.length > 3 && (
                <div className="flex justify-center mt-8 gap-2">
                    {vehicles.links.map((link, i) => (
                        link.url ? (
                            <Link
                                key={i}
                                href={link.url}
                                className={`px-4 py-2.5 text-sm border rounded-lg transition-all ${link.active ? 'bg-emerald-500 text-black border-emerald-500 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-white/10 text-gray-400 hover:bg-[#111] hover:text-white hover:border-white/20'}`}
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
        </AdminLayout>
    );
}
