import { useState, useRef, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';

export default function UserMenu({ auth }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    const user = auth?.user;
    
    if (!user) return null;

    const photoUrl = user.profile_photo 
        ? `/storage/${user.profile_photo}` 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&color=000&background=fff`;

    return (
        <div className="relative">
            <button 
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 focus:outline-none group"
            >
                <span className="text-sm font-semibold text-gray-400 group-hover:text-white transition-colors hidden sm:block">{user.name}</span>
                <div className="relative">
                    <img 
                        src={photoUrl} 
                        alt={user.name} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/10 group-hover:border-emerald-500/50 transition-all duration-300"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]" />
                </div>
            </button>

            {open && (
                <>
                    {/* Invisible Backdrop for closing menu */}
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>
                    
                    <div className="absolute right-0 mt-3 w-60 bg-[#111] border border-white/10 shadow-2xl z-50 rounded-xl overflow-hidden animate-fade-in">
                        <div className="py-1">
                            <div className="px-5 py-4 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <img src={photoUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                    <div className="min-w-0">
                                        <p className="text-sm text-white font-semibold truncate">{user.name}</p>
                                        <p className="text-[10px] text-gray-500 truncate tracking-wider">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {user.role === 'admin' ? (
                                <Link 
                                    href={route('admin.vehicles.index')} 
                                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors relative z-50"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Dashboard Admin
                                </Link>
                            ) : (
                                <Link 
                                    href={route('transactions.index')} 
                                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors relative z-50"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Riwayat Transaksi
                                </Link>
                            )}
                            
                            <Link 
                                href={route('profile.edit')} 
                                className="flex items-center gap-3 px-5 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors relative z-50"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Edit Profile
                            </Link>

                            <div className="border-t border-white/5 mt-1">
                                <button 
                                    onClick={() => {
                                        setOpen(false);
                                        router.post(route('logout'), {
                                            tab_id: typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('luxedrop_tab_id') : null,
                                        }, {
                                            onSuccess: () => {
                                                // Clear this tab's session ID so it gets a fresh one on next login
                                                if (typeof sessionStorage !== 'undefined') {
                                                    sessionStorage.removeItem('luxedrop_tab_id');
                                                }
                                            }
                                        });
                                    }}
                                    className="w-full text-left flex items-center gap-3 px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors relative z-50"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
