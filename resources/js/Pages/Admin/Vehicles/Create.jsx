import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function AdminVehicleCreate({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        unit_code: '',
        name: '',
        type: 'supercar',
        top_speed: '',
        year: '',
        daily_price: '',
        image_url: '',
    });

    const [imagePreview, setImagePreview] = useState('');

    const handleImageUrlChange = (e) => {
        let val = e.target.value;
        if (val.includes('imgres') && val.includes('imgurl=')) {
            try {
                const url = new URL(val);
                const imgurl = url.searchParams.get('imgurl');
                if (imgurl) {
                    val = imgurl;
                }
            } catch (err) {}
        }
        setData('image_url', val);
        setImagePreview(val);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.vehicles.store'));
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Tambah Unit - LuxeDrop" />

            <div className="max-w-4xl mx-auto animate-fade-in-up">
                <div className="mb-8 flex items-center gap-4">
                    <Link href={route('admin.vehicles.index')} className="text-gray-500 hover:text-white transition-colors group flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Tambah Kendaraan Baru</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form */}
                    <div className="lg:col-span-2 bg-[#111] border border-white/5 p-8 shadow-2xl rounded-xl relative overflow-hidden">
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.04] rounded-full blur-[80px] pointer-events-none" />

                        <form onSubmit={submit} className="flex flex-col gap-6 relative z-10">
                            {/* Unit Code */}
                            <div>
                                <label className="luxe-label">Kode Unit <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={data.unit_code}
                                    onChange={e => setData('unit_code', e.target.value.toUpperCase())}
                                    className="luxe-input font-mono"
                                    placeholder="Contoh: SC-0005 atau LC-0001"
                                    maxLength={50}
                                />
                                <p className="text-[10px] text-gray-600 mt-1.5 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Format: SC (Supercar), LC (Luxury Car), TW (Two-Wheelers) + nomor. Kode harus unik.
                                </p>
                                {errors.unit_code && <div className="text-red-500 text-xs mt-2">{errors.unit_code}</div>}
                            </div>

                            <div>
                                <label className="luxe-label">Nama Kendaraan</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="luxe-input"
                                    placeholder="Contoh: Porsche 911 GT3"
                                />
                                {errors.name && <div className="text-red-500 text-xs mt-2">{errors.name}</div>}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="luxe-label">Tipe</label>
                                    <select
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        className="luxe-input"
                                    >
                                        <option value="supercar">Supercar</option>
                                        <option value="luxury_car">Luxury Car</option>
                                        <option value="exclusive_two_wheelers">Exclusive Two-Wheelers</option>
                                    </select>
                                    {errors.type && <div className="text-red-500 text-xs mt-2">{errors.type}</div>}
                                </div>
                                <div>
                                    <label className="luxe-label">Tahun</label>
                                    <input
                                        type="number"
                                        value={data.year}
                                        onChange={e => setData('year', e.target.value)}
                                        className="luxe-input"
                                        placeholder="2024"
                                    />
                                    {errors.year && <div className="text-red-500 text-xs mt-2">{errors.year}</div>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="luxe-label">Top Speed</label>
                                    <input
                                        type="text"
                                        value={data.top_speed}
                                        onChange={e => setData('top_speed', e.target.value)}
                                        className="luxe-input"
                                        placeholder="318 km/j"
                                    />
                                    {errors.top_speed && <div className="text-red-500 text-xs mt-2">{errors.top_speed}</div>}
                                </div>
                                <div>
                                    <label className="luxe-label">Harga Per Hari (Rp)</label>
                                    <input
                                        type="number"
                                        value={data.daily_price}
                                        onChange={e => setData('daily_price', e.target.value)}
                                        className="luxe-input"
                                        placeholder="15000000"
                                    />
                                    {errors.daily_price && <div className="text-red-500 text-xs mt-2">{errors.daily_price}</div>}
                                </div>
                            </div>

                            <div>
                                <label className="luxe-label">URL Gambar (Opsional)</label>
                                <input
                                    type="url"
                                    value={data.image_url}
                                    onChange={handleImageUrlChange}
                                    className="luxe-input"
                                    placeholder="https://..."
                                />
                                {errors.image_url && <div className="text-red-500 text-xs mt-2">{errors.image_url}</div>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="mt-4 btn-emerald rounded-lg w-full"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                        Memproses...
                                    </span>
                                ) : 'Tambah Unit'}
                            </button>
                        </form>
                    </div>

                    {/* Preview Card */}
                    <div className="space-y-4">
                        <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-5 pt-5 mb-3">Preview</div>
                            <div className="h-48 w-full overflow-hidden bg-black/50 border-t border-b border-white/5">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                {data.unit_code && (
                                    <span className="inline-block bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-[10px] font-mono text-emerald-400 font-bold mb-3">
                                        {data.unit_code}
                                    </span>
                                )}
                                <h3 className="font-bold text-lg truncate">{data.name || 'Nama Kendaraan'}</h3>
                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
                                    {data.type === 'supercar' ? 'Supercar' : (data.type === 'luxury_car' ? 'Luxury Car' : 'Two-Wheelers')} • {data.year || 'Tahun'}
                                </p>
                                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-sm">
                                    <span className="text-gray-500">{data.top_speed || '-'}</span>
                                    <span className="text-emerald-400 font-bold">
                                        {data.daily_price ? `Rp ${Number(data.daily_price).toLocaleString('id-ID')}` : '-'} <span className="text-gray-600 font-normal">/ hari</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
