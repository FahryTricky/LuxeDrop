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
                <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors hidden sm:block">{user.name}</span>
                <img 
                    src={photoUrl} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/10 group-hover:border-white/30 transition-colors"
                />
            </button>

            {open && (
                <>
                    {/* Invisible Backdrop for closing menu */}
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>
                    
                    <div className="absolute right-0 mt-3 w-56 bg-[#111] border border-white/10 shadow-2xl z-50">
                        <div className="py-2">
                            <div className="px-4 py-3 border-b border-white/5 mb-2">
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Signed in as</p>
                                <p className="text-sm text-white font-semibold truncate mt-1">{user.email}</p>
                            </div>
                            
                            {user.role === 'admin' ? (
                                <Link 
                                    href={route('admin.vehicles.index')} 
                                    className="block px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors relative z-50"
                                >
                                    Dashboard Admin
                                </Link>
                            ) : (
                                <Link 
                                    href={route('transactions.index')} 
                                    className="block px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors relative z-50"
                                >
                                    Riwayat Transaksi
                                </Link>
                            )}
                            
                            <Link 
                                href={route('profile.edit')} 
                                className="block px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors relative z-50"
                            >
                                Edit Profile
                            </Link>
                            <Link 
                                href={route('logout')} 
                                method="post" 
                                as="button" 
                                className="w-full text-left block px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors mt-2 border-t border-white/5 relative z-50"
                            >
                                Logout
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
