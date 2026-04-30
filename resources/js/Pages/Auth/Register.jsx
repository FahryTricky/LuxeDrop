import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        tab_id: typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('luxedrop_tab_id') || '') : '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen flex bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30 selection:text-white">
            <Head title="Register - LuxeDrop" />

            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 relative">
                {/* Background ambient */}
                <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
                
                <div className="w-full max-w-md relative z-10">
                    {/* Logo */}
                    <div className="mb-12 animate-fade-in">
                        <Link href="/" className="inline-block text-3xl font-bold tracking-tighter hover:opacity-80 transition-opacity">LuxeDrop</Link>
                        <div className="mt-2 w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent" />
                    </div>

                    <div className="mb-10 animate-fade-in-up">
                        <h1 className="text-2xl font-bold tracking-tight mb-2">Bergabung dengan LuxeDrop</h1>
                        <p className="text-gray-500 text-sm">Mulai perjalanan eksklusif Anda hari ini.</p>
                    </div>

                    <form onSubmit={submit} className="flex flex-col gap-5 animate-fade-in-up stagger-1">
                        <div>
                            <label className="luxe-label" htmlFor="name">Nama Lengkap</label>
                            <input
                                id="name"
                                name="name"
                                value={data.name}
                                className="luxe-input"
                                autoComplete="name"
                                autoFocus
                                placeholder="Nama lengkap Anda"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="mt-2 text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="luxe-label" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="luxe-input"
                                autoComplete="username"
                                placeholder="nama@email.com"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <p className="mt-2 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="luxe-label" htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="luxe-input"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                {errors.password && <p className="mt-2 text-xs text-red-500">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="luxe-label" htmlFor="password_confirmation">Konfirmasi</label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="luxe-input"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                {errors.password_confirmation && <p className="mt-2 text-xs text-red-500">{errors.password_confirmation}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full btn-primary mt-4"
                        >
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                    Memproses...
                                </span>
                            ) : 'Buat Akun'}
                        </button>
                        
                        {/* Divider */}
                        <div className="flex items-center gap-4 my-2">
                            <div className="flex-1 h-px bg-white/5" />
                            <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">atau</span>
                            <div className="flex-1 h-px bg-white/5" />
                        </div>

                        <div className="text-center">
                            <span className="text-gray-600 text-sm">Sudah punya akun? </span>
                            <Link href={route('login')} className="text-white text-sm font-semibold hover:text-emerald-400 transition-colors">
                                Masuk di sini
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Bottom decoration */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-700 tracking-widest uppercase">
                    © 2026 LuxeDrop
                </div>
            </div>

            {/* Right Side - Cinematic Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1974"
                    alt="Luxury Car"
                    className="w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/60" />
                
                {/* Overlay Content */}
                <div className="absolute bottom-16 left-12 right-12 z-10 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase">Bergabung Sekarang</span>
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight mb-3 leading-tight">
                        Satu Akun,<br />
                        <span className="font-light italic text-gray-400">Akses Tak Terbatas.</span>
                    </h2>
                    <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                        Daftar dan dapatkan akses ke koleksi supercar dan exclusive two-wheelers premium yang siap diantar ke garasi Anda.
                    </p>
                </div>

                {/* Decorative Line */}
                <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            </div>
        </div>
    );
}
