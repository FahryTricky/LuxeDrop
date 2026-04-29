import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminIndex({ auth, vehicles }) {
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

            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Manajemen Kendaraan</h1>
                    <p className="text-sm text-gray-400">Kelola data unit Supercar dan Moge.</p>
                </div>
                <Link 
                    href={route('admin.vehicles.create')} 
                    className="bg-white text-black px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                    + Tambah Unit
                </Link>
            </div>

            <div className="bg-[#111] border border-white/5 shadow-2xl rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-24">ID</th>
                                <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nama Unit</th>
                                <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tipe</th>
                                <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tahun</th>
                                <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Harga / Hari</th>
                                <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {vehicles.data.map((vehicle, index) => (
                                <tr key={vehicle.id} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="p-6 text-sm text-gray-500 font-mono">#{vehicle.id}</td>
                                    <td className="p-6 text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                        {vehicle.name}
                                    </td>
                                    <td className="p-6 text-sm text-gray-400 uppercase tracking-widest text-[11px] font-bold">
                                        <span className={`px-2 py-1 rounded-sm ${
                                            vehicle.type === 'supercar' ? 'bg-blue-500/10 text-blue-400' : 
                                            (vehicle.type === 'luxury_car' ? 'bg-purple-500/10 text-purple-400' : 'bg-orange-500/10 text-orange-400')
                                        }`}>
                                            {vehicle.type.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="p-6 text-sm text-gray-400">{vehicle.year}</td>
                                    <td className="p-6 text-sm font-medium">Rp {Number(vehicle.daily_price).toLocaleString('id-ID')}</td>
                                    <td className="p-6 text-right space-x-6">
                                        <Link 
                                            href={route('admin.vehicles.edit', vehicle.id)} 
                                            className="text-[11px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(vehicle.id)}
                                            className="text-[11px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {vehicles.data.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-gray-500">Belum ada data kendaraan.</td>
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
                                className={`px-4 py-2 text-sm border rounded-sm transition-colors ${link.active ? 'bg-emerald-500 text-black border-emerald-500 font-bold' : 'border-white/10 text-gray-400 hover:bg-[#111] hover:text-white'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span 
                                key={i}
                                className="px-4 py-2 text-sm border border-white/5 text-gray-600 cursor-not-allowed rounded-sm"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
