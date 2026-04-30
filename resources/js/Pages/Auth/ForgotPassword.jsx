import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30 selection:text-white relative">
            <Head title="Lupa Password - LuxeDrop" />
            
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                <div className="mb-10 text-center">
                    <Link href="/" className="inline-block text-3xl font-bold tracking-tighter mb-4 hover:opacity-80 transition-opacity">LuxeDrop</Link>
                    <div className="mx-auto w-12 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mb-6" />
                    <h1 className="text-xl font-bold tracking-tight mb-2">Lupa Password?</h1>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
                        Tidak masalah. Masukkan email Anda dan kami akan mengirimkan link untuk mengatur ulang password.
                    </p>
                </div>

                {status && (
                    <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-500 flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {status}
                    </div>
                )}

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
                                autoFocus
                                placeholder="nama@email.com"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="mt-2 text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full btn-primary"
                        >
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                    Mengirim...
                                </span>
                            ) : 'Kirim Link Reset'}
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
