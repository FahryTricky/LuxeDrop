import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30 selection:text-white relative">
            <Head title="Verifikasi Email - LuxeDrop" />
            
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                <div className="mb-10 text-center">
                    <Link href="/" className="inline-block text-3xl font-bold tracking-tighter mb-4 hover:opacity-80 transition-opacity">LuxeDrop</Link>
                    <div className="mx-auto w-12 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mb-6" />
                    
                    {/* Mail Icon */}
                    <div className="w-20 h-20 mx-auto rounded-full border border-white/10 bg-white/5 flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    
                    <h1 className="text-xl font-bold tracking-tight mb-3">Verifikasi Email Anda</h1>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
                        Terima kasih telah bergabung! Silakan verifikasi alamat email Anda dengan mengklik link yang baru saja kami kirimkan.
                    </p>
                </div>

                {status === 'verification-link-sent' && (
                    <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-500 flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Link verifikasi baru telah dikirim ke alamat email Anda.
                    </div>
                )}

                <div className="bg-[#111] border border-white/5 p-8 rounded-xl">
                    <form onSubmit={submit}>
                        <div className="flex flex-col gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full btn-emerald"
                            >
                                {processing ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi'}
                            </button>
                            
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="w-full text-center text-sm text-gray-500 hover:text-white transition-colors py-2"
                            >
                                Logout
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
