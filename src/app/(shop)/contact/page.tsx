"use client";

import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CONTACT_INFO } from "@/lib/constants";

export default function ContactPage() {
    return (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
            <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
                <h1 className="text-3xl lg:text-4xl font-semibold text-charcoal mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    We'd love to hear from you
                </h1>
                <p className="text-muted leading-relaxed">
                    Whether you have a question about our heritage collections, hallmarking process, or need assistance with your order, our concierge team is here to help.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Contact Info */}
                <div>
                    <h2 className="text-2xl font-semibold text-charcoal mb-8" style={{ fontFamily: "var(--font-heading)" }}>
                        Get in Touch
                    </h2>

                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald/10 flex items-center justify-center flex-shrink-0 text-emerald">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-charcoal mb-1">Phone / WhatsApp</h3>
                                <p className="text-muted text-sm mb-2">Mon-Sat from 10am to 7pm IST.</p>
                                <a href={`tel:${CONTACT_INFO.phone}`} className="text-emerald font-medium hover:underline">
                                    {CONTACT_INFO.phone}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald/10 flex items-center justify-center flex-shrink-0 text-emerald">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-charcoal mb-1">Email us</h3>
                                <p className="text-muted text-sm mb-2">Our team will respond within 24 hours.</p>
                                <a href={`mailto:${CONTACT_INFO.email}`} className="text-emerald font-medium hover:underline">
                                    {CONTACT_INFO.email}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald/10 flex items-center justify-center flex-shrink-0 text-emerald">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-charcoal mb-1">Our Flagship Store</h3>
                                <p className="text-muted text-sm leading-relaxed">
                                    Silvaniya Jewellers<br />
                                    124 Heritage Gold Souk, C.G. Road<br />
                                    Ahmedabad, Gujarat 380009<br />
                                    India
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 bg-cream p-6 rounded-xl border border-border">
                        <h4 className="font-semibold text-charcoal mb-2">Corporate Orders & Gifting</h4>
                        <p className="text-sm text-muted mb-4">
                            For bulk orders, wedding gifting, or corporate associations, please write to our specialized team at:
                        </p>
                        <a href="mailto:corporate@silvaniya.com" className="text-charcoal font-medium hover:text-emerald transition-colors inline-flex items-center gap-1.5 text-sm">
                            corporate@silvaniya.com <Mail size={14} />
                        </a>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-border shadow-sm">
                    <h2 className="text-2xl font-semibold text-charcoal mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                        Send us a Message
                    </h2>
                    <p className="text-sm text-muted mb-8">Fill out the form below and we'll get back to you shortly.</p>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Input label="First Name" placeholder="John" />
                            <Input label="Last Name" placeholder="Doe" />
                        </div>

                        <Input label="Email Address" type="email" placeholder="john@example.com" />

                        <Input label="Phone Number (Optional)" type="tel" placeholder="+91 98765 43210" />

                        <div>
                            <label className="label-uppercase block mb-2 text-charcoal" htmlFor="subject">Subject</label>
                            <select
                                id="subject"
                                className="w-full h-11 px-4 text-sm rounded-md border border-border text-charcoal focus:outline-none focus:border-charcoal focus:ring-1 focus:ring-charcoal bg-white"
                            >
                                <option value="">Select a subject...</option>
                                <option value="order">Order Status / Tracking</option>
                                <option value="return">Returns & Exchanges</option>
                                <option value="product">Product Customization</option>
                                <option value="other">Other Inquiry</option>
                            </select>
                        </div>

                        <div>
                            <label className="label-uppercase block mb-2 text-charcoal" htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                rows={4}
                                className="w-full px-4 py-3 text-sm rounded-md border border-border text-charcoal placeholder:text-muted-light focus:outline-none focus:border-charcoal focus:ring-1 focus:ring-charcoal resize-none"
                                placeholder="How can we help you today?"
                            ></textarea>
                        </div>

                        <Button variant="primary" size="lg" className="w-full" type="submit">
                            Send Message
                            <Send size={18} />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
