import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function TransactionsIndex({ auth, transactions }) {
    const [editingDates, setEditingDates] = useState(null); // menyimpan transaksi yang sedang diedit
    const [dateForm, setDateForm] = useState({ start_date: '', end_date: '', duration_days: 1 });
    const [saving, setSaving] = useState(false);

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

    const openDateModal = (tx) => {
        setEditingDates(tx);
        // Fallback ke created_at jika start_date belum ada (transaksi lama)
        const initialStart = tx.start_date || tx.created_at;
        const initialEnd = tx.end_date || tx.created_at;

        setDateForm({
            start_date: initialStart ? initialStart.split('T')[0] : '',
            end_date: initialEnd ? initialEnd.split('T')[0] : '',
            duration_days: tx.duration_days || 1
        });
    };

    const closeDateModal = () => {
        setEditingDates(null);
        setDateForm({ start_date: '', end_date: '', duration_days: 1 });
    };

    const handleStartDateChange = (val) => {
        if (!val) return;
        const start = new Date(val);
        if (isNaN(start.getTime())) return;

        const end = new Date(start);
        end.setDate(start.getDate() + parseInt(dateForm.duration_days));
        
        setDateForm(prev => ({
            ...prev,
            start_date: val,
            end_date: end.toISOString().split('T')[0]
        }));
    };

    const handleDurationChange = (val) => {
        let duration = parseInt(val) || 0;
        if (duration > 5) duration = 5; // Batasi maksimal 5 hari

        if (!dateForm.start_date) {
            setDateForm(prev => ({ ...prev, duration_days: duration }));
            return;
        }

        const start = new Date(dateForm.start_date);
        if (isNaN(start.getTime())) return;

        const end = new Date(start);
        end.setDate(start.getDate() + duration);

        setDateForm(prev => ({
            ...prev,
            duration_days: duration,
            end_date: end.toISOString().split('T')[0]
        }));
    };

    const handleEndDateChange = (val) => {
        if (!val || !dateForm.start_date) return;
        const start = new Date(dateForm.start_date);
        const end = new Date(val);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setDateForm(prev => ({
            ...prev,
            end_date: val,
            duration_days: diffDays > 0 ? diffDays : 0
        }));
    };

    const saveDates = () => {
        if (!dateForm.start_date || !dateForm.end_date) return;
        setSaving(true);
        router.patch(route('admin.transactions.updateDates', editingDates.id), dateForm, {
            preserveScroll: true,
            onFinish: () => {
                setSaving(false);
                closeDateModal();
            },
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
                                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Periode Sewa</th>
                                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status Saat Ini</th>
                                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Aksi</th>
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
                                        {tx.start_date ? (
                                            <div>
                                                <div className="text-xs text-emerald-400 font-medium">{new Date(tx.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                                <div className="text-[10px] text-gray-500 mt-0.5">s.d. {new Date(tx.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-600 italic">—</span>
                                        )}
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
                                    <td className="p-5 text-center">
                                        <button
                                            onClick={() => openDateModal(tx)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-wider hover:bg-orange-500/20 transition-colors"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Edit Tanggal
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {transactions.data.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="p-16 text-center">
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

            {/* Modal Edit Tanggal */}
            {editingDates && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={closeDateModal}
                    />

                    {/* Modal Panel */}
                    <div className="relative z-10 bg-[#111] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        {/* Glow accent */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/[0.05] rounded-full blur-[60px] pointer-events-none" />

                        {/* Header */}
                        <div className="flex items-start justify-between p-6 border-b border-white/10 relative z-10">
                            <div>
                                <h2 className="text-lg font-bold text-white">Edit Tanggal Sewa</h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    #{editingDates.id.toString().padStart(6, '0')} • {editingDates.user?.name} — {editingDates.vehicle?.name}
                                </p>
                            </div>
                            <button onClick={closeDateModal} className="text-gray-500 hover:text-white transition-colors ml-4 flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5 relative z-10">
                            {/* Tanggal Mulai */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">
                                        Tanggal Mulai
                                    </label>
                                    <input
                                        type="date"
                                        value={dateForm.start_date}
                                        onChange={e => handleStartDateChange(e.target.value)}
                                        className="w-full bg-[#0a0a0a] border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">
                                        Durasi (Hari)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={dateForm.duration_days}
                                        onChange={e => handleDurationChange(e.target.value)}
                                        className="w-full bg-[#0a0a0a] border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Tanggal Selesai */}
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">
                                    Tanggal Pengembalian (End Date)
                                </label>
                                <input
                                    type="date"
                                    value={dateForm.end_date}
                                    min={dateForm.start_date || undefined}
                                    onChange={e => handleEndDateChange(e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white rounded-lg px-4 py-3 text-sm focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400 font-medium italic">Preview Sistem:</span>
                                    <span className="text-sm text-white font-bold">
                                        {dateForm.duration_days} Hari Sewa
                                    </span>
                                </div>
                                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-xs text-gray-400 font-medium italic">Estimasi Total Baru:</span>
                                    <span className="text-sm text-emerald-400 font-bold">
                                        Rp {((editingDates.vehicle?.daily_price * dateForm.duration_days) + Number(editingDates.towing_price || 0)).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 p-6 pt-0 relative z-10">
                            <button
                                onClick={closeDateModal}
                                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={saveDates}
                                disabled={saving || dateForm.duration_days <= 0 || dateForm.duration_days > 5}
                                className="flex-1 px-4 py-3 rounded-xl bg-orange-500 text-black text-sm font-bold uppercase tracking-wider hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Menyimpan...
                                    </>
                                ) : 'Simpan Tanggal'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

