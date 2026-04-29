import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#0a0a0a] text-white font-sans selection:bg-white/30 selection:text-white relative">
            <Head title="Log in - LuxeDrop" />
            
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md p-10 bg-[#111] border border-white/10 relative z-10">
                <div className="mb-10 text-center">
                    <Link href="/" className="inline-block text-3xl font-bold tracking-tighter mb-2">LuxeDrop</Link>
                    <p className="text-gray-400 text-sm">Masuk untuk mengelola reservasi Anda.</p>
                </div>

                {status && (
                    <div className="mb-4 text-sm font-medium text-emerald-500 text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-white focus:ring-0 px-4 py-3 text-sm transition-colors"
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <p className="mt-2 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest" htmlFor="password">Password</label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs text-gray-500 hover:text-white transition-colors"
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
                            className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-white focus:ring-0 px-4 py-3 text-sm transition-colors"
                            autoComplete="current-password"
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
                                className="bg-[#0a0a0a] border-white/20 text-white focus:ring-0 focus:ring-offset-0 rounded-sm w-4 h-4 cursor-pointer"
                            />
                            <span className="ml-3 text-sm text-gray-400 group-hover:text-white transition-colors">
                                Ingat saya
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-white text-black font-bold uppercase tracking-widest text-xs py-4 hover:bg-gray-200 transition-colors mt-2 disabled:opacity-50"
                    >
                        Masuk Sekarang
                    </button>
                    
                    <div className="text-center mt-4">
                        <span className="text-gray-500 text-sm">Belum punya akun? </span>
                        <Link href={route('register')} className="text-white text-sm font-semibold hover:underline">
                            Daftar di sini
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
