import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#0a0a0a] text-white font-sans selection:bg-white/30 selection:text-white relative">
            <Head title="Register - LuxeDrop" />
            
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md p-10 bg-[#111] border border-white/10 relative z-10">
                <div className="mb-10 text-center">
                    <Link href="/" className="inline-block text-3xl font-bold tracking-tighter mb-2">LuxeDrop</Link>
                    <p className="text-gray-400 text-sm">Bergabung dan mulai perjalanan eksklusif Anda.</p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2" htmlFor="name">Nama Lengkap</label>
                        <input
                            id="name"
                            name="name"
                            value={data.name}
                            className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-white focus:ring-0 px-4 py-3 text-sm transition-colors"
                            autoComplete="name"
                            autoFocus
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && <p className="mt-2 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-white focus:ring-0 px-4 py-3 text-sm transition-colors"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        {errors.email && <p className="mt-2 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-white focus:ring-0 px-4 py-3 text-sm transition-colors"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        {errors.password && <p className="mt-2 text-xs text-red-500">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2" htmlFor="password_confirmation">Konfirmasi Password</label>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-white focus:ring-0 px-4 py-3 text-sm transition-colors"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        {errors.password_confirmation && <p className="mt-2 text-xs text-red-500">{errors.password_confirmation}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-white text-black font-bold uppercase tracking-widest text-xs py-4 hover:bg-gray-200 transition-colors mt-4 disabled:opacity-50"
                    >
                        Buat Akun
                    </button>
                    
                    <div className="text-center mt-4">
                        <span className="text-gray-500 text-sm">Sudah punya akun? </span>
                        <Link href={route('login')} className="text-white text-sm font-semibold hover:underline">
                            Masuk di sini
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
