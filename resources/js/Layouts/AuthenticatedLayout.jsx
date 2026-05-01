import { Link, usePage } from '@inertiajs/react';
import UserMenu from '@/Components/UserMenu';
import { ChatProvider } from '@/context/ChatContext';
import ChatWidget from '@/Components/ChatWidget';

export default function AuthenticatedLayout({ user, header, children }) {
    // We pass auth object matching what UserMenu expects
    const auth = { user };
    const { auth: pageAuth } = usePage().props;

    return (
        <ChatProvider user={auth.user} token={pageAuth.wsToken}>
            <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30 selection:text-white pb-20 relative">
                
                {auth.user && <ChatWidget currentUser={auth.user} />}
                
                {/* Ambient Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/[0.03] rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3" />
            </div>

            <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-6 py-6 flex items-center justify-between relative">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">LuxeDrop</Link>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-300 absolute left-1/2 -translate-x-1/2">
                        <Link href={route('browse.index')} className="hover:text-white transition-colors">Koleksi</Link>
                        <Link href="/#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</Link>
                        <Link href="/#kontak" className="hover:text-white transition-colors">Kontak</Link>
                    </div>

                    <div className="flex items-center gap-6">
                        {auth.user && auth.user.role !== 'admin' && (
                            <Link href={route('transactions.index')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors mr-4">Riwayat Transaksi</Link>
                        )}
                        <UserMenu auth={auth} />
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white/[0.02] border-b border-white/5 relative z-10">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="relative z-10 animate-fade-in">{children}</main>
            </div>
        </ChatProvider>
    );
}
