"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAddressStore } from "@/store/useAddressStore";
import { useAuth } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry",
];

export default function AddressesPage() {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const { addresses, isLoading, fetchAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddressStore();
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        pincode: "",
        state: "",
        city: "",
        line1: "",
        line2: "",
        landmark: "home",
        isDefault: false,
    });

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchAddresses(getToken);
        }
    }, [isLoaded, isSignedIn, getToken]);

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const addressData = {
                fullName: formData.fullName,
                phone: formData.phone,
                line1: formData.line1,
                line2: formData.line2,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                landmark: formData.landmark,
                isDefault: formData.isDefault,
            };

            if (editingId) {
                await updateAddress(getToken, editingId, addressData);
            } else {
                await addAddress(getToken, addressData);
            }
            
            closeForm();
        } catch (error) {
            // Error handled by store
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditClick = (address: any) => {
        setFormData({
            fullName: address.fullName,
            phone: address.phone,
            pincode: address.pincode,
            state: address.state,
            city: address.city,
            line1: address.line1,
            line2: address.line2 || "",
            landmark: address.landmark || "home",
            isDefault: address.isDefault,
        });
        setEditingId(address.id);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({
            fullName: "",
            phone: "",
            pincode: "",
            state: "",
            city: "",
            line1: "",
            line2: "",
            landmark: "home",
            isDefault: false,
        });
    };

    const confirmDelete = (addressId: string) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-charcoal">Are you sure you want to delete this address?</p>
                <div className="flex justify-end gap-2">
                    <Button 
                        variant="outline" 
                        type="button"
                        className="h-8 px-3 text-xs" 
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        type="button"
                        className="h-8 px-3 text-xs bg-red-600 hover:bg-red-700 border-red-600 text-white" 
                        onClick={() => {
                            deleteAddress(getToken, addressId);
                            toast.dismiss(t.id);
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        ), {
            duration: Infinity,
            position: 'top-center',
            id: 'delete-address-toast'
        });
    };

    return (
        <div className="max-w-4xl px-4 sm:px-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <h1 className="text-2xl font-semibold text-charcoal mb-2 sm:mb-0" style={{ fontFamily: "var(--font-heading)" }}>
                    Saved Addresses
                </h1>
                {!isFormOpen && (
                    <Button variant="primary" className="w-full sm:w-auto" onClick={() => setIsFormOpen(true)}>
                        <Plus size={18} />
                        Add New Address
                    </Button>
                )}
            </div>

            {isFormOpen && (
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-emerald/30 shadow-sm mb-8 animate-in fade-in slide-in-from-top-2">
                    <h2 className="text-xl font-semibold text-charcoal mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                        {editingId ? "Edit Address" : "Add New Address"}
                    </h2>
                    <form onSubmit={handleSaveAddress} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <Input
                                        label="Full Name"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        type="text"
                                        placeholder="Jane Doe"
                                    />
                                </div>
                                <Input
                                    label="Phone"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                />
                                <Input
                                    label="Pincode"
                                    required
                                    value={formData.pincode}
                                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                    maxLength={6}
                                    type="text"
                                    placeholder="400001"
                                />
                            </div>
                            <Input
                                label="Address Line 1"
                                required
                                value={formData.line1}
                                onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                                type="text"
                                placeholder="Apt, Suite, Building, Street"
                            />
                            <Input
                                label="Address Line 2"
                                value={formData.line2}
                                onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                                type="text"
                                placeholder="Landmark (optional)"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="City"
                                    required
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    type="text"
                                    placeholder="Mumbai"
                                />
                                <div>
                                    <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">
                                        State <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            className="w-full h-11 px-4 pr-10 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white focus:outline-none focus:border-charcoal transition-colors appearance-none"
                                        >
                                            <option value="" disabled>Select State</option>
                                            {INDIAN_STATES.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        <ChevronRight
                                            size={14}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted rotate-90 pointer-events-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 items-center mt-2">
                            <span className="text-sm font-medium text-charcoal label-caps">Address Type:</span>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="landmark"
                                        value="home"
                                        checked={formData.landmark === "home"}
                                        onChange={() => setFormData({ ...formData, landmark: "home" })}
                                        className="accent-emerald w-4 h-4"
                                    />
                                    <span className="text-sm">Home</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="landmark"
                                        value="work"
                                        checked={formData.landmark === "work"}
                                        onChange={() => setFormData({ ...formData, landmark: "work" })}
                                        className="accent-emerald w-4 h-4"
                                    />
                                    <span className="text-sm">Work</span>
                                </label>
                            </div>
                        </div>

                        <label className="flex items-start sm:items-center gap-2 cursor-pointer mt-4">
                            <input
                                type="checkbox"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                className="accent-emerald w-4 h-4 rounded-sm mt-0.5 sm:mt-0"
                            />
                            <span className="text-xs sm:text-sm text-charcoal leading-tight">Make this my default address</span>
                        </label>

                        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-border mt-6">
                            <Button type="submit" variant="primary" className="w-full sm:w-auto h-11 sm:h-10" disabled={submitting}>
                                {submitting ? "Saving..." : (editingId ? "Update Address" : "Save Address")}
                            </Button>
                            <Button type="button" variant="outline" className="w-full sm:w-auto h-11 sm:h-10" onClick={closeForm} disabled={submitting}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {isLoading && addresses.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-48 w-full rounded-xl" />
                </div>
            ) : addresses.length === 0 && !isFormOpen ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-border/60">
                    <MapPin className="mx-auto h-12 w-12 text-muted mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-charcoal mb-2">No addresses saved</h3>
                    <p className="text-muted text-sm mb-6 max-w-sm mx-auto">
                        You haven't saved any addresses yet. Add an address to make your checkout experience faster.
                    </p>
                    <Button variant="primary" onClick={() => setIsFormOpen(true)}>
                        <Plus size={16} /> Add Address
                    </Button>
                </div>
            ) : !isFormOpen ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className={`bg-white rounded-xl p-4 sm:p-6 border relative transition-all ${address.isDefault ? "border-emerald shadow-sm" : "border-border hover:border-charcoal/30"
                                }`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between gap-2 mb-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    {address.landmark && (
                                        <span className="text-[10px] sm:text-xs bg-gray-100 text-charcoal px-2.5 py-1 rounded-sm uppercase tracking-wider font-semibold">
                                            {address.landmark}
                                        </span>
                                    )}
                                    {address.isDefault && (
                                        <span className="text-[10px] sm:text-xs bg-emerald/10 text-emerald px-2.5 py-1 rounded-sm flex items-center gap-1 font-medium">
                                            <MapPin size={12} className="w-3 h-3" /> Default
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                    <button 
                                      aria-label="Edit" 
                                      className="p-1.5 text-muted hover:text-emerald hover:bg-emerald/10 rounded-md transition-colors"
                                      onClick={() => handleEditClick(address)}
                                    >
                                        <Edit2 size={16} className="w-[14px] h-[14px] sm:w-4 sm:h-4" />
                                    </button>
                                    <button 
                                      aria-label="Delete" 
                                      className="p-1.5 text-muted hover:text-error hover:bg-red-50 rounded-md transition-colors"
                                      onClick={() => confirmDelete(address.id)}
                                    >
                                        <Trash2 size={16} className="w-[14px] h-[14px] sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="mb-5 sm:mb-6">
                                <h3 className="text-sm sm:text-base font-semibold text-charcoal mb-2">{address.fullName}</h3>
                                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                                    {address.line1}
                                    {address.line2 && <><br />{address.line2}</>}
                                    <br />
                                    {address.city}, {address.state} {address.pincode}
                                    <br />
                                    {address.country}
                                </p>
                                <p className="text-sm text-charcoal mt-3 font-medium flex items-center gap-2">
                                    <span className="text-muted">Mobile:</span> {address.phone}
                                </p>
                            </div>

                            {/* Set Default */}
                            {!address.isDefault && (
                                <button
                                    className="text-sm font-medium text-emerald hover:underline transition-all"
                                    onClick={() => setDefaultAddress(getToken, address.id)}
                                    disabled={isLoading}
                                >
                                    Set as Default
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
