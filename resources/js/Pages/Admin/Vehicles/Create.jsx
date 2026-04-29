import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminVehicleForm({ auth, vehicle = null }) {
    const isEdit = !!vehicle;
    
    const { data, setData, post, put, processing, errors } = useForm({
        name: vehicle?.name || '',
        type: vehicle?.type || 'car',
        top_speed: vehicle?.top_speed || '',
        year: vehicle?.year || '',
        daily_price: vehicle?.daily_price || '',
        image_url: vehicle?.image_url || '',
    });

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
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.vehicles.update', vehicle.id));
        } else {
            post(route('admin.vehicles.store'));
        }
    };

    return (
        <AdminLayout auth={auth}>
            <Head title={isEdit ? "Edit Unit - LuxeDrop" : "Tambah Unit - LuxeDrop"} />

            <div className="max-w-3xl mx-auto">
                <div className="mb-8 flex items-center gap-4">
                    <Link href={route('admin.vehicles.index')} className="text-gray-400 hover:text-white transition-colors group flex items-center gap-2 text-sm">
                        <span className="transform group-hover:-translate-x-1 transition-transform">&larr;</span> Kembali
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">{isEdit ? 'Edit Kendaraan' : 'Tambah Kendaraan Baru'}</h1>
                </div>

                <div className="bg-[#111] border border-white/5 p-8 shadow-2xl rounded-xl relative overflow-hidden">
                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                    <form onSubmit={submit} className="flex flex-col gap-6 relative z-10">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Nama Kendaraan</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-3 text-sm rounded-sm transition-colors"
                                placeholder="Contoh: Porsche 911 GT3"
                            />
                            {errors.name && <div className="text-red-500 text-xs mt-2">{errors.name}</div>}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Tipe</label>
                                <select
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-3 text-sm rounded-sm transition-colors"
                                >
                                    <option value="supercar">Supercar</option>
                                    <option value="luxury_car">Luxury Car</option>
                                    <option value="exclusive_two_wheelers">Exclusive Two-Wheelers</option>
                                </select>
                                {errors.type && <div className="text-red-500 text-xs mt-2">{errors.type}</div>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Tahun</label>
                                <input
                                    type="number"
                                    value={data.year}
                                    onChange={e => setData('year', e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-3 text-sm rounded-sm transition-colors"
                                    placeholder="2024"
                                />
                                {errors.year && <div className="text-red-500 text-xs mt-2">{errors.year}</div>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Top Speed</label>
                                <input
                                    type="text"
                                    value={data.top_speed}
                                    onChange={e => setData('top_speed', e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-3 text-sm rounded-sm transition-colors"
                                    placeholder="318 km/j"
                                />
                                {errors.top_speed && <div className="text-red-500 text-xs mt-2">{errors.top_speed}</div>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Harga Per Hari (Rp)</label>
                                <input
                                    type="number"
                                    value={data.daily_price}
                                    onChange={e => setData('daily_price', e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-3 text-sm rounded-sm transition-colors"
                                    placeholder="15000000"
                                />
                                {errors.daily_price && <div className="text-red-500 text-xs mt-2">{errors.daily_price}</div>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">URL Gambar (Opsional)</label>
                            <input
                                type="url"
                                value={data.image_url}
                                onChange={handleImageUrlChange}
                                className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-3 text-sm rounded-sm transition-colors"
                                placeholder="https://..."
                            />
                            {errors.image_url && <div className="text-red-500 text-xs mt-2">{errors.image_url}</div>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="mt-6 bg-emerald-500 text-black font-bold uppercase tracking-[0.2em] text-[11px] py-4 rounded-sm hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
                        >
                            {isEdit ? 'Simpan Perubahan' : 'Tambah Unit'}
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
