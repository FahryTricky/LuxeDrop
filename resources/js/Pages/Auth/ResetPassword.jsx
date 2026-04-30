import { Head, Link, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30 selection:text-white relative">
            <Head title="Reset Password - LuxeDrop" />
            
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                <div className="mb-10 text-center">
                    <Link href="/" className="inline-block text-3xl font-bold tracking-tighter mb-4 hover:opacity-80 transition-opacity">LuxeDrop</Link>
                    <div className="mx-auto w-12 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mb-6" />
                    <h1 className="text-xl font-bold tracking-tight mb-2">Reset Password</h1>
                    <p className="text-gray-500 text-sm leading-relaxed">Masukkan password baru untuk akun Anda.</p>
                </div>

                <div className="bg-[#111] border border-white/5 p-8 rounded-xl">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="luxe-label" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="luxe-input"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="mt-2 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="luxe-label" htmlFor="password">Password Baru</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="luxe-input"
                                autoComplete="new-password"
                                autoFocus
                                placeholder="••••••••"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && <p className="mt-2 text-xs text-red-500">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="luxe-label" htmlFor="password_confirmation">Konfirmasi Password</label>
                            <input
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="luxe-input"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                            {errors.password_confirmation && <p className="mt-2 text-xs text-red-500">{errors.password_confirmation}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full btn-primary"
                        >
                            {processing ? 'Memproses...' : 'Reset Password'}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-6">
                    <Link href={route('login')} className="text-sm text-gray-500 hover:text-white transition-colors">
                        ← Kembali ke halaman login
                    </Link>
                </div>
            </div>
        </div>
    );
}
