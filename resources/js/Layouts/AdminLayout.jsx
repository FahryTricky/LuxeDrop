import { Link } from '@inertiajs/react';
import UserMenu from '@/Components/UserMenu';
import { ChatProvider } from '@/context/ChatContext';
import ChatWidget from '@/Components/ChatWidget';

export default function AdminLayout({ auth, children }) {
    return (
        <ChatProvider user={auth.user} token={auth.wsToken}>
            <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30 selection:text-white pb-20">
                {auth.user && <ChatWidget currentUser={auth.user} />}
                {/* Ambient Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3" />
            </div>

            <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">LuxeDrop</Link>
                        <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] font-bold border border-emerald-500/20 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                            Admin Hub
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-[0.2em] uppercase">
                            <Link 
                                href={route('admin.vehicles.index')} 
                                className={`relative py-2 transition-colors ${route().current('admin.vehicles.*') ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                Kendaraan
                                {route().current('admin.vehicles.*') && (
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                                )}
                            </Link>
                            <Link 
                                href={route('admin.transactions.index')} 
                                className={`relative py-2 transition-colors ${route().current('admin.transactions.*') ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                Transaksi
                                {route().current('admin.transactions.*') && (
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                                )}
                            </Link>
                        </div>
                        <div className="w-px h-6 bg-white/10 hidden md:block" />
                        <UserMenu auth={auth} />
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 mt-12 relative z-10 animate-fade-in">
                {children}
            </main>
            </div>
        </ChatProvider>
    );
}
