import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import UserMenu from '@/Components/UserMenu';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    
    // -- Profile Update Form --
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        profile_photo: null,
        remove_photo: false,
        _method: 'patch',
    });

    const [photoPreview, setPhotoPreview] = useState(
        user.profile_photo ? `/storage/${user.profile_photo}` : null
    );
    const photoInput = useRef();

    const updatePhotoPreview = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData((prev) => ({ ...prev, profile_photo: file, remove_photo: false }));
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const submitProfile = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            preserveScroll: true,
        });
    };

    // -- Password Update Form --
    const { 
        data: passwordData, 
        setData: setPasswordData, 
        put: updatePassword, 
        processing: passwordProcessing, 
        errors: passwordErrors,
        reset: resetPassword,
        recentlySuccessful: passwordSuccessful
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitPassword = (e) => {
        e.preventDefault();
        updatePassword(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => resetPassword(),
        });
    };

    // -- Delete Account Form --
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data: deleteData,
        setData: setDeleteData,
        delete: destroyUser,
        processing: deleteProcessing,
        reset: resetDelete,
        errors: deleteErrors,
        clearErrors: clearDeleteErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
        setTimeout(() => passwordInput.current?.focus(), 250);
    };

    const deleteUser = (e) => {
        e.preventDefault();
        destroyUser(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => resetDelete(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearDeleteErrors();
        resetDelete();
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white/30 selection:text-white pb-20 relative">
            <Head title="Profile - LuxeDrop" />

            {/* Ambient Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3"></div>
            </div>

            <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-2xl font-bold tracking-tighter">LuxeDrop</Link>
                    </div>
                    <div className="flex items-center gap-6">
                        <UserMenu auth={auth} />
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 mt-12 max-w-4xl relative z-10">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Pengaturan Profil</h1>
                    <p className="text-sm text-gray-400">Kelola informasi akun, keamanan, dan preferensi Anda.</p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Profile Information */}
                    <div className="bg-[#111] border border-white/5 p-8 shadow-2xl rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                        <h2 className="text-lg font-bold uppercase tracking-widest mb-1 relative z-10">Informasi Profil</h2>
                        <p className="text-sm text-gray-400 mb-8 relative z-10">Perbarui informasi profil akun dan alamat email Anda.</p>

                        <form onSubmit={submitProfile} className="space-y-6 relative z-10">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="shrink-0 relative group">
                                    {photoPreview ? (
                                        <img src={photoPreview} className="w-24 h-24 rounded-full object-cover border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]" />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 uppercase font-bold text-3xl shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                            {data.name.charAt(0)}
                                        </div>
                                    )}
                                    <div 
                                        onClick={() => photoInput.current.click()}
                                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                                    >
                                        <span className="text-[10px] font-bold tracking-widest uppercase text-white">Ubah</span>
                                    </div>
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        ref={photoInput}
                                        onChange={updatePhotoPreview}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => photoInput.current.click()}
                                            className="bg-white/5 border border-white/10 text-white px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors rounded-sm"
                                        >
                                            Pilih Foto Baru
                                        </button>
                                        {(photoPreview || user.profile_photo) && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPhotoPreview(null);
                                                    setData((prev) => ({ ...prev, profile_photo: null, remove_photo: true }));
                                                }}
                                                className="bg-red-500/10 border border-red-500/20 text-red-500 px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-red-500/20 transition-colors rounded-sm"
                                            >
                                                Hapus Foto
                                            </button>
                                        )}
                                    </div>
                                    {errors.profile_photo && <p className="text-xs text-red-500 mt-2">{errors.profile_photo}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-3 text-sm rounded-sm transition-colors"
                                    />
                                    {errors.name && <p className="text-xs text-red-500 mt-2">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-3 text-sm rounded-sm transition-colors"
                                    />
                                    {errors.email && <p className="text-xs text-red-500 mt-2">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-emerald-500 text-black font-bold uppercase tracking-[0.2em] text-[11px] px-8 py-3 rounded-sm hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
                                >
                                    Simpan Profil
                                </button>
                                {recentlySuccessful && <p className="text-xs font-bold text-emerald-500 tracking-widest uppercase">Tersimpan.</p>}
                            </div>
                        </form>
                    </div>

                    {/* Password Update */}
                    <div className="bg-[#111] border border-white/5 p-8 shadow-2xl rounded-xl relative overflow-hidden">
                        <h2 className="text-lg font-bold uppercase tracking-widest mb-1 relative z-10">Perbarui Password</h2>
                        <p className="text-sm text-gray-400 mb-8 relative z-10">Pastikan akun Anda menggunakan password yang panjang dan acak agar tetap aman.</p>

                        <form onSubmit={submitPassword} className="space-y-6 relative z-10 max-w-2xl">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Password Saat Ini</label>
                                <input
                                    type="password"
                                    value={passwordData.current_password}
                                    onChange={e => setPasswordData('current_password', e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-3 text-sm rounded-sm transition-colors"
                                />
                                {passwordErrors.current_password && <p className="text-xs text-red-500 mt-2">{passwordErrors.current_password}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Password Baru</label>
                                    <input
                                        type="password"
                                        value={passwordData.password}
                                        onChange={e => setPasswordData('password', e.target.value)}
                                        className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-3 text-sm rounded-sm transition-colors"
                                    />
                                    {passwordErrors.password && <p className="text-xs text-red-500 mt-2">{passwordErrors.password}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Konfirmasi Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.password_confirmation}
                                        onChange={e => setPasswordData('password_confirmation', e.target.value)}
                                        className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-3 text-sm rounded-sm transition-colors"
                                    />
                                    {passwordErrors.password_confirmation && <p className="text-xs text-red-500 mt-2">{passwordErrors.password_confirmation}</p>}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={passwordProcessing}
                                    className="bg-white text-black font-bold uppercase tracking-[0.2em] text-[11px] px-8 py-3 rounded-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    Simpan Password
                                </button>
                                {passwordSuccessful && <p className="text-xs font-bold text-emerald-500 tracking-widest uppercase">Password Diperbarui.</p>}
                            </div>
                        </form>
                    </div>

                    {/* Delete Account */}
                    <div className="bg-[#1a0f0f] border border-red-500/20 p-8 shadow-2xl rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                        <h2 className="text-lg font-bold uppercase tracking-widest mb-1 text-red-500 relative z-10">Hapus Akun</h2>
                        <p className="text-sm text-gray-400 mb-8 relative z-10">Sekali dihapus, semua data dan riwayat penyewaan Anda akan hilang secara permanen.</p>

                        <div className="relative z-10">
                            <button
                                onClick={confirmUserDeletion}
                                className="bg-red-500 text-white font-bold uppercase tracking-[0.2em] text-[11px] px-8 py-3 rounded-sm hover:bg-red-600 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                            >
                                Hapus Akun Secara Permanen
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            {confirmingUserDeletion && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="bg-[#111] border border-white/10 p-8 w-full max-w-md relative z-10 shadow-2xl rounded-xl">
                        <h2 className="text-xl font-bold mb-4">Apakah Anda yakin?</h2>
                        <p className="text-sm text-gray-400 mb-6">
                            Setelah akun dihapus, seluruh sumber daya dan data akan dihapus secara permanen. Silakan masukkan password Anda untuk mengonfirmasi.
                        </p>

                        <form onSubmit={deleteUser}>
                            <div className="mb-6">
                                <input
                                    type="password"
                                    ref={passwordInput}
                                    value={deleteData.password}
                                    onChange={(e) => setDeleteData('password', e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 px-4 py-3 text-sm rounded-sm"
                                    placeholder="Password"
                                />
                                {deleteErrors.password && <p className="text-xs text-red-500 mt-2">{deleteErrors.password}</p>}
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-2.5 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={deleteProcessing}
                                    className="bg-red-500 text-white font-bold uppercase tracking-[0.2em] text-[11px] px-6 py-2.5 rounded-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    Hapus Akun
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
