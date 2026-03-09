"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { mockAddresses } from "@/data/mock-data";
import { Address } from "@/types/order.types";

export default function AddressesPage() {
    const [addresses, setAddresses] = useState(mockAddresses);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<Partial<Address>>({
        fullName: "",
        phone: "",
        pincode: "",
        state: "",
        city: "",
        addressLine1: "",
        addressLine2: "",
        label: "home",
        isDefault: false,
    });

    const handleSaveAddress = (e: React.FormEvent) => {
        e.preventDefault();
        const newAddress: Address = {
            id: `addr-${Date.now()}`,
            fullName: formData.fullName || "",
            phone: formData.phone || "",
            addressLine1: formData.addressLine1 || "",
            addressLine2: formData.addressLine2 || "",
            city: formData.city || "",
            state: formData.state || "",
            pincode: formData.pincode || "",
            country: "India",
            isDefault: formData.isDefault || false,
            label: (formData.label as "home" | "work" | "other") || "home",
        };

        if (newAddress.isDefault) {
            setAddresses(addresses.map(a => ({ ...a, isDefault: false })).concat([newAddress]));
        } else {
            setAddresses([...addresses, newAddress]);
        }
        setIsAdding(false);
    };

    return (
        <div className="max-w-4xl px-4 sm:px-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <h1 className="text-2xl font-semibold text-charcoal mb-2 sm:mb-0" style={{ fontFamily: "var(--font-heading)" }}>
                    Saved Addresses
                </h1>
                {!isAdding && (
                    <Button variant="primary" className="w-full sm:w-auto" onClick={() => setIsAdding(true)}>
                        <Plus size={18} />
                        Add New Address
                    </Button>
                )}
            </div>

            {isAdding && (
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-emerald/30 shadow-sm mb-8 animate-in fade-in slide-in-from-top-2">
                    <h2 className="text-xl font-semibold text-charcoal mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                        Add New Address
                    </h2>
                    <form onSubmit={handleSaveAddress} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                placeholder="Enter your full name"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                            <Input
                                label="Mobile Number"
                                placeholder="10-digit mobile number"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Pincode"
                                placeholder="6 digits [0-9] PIN code"
                                required
                                value={formData.pincode}
                                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                            />
                            <Input
                                label="Locality / Town"
                                placeholder="e.g. Bandra West"
                                value={formData.addressLine2}
                                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="City / District"
                                required
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                            <Input
                                label="State"
                                required
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            />
                        </div>

                        <div className="w-full">
                            <Input
                                label="Address (House No, Building, Street, Area)"
                                required
                                value={formData.addressLine1}
                                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4 items-center mt-2">
                            <span className="text-sm font-medium text-charcoal label-caps">Address Type:</span>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="label"
                                        value="home"
                                        checked={formData.label === "home"}
                                        onChange={() => setFormData({ ...formData, label: "home" })}
                                        className="accent-emerald w-4 h-4"
                                    />
                                    <span className="text-sm">Home</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="label"
                                        value="work"
                                        checked={formData.label === "work"}
                                        onChange={() => setFormData({ ...formData, label: "work" })}
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
                            <Button type="submit" variant="primary" className="w-full sm:w-auto h-11 sm:h-10">
                                Save Address
                            </Button>
                            <Button type="button" variant="outline" className="w-full sm:w-auto h-11 sm:h-10" onClick={() => setIsAdding(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            )}

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
                                <span className="text-[10px] sm:text-xs bg-gray-100 text-charcoal px-2.5 py-1 rounded-sm uppercase tracking-wider font-semibold">
                                    {address.label}
                                </span>
                                {address.isDefault && (
                                    <span className="text-[10px] sm:text-xs bg-emerald/10 text-emerald px-2.5 py-1 rounded-sm flex items-center gap-1 font-medium">
                                        <MapPin size={12} className="w-3 h-3" /> Default
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                <button aria-label="Edit" className="p-1.5 text-muted hover:text-charcoal hover:bg-gray-100 rounded-md transition-colors">
                                    <Edit2 size={16} className="w-[14px] h-[14px] sm:w-4 sm:h-4" />
                                </button>
                                <button aria-label="Delete" className="p-1.5 text-muted hover:text-error hover:bg-red-50 rounded-md transition-colors">
                                    <Trash2 size={16} className="w-[14px] h-[14px] sm:w-4 sm:h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mb-5 sm:mb-6">
                            <h3 className="text-sm sm:text-base font-semibold text-charcoal mb-2">{address.fullName}</h3>
                            <p className="text-xs sm:text-sm text-muted leading-relaxed">
                                {address.addressLine1}
                                {address.addressLine2 && <><br />{address.addressLine2}</>}
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
                                onClick={() => {
                                    setAddresses(addresses.map(a => ({
                                        ...a,
                                        isDefault: a.id === address.id
                                    })));
                                }}
                            >
                                Set as Default
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
