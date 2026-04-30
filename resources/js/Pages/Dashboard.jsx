import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard - LuxeDrop" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-[#111] border border-white/5 rounded-xl p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
                        
                        <div className="relative z-10">
                            <div className="w-20 h-20 mx-auto rounded-full border border-white/10 bg-white/5 flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Selamat Datang, {auth?.user?.name || 'User'}!</h3>
                            <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">Anda berhasil masuk. Mulai eksplorasi koleksi kendaraan premium kami atau kelola reservasi Anda.</p>
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href={route('browse.index')} className="btn-primary rounded-lg">
                                    Eksplorasi Koleksi
                                </Link>
                                <Link href={route('profile.edit')} className="btn-ghost rounded-lg">
                                    Edit Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
