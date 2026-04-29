import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function TransactionsIndex({ auth, transactions }) {
    const statuses = {
        pengecekan_mobil: 'Pengecekan Mobil',
        menunggu_towing: 'Menunggu Towing',
        proses_pengiriman: 'Proses Pengiriman',
        pengiriman_selesai: 'Pengiriman Selesai',
        dikembalikan: 'Unit Dikembalikan',
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'pengecekan_mobil': return 'text-blue-500 border-blue-500/50 bg-blue-500/10 focus:border-blue-500 focus:ring-blue-500';
            case 'menunggu_towing': return 'text-orange-500 border-orange-500/50 bg-orange-500/10 focus:border-orange-500 focus:ring-orange-500';
            case 'proses_pengiriman': return 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10 focus:border-yellow-500 focus:ring-yellow-500';
            case 'pengiriman_selesai': return 'text-emerald-500 border-emerald-500/50 bg-emerald-500/10 focus:border-emerald-500 focus:ring-emerald-500';
            case 'dikembalikan': return 'text-purple-500 border-purple-500/50 bg-purple-500/10 focus:border-purple-500 focus:ring-purple-500';
            default: return 'text-gray-500 border-white/10 bg-[#0a0a0a] focus:border-gray-500 focus:ring-gray-500';
        }
    };

    const handleStatusChange = (id, newStatus) => {
        router.put(route('admin.transactions.update', id), { status: newStatus }, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Manajemen Transaksi - LuxeDrop" />

            <div className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight mb-2">Manajemen Transaksi</h1>
                <p className="text-sm text-gray-400">Lacak dan perbarui status penyewaan kendaraan.</p>
            </div>

            <div className="bg-[#111] border border-white/5 shadow-2xl rounded-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-24">Order ID</th>
                                <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Penyewa</th>
                                <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kendaraan</th>
                                <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Durasi / Total</th>
                                <th className="p-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status Saat Ini</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.data.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="p-6 text-sm text-gray-500 font-mono">#{tx.id}</td>
                                    <td className="p-6">
                                        <div className="text-sm font-semibold text-white">{tx.user.name}</div>
                                        <div className="text-xs text-gray-500">{tx.user.email}</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="text-sm text-white">{tx.vehicle.name}</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{tx.vehicle.type}</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="text-sm text-white">{tx.duration_days} Hari</div>
                                        <div className="text-xs text-emerald-400 mt-1">Rp {Number(tx.total_price).toLocaleString('id-ID')}</div>
                                    </td>
                                    <td className="p-6">
                                        <select
                                            value={tx.status}
                                            onChange={(e) => handleStatusChange(tx.id, e.target.value)}
                                            className={`text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer px-3 py-2 ${getStatusColor(tx.status)}`}
                                        >
                                            {Object.entries(statuses).map(([key, label]) => (
                                                <option key={key} value={key} className="bg-[#111] text-white">{label}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {transactions.data.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-gray-500">Belum ada transaksi penyewaan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {transactions.links && transactions.links.length > 3 && (
                <div className="flex justify-center mt-8 gap-2 relative z-10">
                    {transactions.links.map((link, i) => (
                        link.url ? (
                            <Link 
                                key={i} 
                                href={link.url}
                                className={`px-4 py-2 text-sm border rounded-sm transition-colors ${link.active ? 'bg-blue-500 text-white border-blue-500 font-bold' : 'border-white/10 text-gray-400 hover:bg-[#111] hover:text-white'}`}
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
