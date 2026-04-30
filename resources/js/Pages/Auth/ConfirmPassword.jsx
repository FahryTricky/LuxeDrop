import { Head, Link, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30 selection:text-white relative">
            <Head title="Konfirmasi Password - LuxeDrop" />
            
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                <div className="mb-10 text-center">
                    <Link href="/" className="inline-block text-3xl font-bold tracking-tighter mb-4 hover:opacity-80 transition-opacity">LuxeDrop</Link>
                    <div className="mx-auto w-12 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />
                    <div className="w-16 h-16 mx-auto rounded-full border border-white/10 bg-white/5 flex items-center justify-center mb-6">
                        <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight mb-2">Area Terlindungi</h1>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
                        Ini adalah area aman. Silakan konfirmasi password Anda sebelum melanjutkan.
                    </p>
                </div>

                <div className="bg-[#111] border border-white/5 p-8 rounded-xl">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="luxe-label" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="luxe-input"
                                autoFocus
                                placeholder="••••••••"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && <p className="mt-2 text-xs text-red-500">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full btn-primary"
                        >
                            {processing ? 'Memverifikasi...' : 'Konfirmasi'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
