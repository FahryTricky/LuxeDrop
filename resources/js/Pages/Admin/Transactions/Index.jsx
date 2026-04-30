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
            case 'pengecekan_mobil': return 'text-blue-400 border-blue-500/30 bg-blue-500/10 focus:border-blue-500 focus:ring-blue-500';
            case 'menunggu_towing': return 'text-orange-400 border-orange-500/30 bg-orange-500/10 focus:border-orange-500 focus:ring-orange-500';
            case 'proses_pengiriman': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10 focus:border-yellow-500 focus:ring-yellow-500';
            case 'pengiriman_selesai': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 focus:border-emerald-500 focus:ring-emerald-500';
            case 'dikembalikan': return 'text-purple-400 border-purple-500/30 bg-purple-500/10 focus:border-purple-500 focus:ring-purple-500';
            default: return 'text-gray-400 border-white/10 bg-[#0a0a0a] focus:border-gray-500 focus:ring-gray-500';
        }
    };

    const handleStatusChange = (id, newStatus) => {
        router.put(route('admin.transactions.update', id), { status: newStatus }, {
            preserveScroll: true,
        });
    };

    // Calculate summary stats
    const activeCount = transactions.data?.filter(t => ['proses_pengiriman', 'menunggu_towing'].includes(t.status)).length || 0;
    const totalRevenue = transactions.data?.reduce((sum, t) => sum + Number(t.total_price), 0) || 0;

    return (
        <AdminLayout auth={auth}>
            <Head title="Manajemen Transaksi - LuxeDrop" />

            <div className="mb-10 animate-fade-in-up">
                <h1 className="text-4xl font-bold tracking-tight mb-2">
                    Manajemen <span className="font-light italic text-gray-400">Transaksi.</span>
                </h1>
                <p className="text-sm text-gray-500">Lacak dan perbarui status penyewaan kendaraan.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-in-up stagger-1">
                <div className="bg-[#111] border border-white/5 p-6 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Total Order</div>
                        <div className="text-2xl font-bold">{transactions.total || transactions.data?.length || 0}</div>
                    </div>
                </div>
                <div className="bg-[#111] border border-white/5 p-6 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0 relative">
                        <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {activeCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-500 text-black text-[8px] font-bold flex items-center justify-center">{activeCount}</span>
                        )}
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Sedang Aktif</div>
                        <div className="text-2xl font-bold">{activeCount}</div>
                    </div>
                </div>
                <div className="bg-[#111] border border-white/5 p-6 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Revenue (Page)</div>
                        <div className="text-xl font-bold text-emerald-400">Rp {totalRevenue.toLocaleString('id-ID')}</div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#111] border border-white/5 shadow-2xl rounded-xl overflow-hidden relative animate-fade-in-up stagger-2">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
                
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-5 pl-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-20">Order ID</th>
                                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Penyewa</th>
                                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kendaraan</th>
                                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Durasi / Total</th>
                                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status Saat Ini</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.data.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="p-5 pl-6 text-sm text-gray-600 font-mono">#{tx.id}</td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400 uppercase flex-shrink-0">
                                                {tx.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-white">{tx.user.name}</div>
                                                <div className="text-[10px] text-gray-600 tracking-wider">{tx.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="text-sm text-white font-medium">{tx.vehicle.name}</div>
                                        <div className="text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">{tx.vehicle.type.replace(/_/g, ' ')}</div>
                                    </td>
                                    <td className="p-5">
                                        <div className="text-sm text-white font-medium">{tx.duration_days} Hari</div>
                                        <div className="text-xs text-emerald-400 mt-0.5 font-semibold">Rp {Number(tx.total_price).toLocaleString('id-ID')}</div>
                                    </td>
                                    <td className="p-5">
                                        <select
                                            value={tx.status}
                                            onChange={(e) => handleStatusChange(tx.id, e.target.value)}
                                            className={`text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer px-3 py-2 ${getStatusColor(tx.status)}`}
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
                                    <td colSpan="5" className="p-16 text-center">
                                        <div className="w-16 h-16 mx-auto rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center mb-4">
                                            <svg className="w-7 h-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 text-sm">Belum ada transaksi penyewaan.</p>
                                    </td>
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
