import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function UserTransactions({ auth, transactions }) {
    const getStatusColor = (status) => {
        switch(status) {
            case 'pengecekan_mobil': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'menunggu_towing': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'proses_pengiriman': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'pengiriman_selesai': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'dikembalikan': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    const getStatusLabel = (status) => {
        return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Riwayat Transaksi</h2>}
        >
            <Head title="Riwayat Transaksi - LuxeDrop" />

            <div className="py-12 bg-[#0a0a0a] min-h-screen text-white">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="mb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-2">Riwayat Sewa Saya</h1>
                            <p className="text-sm text-gray-400">Pantau status pengiriman unit dan riwayat penyewaan Anda.</p>
                        </div>
                        <Link href={route('browse.index')} className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm">
                            Sewa Lagi
                        </Link>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-gray-500 bg-[#1a1a1a]">
                                        <th className="p-4 pl-6 font-semibold">Unit</th>
                                        <th className="p-4 font-semibold">Durasi</th>
                                        <th className="p-4 font-semibold">Total Harga</th>
                                        <th className="p-4 font-semibold">Status</th>
                                        <th className="p-4 pr-6 font-semibold text-right">Tanggal Sewa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-gray-500">
                                                Belum ada riwayat transaksi. <Link href={route('browse.index')} className="text-emerald-500 hover:underline">Eksplorasi koleksi sekarang.</Link>
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.map(trx => (
                                            <tr key={trx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                <td className="p-4 pl-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0 bg-black">
                                                            <img src={trx.vehicle.image_url || 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800'} alt={trx.vehicle.name} className="w-full h-full object-cover opacity-80" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold">{trx.vehicle.name}</div>
                                                            <div className="text-xs text-gray-500">{trx.vehicle.type === 'car' ? 'Supercar' : 'Moge'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm">{trx.duration_days} Hari</td>
                                                <td className="p-4 font-bold text-emerald-500">Rp {Number(trx.total_price).toLocaleString('id-ID')}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${getStatusColor(trx.status)}`}>
                                                        {getStatusLabel(trx.status)}
                                                    </span>
                                                </td>
                                                <td className="p-4 pr-6 text-right text-sm text-gray-400">
                                                    {new Date(trx.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
