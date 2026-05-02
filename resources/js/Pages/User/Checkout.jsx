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
        pickup_address: 'Mall Cijantung, Jakarta Timur',
        distance_km: 0,
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
            
            // Lakukan 2 request paralel: 1 untuk jarak rute, 1 untuk nama lokasi (Reverse Geocoding)
            const [routeRes, geoRes] = await Promise.all([
                fetch(`https://api.tomtom.com/routing/1/calculateRoute/${originLocation[0]},${originLocation[1]}:${lat},${lng}/json?key=${apiKey}`),
                fetch(`https://api.tomtom.com/search/2/reverseGeocode/${lat},${lng}.json?key=${apiKey}`)
            ]);
            
            const routeJson = await routeRes.json();
            const geoJson = await geoRes.json();
            
            let locationName = "Titik Pengiriman";
            if (geoJson.addresses && geoJson.addresses.length > 0) {
                const addr = geoJson.addresses[0].address;
                const parts = [];
                if (addr.municipalitySubdivision) parts.push(addr.municipalitySubdivision); // Kecamatan/Kelurahan
                if (addr.municipality) parts.push(addr.municipality); // Kota/Kabupaten
                
                if (parts.length > 0) {
                    locationName = parts.join(', ');
                } else if (addr.freeformAddress) {
                    locationName = addr.freeformAddress;
                }
            }
            
            if (routeJson.routes && routeJson.routes.length > 0) {
                const route = routeJson.routes[0];
                const distanceKm = (route.summary.lengthInMeters / 1000).toFixed(1);
                setDistance(distanceKm);
                
                // Towing price: Rp 15,000 per KM
                const towing = distanceKm * 15000;
                setData(prev => ({
                    ...prev,
                    towing_price: towing,
                    distance_km: distanceKm,
                    delivery_address: locationName
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
                    
                    <Link href={route('browse.index')} className="text-gray-500 hover:text-white transition-colors mb-8 inline-flex items-center gap-2 text-sm group">
                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Koleksi
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
                        {/* Form Kiri */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            <div className="bg-[#111] border border-white/5 p-8 rounded-xl shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.03] rounded-full blur-[80px] pointer-events-none" />
                                
                                <div className="flex items-center gap-3 mb-8 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Data Diri & Pengiriman</h3>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Lengkapi informasi checkout</p>
                                    </div>
                                </div>
                                
                                <form onSubmit={submit} className="space-y-6 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="luxe-label">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                value={data.user_name}
                                                onChange={e => setData('user_name', e.target.value)}
                                                className="luxe-input"
                                                required
                                            />
                                            {errors.user_name && <p className="text-xs text-red-500 mt-1">{errors.user_name}</p>}
                                        </div>
                                        <div>
                                            <label className="luxe-label">Umur</label>
                                            <input
                                                type="number"
                                                value={data.user_age}
                                                onChange={e => setData('user_age', e.target.value)}
                                                className="luxe-input"
                                                required
                                                min="18"
                                                placeholder="Min. 18 tahun"
                                            />
                                            {errors.user_age && <p className="text-xs text-red-500 mt-1">{errors.user_age}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="luxe-label">Email</label>
                                        <input
                                            type="email"
                                            value={data.user_email}
                                            onChange={e => setData('user_email', e.target.value)}
                                            className="luxe-input"
                                            required
                                        />
                                        {errors.user_email && <p className="text-xs text-red-500 mt-1">{errors.user_email}</p>}
                                    </div>

                                    <div>
                                        <label className="luxe-label">Durasi Pinjaman (Hari)</label>
                                        <input
                                            type="number"
                                            value={data.duration_days}
                                            onChange={e => {
                                                let val = parseInt(e.target.value);
                                                if (val > 5) val = 5;
                                                if (val < 1) val = 1;
                                                setData('duration_days', val);
                                            }}
                                            className="luxe-input"
                                            required
                                            min="1"
                                            max="5"
                                        />
                                        <p className="text-[10px] text-gray-600 mt-2 flex items-center gap-1.5">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Maksimal peminjaman 5 hari. Keterlambatan pengembalian akan dikenakan denda.
                                        </p>
                                        {errors.duration_days && <p className="text-xs text-red-500 mt-1">{errors.duration_days}</p>}
                                    </div>

                                    <div className="pt-6 border-t border-white/5 relative z-0">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <label className="luxe-label mb-0">Pilih Lokasi Pengiriman</label>
                                        </div>
                                        
                                        <div className="relative w-full h-[400px] bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden mb-4 z-0">
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
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
                                                        <span className="text-xs text-gray-400 font-medium">Menghitung rute...</span>
                                                    </div>
                                                </div>
                                            )}

                                            {!mapInteracted && !calculating && (
                                                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-lg z-[400] pointer-events-none text-center border border-white/10">
                                                    📍 Klik pada peta untuk memilih lokasi pengiriman
                                                </div>
                                            )}

                                            {mapInteracted && (
                                                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-xl text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-lg z-[400] pointer-events-none border border-emerald-500/20">
                                                    <span className="text-emerald-400">{distance} km</span> • Rp {Number(data.towing_price).toLocaleString('id-ID')}
                                                </div>
                                            )}
                                        </div>

                                        <input
                                            type="text"
                                            value={data.delivery_address}
                                            onChange={e => setData('delivery_address', e.target.value)}
                                            className="luxe-input"
                                            placeholder="Detail Alamat Tambahan (Cth: Jalan, RT/RW, Patokan)"
                                            required
                                        />
                                        {errors.delivery_address && <p className="text-xs text-red-500 mt-1">{errors.delivery_address}</p>}
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={processing || calculating}
                                        className="w-full btn-emerald rounded-lg mt-6 relative z-10"
                                    >
                                        {processing ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                Memproses...
                                            </span>
                                        ) : 'Konfirmasi Pesanan'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Order Summary Kanan */}
                        <div className="space-y-6">
                            <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden shadow-2xl sticky top-28">
                                <div className="h-52 overflow-hidden relative">
                                    <img 
                                        src={vehicle.image_url || 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800'} 
                                        alt={vehicle.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-5 right-5">
                                        <h4 className="text-xl font-bold">{vehicle.name}</h4>
                                        <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-widest">
                                            {vehicle.type === 'supercar' ? 'Supercar' : (vehicle.type === 'luxury_car' ? 'Luxury Car' : 'Two-Wheelers')} • {vehicle.year}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="p-6 space-y-4">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Ringkasan Pesanan</div>
                                    
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Harga Per Hari</span>
                                        <span className="font-semibold">Rp {Number(vehicle.daily_price).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Durasi</span>
                                        <span className="font-semibold">{data.duration_days} Hari</span>
                                    </div>
                                    
                                    <div className="border-t border-white/5 pt-4 flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-semibold">Rp {basePrice.toLocaleString('id-ID')}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /></svg>
                                            Jarak
                                        </span>
                                        <span className="font-semibold">{distance} km</span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Biaya Towing</span>
                                        <span className="font-semibold text-emerald-400">+ Rp {Number(data.towing_price).toLocaleString('id-ID')}</span>
                                    </div>
                                    
                                    <div className="border-t border-white/5 pt-4 flex justify-between items-end">
                                        <div>
                                            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Total Biaya</span>
                                        </div>
                                        <span className="text-2xl font-bold text-emerald-400">Rp {totalPrice.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                {/* Bottom accent line */}
                                <div className="h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-transparent" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
