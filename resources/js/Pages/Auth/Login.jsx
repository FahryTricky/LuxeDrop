import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        tab_id: typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('luxedrop_tab_id') || '') : '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30 selection:text-white">
            <Head title="Log in - LuxeDrop" />

            {/* Left Side - Cinematic Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1974"
                    alt="Luxury Car"
                    className="w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/60" />
                
                {/* Overlay Content */}
                <div className="absolute bottom-16 left-12 right-12 z-10 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase">Platform Aktif</span>
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight mb-3 leading-tight">
                        Selamat Datang<br />
                        <span className="font-light italic text-gray-400">Kembali.</span>
                    </h2>
                    <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                        Masuk ke akun LuxeDrop Anda untuk melanjutkan pengalaman berkendara premium tanpa batas.
                    </p>
                </div>

                {/* Decorative Line */}
                <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 relative">
                {/* Background ambient */}
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
                
                <div className="w-full max-w-md relative z-10">
                    {/* Logo */}
                    <div className="mb-12 animate-fade-in">
                        <Link href="/" className="inline-block text-3xl font-bold tracking-tighter hover:opacity-80 transition-opacity">LuxeDrop</Link>
                        <div className="mt-2 w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent" />
                    </div>

                    <div className="mb-10 animate-fade-in-up">
                        <h1 className="text-2xl font-bold tracking-tight mb-2">Masuk ke Akun</h1>
                        <p className="text-gray-500 text-sm">Akses koleksi kendaraan premium Anda.</p>
                    </div>

                    {status && (
                        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-500 animate-fade-in flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="flex flex-col gap-6 animate-fade-in-up stagger-1">
                        <div>
                            <label className="luxe-label" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="luxe-input"
                                autoComplete="username"
                                autoFocus
                                placeholder="nama@email.com"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="mt-2 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="luxe-label mb-0" htmlFor="password">Password</label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-[10px] font-bold text-gray-600 hover:text-emerald-500 transition-colors uppercase tracking-[0.15em]"
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="luxe-input"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && <p className="mt-2 text-xs text-red-500">{errors.password}</p>}
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="bg-[#0a0a0a] border-white/20 text-emerald-500 focus:ring-0 focus:ring-offset-0 rounded-sm w-4 h-4 cursor-pointer"
                                />
                                <span className="ml-3 text-sm text-gray-500 group-hover:text-gray-300 transition-colors">
                                    Ingat saya
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full btn-primary mt-2"
                        >
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                    Memproses...
                                </span>
                            ) : 'Masuk Sekarang'}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-2">
                            <div className="flex-1 h-px bg-white/5" />
                            <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">atau</span>
                            <div className="flex-1 h-px bg-white/5" />
                        </div>
                        
                        <div className="text-center">
                            <span className="text-gray-600 text-sm">Belum punya akun? </span>
                            <Link href={route('register')} className="text-white text-sm font-semibold hover:text-emerald-400 transition-colors">
                                Daftar di sini
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Bottom decoration */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-700 tracking-widest uppercase">
                    © 2026 LuxeDrop
                </div>
            </div>
        </div>
    );
}
