import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import iconMarkerUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';

const customIcon = L.icon({
    iconUrl: iconMarkerUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: iconShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const originLocation = [-6.3155, 106.8623]; // Mall Cijantung

export default function Checkout({ auth, vehicle }) {
    const { data, setData, post, processing, errors } = useForm({
        user_name: auth.user.name,
        user_age: '',
        user_email: auth.user.email,
        delivery_address: '',
        duration_days: 1,
        towing_price: 0,
    });

    const [distance, setDistance] = useState(0);
    const [mapInteracted, setMapInteracted] = useState(false);
    const [targetLocation, setTargetLocation] = useState(null);
    const [calculating, setCalculating] = useState(false);

    const calculateRoute = async (lat, lng) => {
        setTargetLocation([lat, lng]);
        setCalculating(true);
        try {
            const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;
            const res = await fetch(`https://api.tomtom.com/routing/1/calculateRoute/${originLocation[0]},${originLocation[1]}:${lat},${lng}/json?key=${apiKey}`);
            const json = await res.json();
            
            if (json.routes && json.routes.length > 0) {
                const route = json.routes[0];
                const distanceKm = (route.summary.lengthInMeters / 1000).toFixed(1);
                setDistance(distanceKm);
                
                // Towing price: Rp 15,000 per KM
                const towing = distanceKm * 15000;
                setData(prev => ({
                    ...prev,
                    towing_price: towing,
                    delivery_address: `Titik Pengiriman (${distanceKm} km dari Mall Cijantung)`
                }));
                setMapInteracted(true);
            } else {
                alert("Rute tidak ditemukan. Coba titik lain.");
            }
        } catch (error) {
            console.error(error);
            alert("Gagal menghitung rute. Pastikan API Key valid atau cek koneksi internet.");
        } finally {
            setCalculating(false);
        }
    };

    const LocationMapEvents = () => {
        useMapEvents({
            click(e) {
                calculateRoute(e.latlng.lat, e.latlng.lng);
            },
        });
        return null;
    };

    const submit = (e) => {
        e.preventDefault();
        if (!mapInteracted) {
            alert('Silakan pilih lokasi pengiriman di peta terlebih dahulu.');
            return;
        }
        post(route('checkout.store', vehicle.id));
    };

    const basePrice = vehicle.daily_price * data.duration_days;
    const totalPrice = basePrice + Number(data.towing_price);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Checkout Unit</h2>}
        >
            <Head title={`Checkout - ${vehicle.name}`} />

            <div className="py-12 bg-[#0a0a0a] min-h-screen text-white">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <Link href={route('browse.index')} className="text-gray-400 hover:text-white transition-colors mb-6 inline-flex items-center gap-2 text-sm">
                        <span>&larr;</span> Kembali ke Koleksi
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Kiri */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            <div className="bg-[#111] border border-white/5 p-6 rounded-xl shadow-2xl relative overflow-hidden">
                                <h3 className="text-xl font-bold mb-6">Data Diri & Pengiriman</h3>
                                
                                <form onSubmit={submit} className="space-y-6 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                value={data.user_name}
                                                onChange={e => setData('user_name', e.target.value)}
                                                className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-emerald-500 focus:ring-1 px-4 py-3 text-sm rounded-sm"
                                                required
                                            />
                                            {errors.user_name && <p className="text-xs text-red-500 mt-1">{errors.user_name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Umur</label>
                                            <input
                                                type="number"
                                                value={data.user_age}
                                                onChange={e => setData('user_age', e.target.value)}
                                                className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-emerald-500 focus:ring-1 px-4 py-3 text-sm rounded-sm"
                                                required
                                                min="18"
                                            />
                                            {errors.user_age && <p className="text-xs text-red-500 mt-1">{errors.user_age}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={data.user_email}
                                            onChange={e => setData('user_email', e.target.value)}
                                            className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-emerald-500 focus:ring-1 px-4 py-3 text-sm rounded-sm"
                                            required
                                        />
                                        {errors.user_email && <p className="text-xs text-red-500 mt-1">{errors.user_email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Durasi Pinjaman (Hari)</label>
                                        <input
                                            type="number"
                                            value={data.duration_days}
                                            onChange={e => {
                                                let val = parseInt(e.target.value);
                                                if (val > 5) val = 5;
                                                if (val < 1) val = 1;
                                                setData('duration_days', val);
                                            }}
                                            className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-emerald-500 focus:ring-1 px-4 py-3 text-sm rounded-sm"
                                            required
                                            min="1"
                                            max="5"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">Maksimal peminjaman 5 hari. Keterlambatan pengembalian akan dikenakan denda.</p>
                                        {errors.duration_days && <p className="text-xs text-red-500 mt-1">{errors.duration_days}</p>}
                                    </div>

                                    <div className="pt-4 border-t border-white/5 relative z-0">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Pilih Lokasi Pengiriman (Towing)</label>
                                        
                                        <div className="relative w-full h-[400px] bg-[#1a1a1a] rounded-lg border border-white/10 overflow-hidden mb-4 z-0">
                                            <MapContainer center={originLocation} zoom={11} className="w-full h-full z-0">
                                                <TileLayer
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />
                                                <Marker position={originLocation} icon={customIcon}>
                                                    {/* Origin Marker */}
                                                </Marker>
                                                {targetLocation && (
                                                    <Marker position={targetLocation} icon={customIcon} />
                                                )}
                                                <LocationMapEvents />
                                            </MapContainer>

                                            {/* Overlay for Distance/Price info */}
                                            {calculating && (
                                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[400] flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                                                </div>
                                            )}

                                            {!mapInteracted && !calculating && (
                                                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded shadow-lg z-[400] pointer-events-none text-center">
                                                    Klik pada peta untuk memilih lokasi pengiriman
                                                </div>
                                            )}
                                        </div>

                                        <input
                                            type="text"
                                            value={data.delivery_address}
                                            onChange={e => setData('delivery_address', e.target.value)}
                                            className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-emerald-500 focus:ring-1 px-4 py-3 text-sm rounded-sm"
                                            placeholder="Detail Alamat Tambahan (Cth: Jalan, RT/RW, Patokan)"
                                            required
                                        />
                                        {errors.delivery_address && <p className="text-xs text-red-500 mt-1">{errors.delivery_address}</p>}
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={processing || calculating}
                                        className="w-full bg-emerald-500 text-black font-bold uppercase tracking-[0.2em] text-[11px] py-4 rounded-sm hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 mt-8 relative z-10"
                                    >
                                        {processing ? 'Memproses...' : 'Konfirmasi Pesanan'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Order Summary Kanan */}
                        <div className="space-y-6">
                            <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                                <div className="h-48 overflow-hidden relative">
                                    <img 
                                        src={vehicle.image_url || 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800'} 
                                        alt={vehicle.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent"></div>
                                    <div className="absolute bottom-4 left-4">
                                        <h4 className="text-xl font-bold">{vehicle.name}</h4>
                                        <p className="text-sm text-gray-400">{vehicle.year} • {vehicle.type === 'car' ? 'Supercar' : 'Moge'}</p>
                                    </div>
                                </div>
                                
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">Harga Per Hari</span>
                                        <span className="font-semibold">Rp {Number(vehicle.daily_price).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">Durasi</span>
                                        <span className="font-semibold">{data.duration_days} Hari</span>
                                    </div>
                                    
                                    <div className="border-t border-white/10 pt-4 flex justify-between items-center text-sm">
                                        <span className="text-gray-400">Subtotal</span>
                                        <span className="font-semibold">Rp {basePrice.toLocaleString('id-ID')}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">Jarak (Towing)</span>
                                        <span className="font-semibold">{distance} km</span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">Biaya Towing</span>
                                        <span className="font-semibold text-emerald-500">+ Rp {Number(data.towing_price).toLocaleString('id-ID')}</span>
                                    </div>
                                    
                                    <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                                        <div>
                                            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Total Biaya</span>
                                        </div>
                                        <span className="text-2xl font-bold text-emerald-500">Rp {totalPrice.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
