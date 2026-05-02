import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { useState } from 'react';

export default function UserTransactions({ auth, transactions }) {
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const openModal = (trx) => {
        setSelectedTransaction(trx);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setTimeout(() => setSelectedTransaction(null), 300);
    };
    const getStatusColor = (status) => {
        switch(status) {
            case 'pengecekan_mobil': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'menunggu_towing': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            case 'proses_pengiriman': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'pengiriman_selesai': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'dikembalikan': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    const getStatusLabel = (status) => {
        return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const isActive = (status) => ['proses_pengiriman', 'menunggu_towing'].includes(status);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Riwayat Transaksi</h2>}
        >
            <Head title="Riwayat Transaksi - LuxeDrop" />

            <div className="py-12 bg-[#0a0a0a] min-h-screen text-white">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 animate-fade-in-up">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-2">
                                Riwayat <span className="font-light italic text-gray-400">Sewa.</span>
                            </h1>
                            <p className="text-sm text-gray-500">Pantau status pengiriman unit dan riwayat penyewaan Anda.</p>
                        </div>
                        <Link href={route('browse.index')} className="btn-ghost rounded-lg text-[10px] py-3 px-6 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                            </svg>
                            Sewa Lagi
                        </Link>
                    </div>

                    {/* Transaction Cards (Mobile) + Table (Desktop) */}
                    <div className="animate-fade-in-up stagger-2">
                        {/* Desktop Table */}
                        <div className="hidden md:block bg-[#111] border border-white/5 rounded-xl overflow-hidden shadow-2xl relative">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
                            
                            <div className="overflow-x-auto relative z-10">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-gray-500 bg-white/[0.02]">
                                            <th className="p-5 pl-6 font-semibold">Unit</th>
                                            <th className="p-5 font-semibold">Durasi</th>
                                            <th className="p-5 font-semibold">Total Harga</th>
                                            <th className="p-5 font-semibold">Status</th>
                                            <th className="p-5 pr-6 font-semibold text-right">Tanggal Sewa</th>
                                            <th className="p-5 font-semibold text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="p-16 text-center">
                                                    <div className="w-16 h-16 mx-auto rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center mb-4">
                                                        <svg className="w-7 h-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-gray-500 text-sm mb-2">Belum ada riwayat transaksi.</p>
                                                    <Link href={route('browse.index')} className="text-emerald-500 hover:text-emerald-400 text-sm font-semibold transition-colors">
                                                        Eksplorasi koleksi sekarang →
                                                    </Link>
                                                </td>
                                            </tr>
                                        ) : (
                                            transactions.map(trx => (
                                                <tr key={trx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                                    <td className="p-5 pl-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-black border border-white/5">
                                                                <img src={trx.vehicle.image_url || 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800'} alt={trx.vehicle.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold group-hover:text-emerald-400 transition-colors">{trx.vehicle.name}</div>
                                                                <div className="text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">
                                                                    {trx.vehicle.type === 'supercar' ? 'Supercar' : (trx.vehicle.type === 'luxury_car' ? 'Luxury Car' : 'Two-Wheelers')}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <span className="text-sm font-medium">{trx.duration_days} Hari</span>
                                                    </td>
                                                    <td className="p-5 font-bold text-emerald-400">Rp {Number(trx.total_price).toLocaleString('id-ID')}</td>
                                                    <td className="p-5">
                                                        <span className={`status-pill rounded-full ${getStatusColor(trx.status)} flex items-center gap-1.5 w-fit`}>
                                                            {isActive(trx.status) && (
                                                                <span className="relative flex h-1.5 w-1.5">
                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                                                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
                                                                </span>
                                                            )}
                                                            {getStatusLabel(trx.status)}
                                                        </span>
                                                    </td>
                                                    <td className="p-5 pr-6 text-right text-sm text-gray-500">
                                                        {new Date(trx.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </td>
                                                    <td className="p-5 text-center">
                                                        <button onClick={() => openModal(trx)} className="btn-emerald py-1.5 px-3 rounded text-xs">
                                                            Detail
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4">
                            {transactions.length === 0 ? (
                                <div className="bg-[#111] border border-white/5 rounded-xl p-10 text-center">
                                    <p className="text-gray-500 text-sm mb-2">Belum ada riwayat transaksi.</p>
                                    <Link href={route('browse.index')} className="text-emerald-500 text-sm font-semibold">
                                        Eksplorasi koleksi sekarang →
                                    </Link>
                                </div>
                            ) : transactions.map(trx => (
                                <div key={trx.id} className="bg-[#111] border border-white/5 rounded-xl p-5 flex gap-4">
                                    <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-black border border-white/5">
                                        <img src={trx.vehicle.image_url || 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800'} alt={trx.vehicle.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-bold text-sm truncate">{trx.vehicle.name}</h3>
                                            <span className={`status-pill rounded-full text-[9px] flex-shrink-0 ${getStatusColor(trx.status)}`}>
                                                {getStatusLabel(trx.status)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-emerald-400 font-bold text-sm mt-1">Rp {Number(trx.total_price).toLocaleString('id-ID')}</p>
                                                <p className="text-xs text-gray-600 mt-1">{trx.duration_days} Hari • {new Date(trx.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                            <button onClick={() => openModal(trx)} className="btn-emerald py-1 px-3 rounded text-xs whitespace-nowrap">
                                                Detail
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={closeModal} maxWidth="2xl">
                {selectedTransaction && (
                    <div className="bg-[#111] p-6 text-white rounded-xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.05] rounded-full blur-[80px] pointer-events-none" />
                        
                        <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4 relative z-10">
                            <div>
                                <h2 className="text-xl font-bold">Detail Transaksi</h2>
                                <p className="text-xs text-gray-500 mt-1">#{selectedTransaction.id.toString().padStart(6, '0')} • {new Date(selectedTransaction.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Informasi Unit</h3>
                                    <div className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                                        <img src={selectedTransaction.vehicle.image_url} alt={selectedTransaction.vehicle.name} className="w-16 h-12 rounded object-cover" />
                                        <div>
                                            <p className="font-bold text-sm">{selectedTransaction.vehicle.name}</p>
                                            <p className="text-xs text-gray-400">{selectedTransaction.vehicle.type}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Rute Pengiriman</h3>
                                    <div className="bg-white/[0.02] p-4 rounded-lg border border-white/5 text-sm space-y-3">
                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center mt-1">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                <div className="w-0.5 h-full bg-white/10 my-1"></div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-0.5">Titik Awal (Pickup)</p>
                                                <p className="font-medium text-gray-200">{selectedTransaction.pickup_address || 'Mall Cijantung, Jakarta Timur'}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1"></div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-0.5">Tujuan (Delivery)</p>
                                                <p className="font-medium text-gray-200">{selectedTransaction.delivery_address || '-'}</p>
                                            </div>
                                        </div>
                                        <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-xs">
                                            <span className="text-gray-400">Total Jarak</span>
                                            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{selectedTransaction.distance_km || 0} km</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Rincian Pembayaran</h3>
                                    <div className="bg-white/[0.02] p-4 rounded-lg border border-white/5 space-y-3 text-sm">
                                        <div className="flex justify-between text-gray-400">
                                            <span>Sewa ({selectedTransaction.duration_days} Hari)</span>
                                            <span className="text-white">Rp {Number(selectedTransaction.base_price || 0).toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-400">
                                            <span>Ongkos Kirim (Towing)</span>
                                            <span className="text-white">Rp {Number(selectedTransaction.towing_price || 0).toLocaleString('id-ID')}</span>
                                        </div>
                                        {Number(selectedTransaction.penalty_price) > 0 && (
                                            <div className="flex justify-between text-red-400">
                                                <span>Denda Keterlambatan</span>
                                                <span>Rp {Number(selectedTransaction.penalty_price).toLocaleString('id-ID')}</span>
                                            </div>
                                        )}
                                        <div className="pt-3 border-t border-white/10 flex justify-between font-bold">
                                            <span>Total Akhir</span>
                                            <span className="text-emerald-400 text-lg">Rp {Number(selectedTransaction.total_price).toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
                            <button onClick={closeModal} className="btn-ghost px-6 py-2 rounded-lg text-sm">Tutup</button>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
