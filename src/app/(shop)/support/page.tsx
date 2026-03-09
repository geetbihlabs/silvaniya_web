"use client";

import React, { useState } from "react";
import { Search, Truck, RotateCcw, Sparkles, Ruler, Store, MessageSquare, Mail, Phone, ChevronDown, X, Check } from "lucide-react";

const faqs = [
    {
        id: 1,
        question: "How do I track my silver order?",
        answer: "Once your order is dispatched, you will receive an email with a tracking number. You can use this on our website or the carrier's portal to see live updates.",
    },
    {
        id: 2,
        question: "Is Silvaniya jewellery sterling silver?",
        answer: "Yes, all Silvaniya jewellery is crafted from 925 Sterling Silver, certified and hallmarked for purity. Each piece comes with an authenticity certificate.",
    },
    {
        id: 3,
        question: "What is your holiday return policy?",
        answer: "We offer an extended 60-day return window during the festive season (October–January). Items must be in their original condition with tags attached.",
    },
    {
        id: 4,
        question: "Do you offer international shipping?",
        answer: "Yes, we ship to over 30 countries worldwide. International shipping rates and delivery timelines are calculated at checkout based on your location.",
    },
];

const supportTopics = [
    {
        icon: <Truck size={26} strokeWidth={1.5} className="text-[#107c6f]" />,
        title: "Orders & Shipping",
        desc: "Track your delivery or view shipping methods.",
    },
    {
        icon: <RotateCcw size={26} strokeWidth={1.5} className="text-[#107c6f]" />,
        title: "Returns & Refunds",
        desc: "Our 30-day return policy and process guide.",
    },
    {
        icon: <Sparkles size={26} strokeWidth={1.5} className="text-[#107c6f]" />,
        title: "Jewellery Care",
        desc: "How to keep your silver pieces shining forever.",
    },
    {
        icon: <Ruler size={26} strokeWidth={1.5} className="text-[#107c6f]" />,
        title: "Sizing Guide",
        desc: "Find the perfect fit for your rings and bracelets.",
    },
    {
        icon: <Store size={26} strokeWidth={1.5} className="text-[#107c6f]" />,
        title: "Wholesale",
        desc: "Partner with Silvaniya for your boutique.",
    },
];

export default function ContactPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(1);
    const [emailOpen, setEmailOpen] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [callOpen, setCallOpen] = useState(false);
    const [callSent, setCallSent] = useState(false);

    return (
        <div className="bg-white">

            {/* ======== HERO SECTION ======== */}
            <section className="bg-white pt-16 pb-14 px-4">
                <div className="max-w-[680px] mx-auto text-center">
                    <h1
                        className="text-[44px] sm:text-[52px] font-bold text-charcoal mb-4 leading-tight"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        How can we help you?
                    </h1>
                    <p className="text-[14px] text-muted leading-relaxed mb-8">
                        Explore our guides and FAQs to ensure your Silvaniya experience is as timeless as our jewellery.
                    </p>

                    {/* Search Bar */}
                    <div className="flex items-center rounded-xl border border-[#e0e0db] bg-white shadow-sm overflow-hidden max-w-[580px] mx-auto">
                        <Search size={17} strokeWidth={1.5} className="text-gray-400 ml-4 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search for shipping, returns, ring sizing..."
                            className="flex-1 h-12 px-3 text-[13px] text-charcoal placeholder:text-gray-400 focus:outline-none bg-transparent"
                        />
                        <button className="bg-charcoal hover:bg-charcoal/90 text-white text-[13px] font-semibold px-6 h-12 shrink-0 transition-colors">
                            Search
                        </button>
                    </div>
                </div>
            </section>

            {/* ======== SUPPORT TOPICS ======== */}
            <section className="bg-[#f5f5f3] py-14 px-4">
                <div className="max-w-[1100px] mx-auto">
                    <h2
                        className="text-[28px] font-bold text-charcoal mb-8"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Support Topics
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {supportTopics.map((topic) => (
                            <div
                                key={topic.title}
                                className="bg-white rounded-xl border border-[#e8e8e4] px-5 py-5 cursor-pointer hover:border-[#107c6f]/40 hover:shadow-sm transition-all duration-200"
                            >
                                <div className="mb-3">{topic.icon}</div>
                                <h3 className="text-[13px] font-bold text-charcoal mb-1.5 leading-snug">{topic.title}</h3>
                                <p className="text-[12px] text-muted leading-relaxed">{topic.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======== FAQ SECTION ======== */}
            <section className="bg-[#eeeef0] py-14 px-4">
                <div className="max-w-[720px] mx-auto">
                    <h2
                        className="text-[32px] sm:text-[36px] font-bold text-charcoal text-center mb-10"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                        {faqs.map((faq) => (
                            <div
                                key={faq.id}
                                className="bg-white rounded-xl border border-[#e0e0db] overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                                >
                                    <span className="text-[14px] font-semibold text-charcoal pr-4">
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        size={18}
                                        strokeWidth={2}
                                        className={`text-muted shrink-0 transition-transform duration-200 ${openFaq === faq.id ? "rotate-180" : ""}`}
                                    />
                                </button>
                                {openFaq === faq.id && (
                                    <div className="px-6 pb-5">
                                        <p className="text-[13px] text-muted leading-relaxed">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======== STILL NEED ASSISTANCE ======== */}
            <section className="bg-white py-16 px-4">
                <div className="max-w-[900px] mx-auto">
                    <h2
                        className="text-[32px] sm:text-[36px] font-bold text-charcoal text-center mb-10"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Still need assistance?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {/* Live Chat */}
                        <div className="border border-[#e8e8e4] rounded-xl px-6 py-7 flex flex-col items-center text-center relative">
                            <div className="absolute top-4 right-4 bg-[#f0f9f7] text-[#107c6f] text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-[#107c6f]/20">
                                ONLINE NOW
                            </div>
                            <MessageSquare size={28} strokeWidth={1.5} className="text-[#107c6f] mb-4" />
                            <h3 className="text-[16px] font-bold text-charcoal mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                                Live Chat
                            </h3>
                            <p className="text-[12px] text-muted leading-relaxed mb-5">
                                Speak with our jewellery experts for instant styling and order help.
                            </p>
                            <button className="w-full h-11 bg-[#107c6f] hover:bg-[#0d6b60] text-white text-[13px] font-semibold rounded-lg transition-colors duration-200">
                                Start Chat
                            </button>
                        </div>

                        {/* Email Us */}
                        <div className="border border-[#e8e8e4] rounded-xl px-6 py-7 flex flex-col items-center text-center">
                            <Mail size={28} strokeWidth={1.5} className="text-charcoal mb-4" />
                            <h3 className="text-[16px] font-bold text-charcoal mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                                Email Us
                            </h3>
                            <p className="text-[12px] text-muted leading-relaxed mb-5">
                                We&apos;ll get back to you within 24 hours. Ideal for custom inquiries.
                            </p>

                            {!emailOpen && !emailSent && (
                                <button
                                    onClick={() => setEmailOpen(true)}
                                    className="w-full h-11 bg-white border border-charcoal hover:bg-gray-50 text-charcoal text-[13px] font-semibold rounded-lg transition-colors duration-200"
                                >
                                    Send Message
                                </button>
                            )}

                            {emailOpen && !emailSent && (
                                <div className="w-full text-left space-y-3 mt-1">
                                    <input type="text" placeholder="Your Name" className="w-full h-10 px-3 text-[13px] rounded-lg border border-[#d8d8d2] focus:outline-none focus:border-charcoal" />
                                    <input type="email" placeholder="Email Address" className="w-full h-10 px-3 text-[13px] rounded-lg border border-[#d8d8d2] focus:outline-none focus:border-charcoal" />
                                    <textarea rows={3} placeholder="Your message..." className="w-full px-3 py-2 text-[13px] rounded-lg border border-[#d8d8d2] focus:outline-none focus:border-charcoal resize-none" />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setEmailSent(true); setEmailOpen(false); }}
                                            className="flex-1 h-10 bg-charcoal hover:bg-charcoal/90 text-white text-[13px] font-semibold rounded-lg transition-colors"
                                        >
                                            Send
                                        </button>
                                        <button onClick={() => setEmailOpen(false)} className="w-10 h-10 border border-[#d8d8d2] rounded-lg flex items-center justify-center hover:bg-gray-50 text-muted transition-colors">
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {emailSent && (
                                <div className="flex flex-col items-center gap-2 mt-1">
                                    <div className="w-10 h-10 rounded-full bg-[#f0f9f7] flex items-center justify-center">
                                        <Check size={18} strokeWidth={2.5} className="text-[#107c6f]" />
                                    </div>
                                    <p className="text-[13px] font-semibold text-charcoal">Message sent!</p>
                                    <p className="text-[11px] text-muted">We&apos;ll reply within 24 hours.</p>
                                </div>
                            )}
                        </div>

                        {/* Call Us */}
                        <div className="border border-[#e8e8e4] rounded-xl px-6 py-7 flex flex-col items-center text-center">
                            <Phone size={28} strokeWidth={1.5} className="text-charcoal mb-4" />
                            <h3 className="text-[16px] font-bold text-charcoal mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                                Call Us
                            </h3>
                            <p className="text-[12px] text-muted leading-relaxed mb-5">
                                Available Mon-Fri, 9am - 6pm. Call us at +1 (800) SILVAN-YA
                            </p>

                            {!callOpen && !callSent && (
                                <button
                                    onClick={() => setCallOpen(true)}
                                    className="w-full h-11 bg-white border border-charcoal hover:bg-gray-50 text-charcoal text-[13px] font-semibold rounded-lg transition-colors duration-200"
                                >
                                    Request Call
                                </button>
                            )}

                            {callOpen && !callSent && (
                                <div className="w-full text-left space-y-3 mt-1">
                                    <input type="text" placeholder="Your Name" className="w-full h-10 px-3 text-[13px] rounded-lg border border-[#d8d8d2] focus:outline-none focus:border-charcoal" />
                                    <input type="tel" placeholder="Phone / WhatsApp Number" className="w-full h-10 px-3 text-[13px] rounded-lg border border-[#d8d8d2] focus:outline-none focus:border-charcoal" />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setCallSent(true); setCallOpen(false); }}
                                            className="flex-1 h-10 bg-charcoal hover:bg-charcoal/90 text-white text-[13px] font-semibold rounded-lg transition-colors"
                                        >
                                            Request
                                        </button>
                                        <button onClick={() => setCallOpen(false)} className="w-10 h-10 border border-[#d8d8d2] rounded-lg flex items-center justify-center hover:bg-gray-50 text-muted transition-colors">
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {callSent && (
                                <div className="flex flex-col items-center gap-2 mt-1">
                                    <div className="w-10 h-10 rounded-full bg-[#f0f9f7] flex items-center justify-center">
                                        <Check size={18} strokeWidth={2.5} className="text-[#107c6f]" />
                                    </div>
                                    <p className="text-[13px] font-semibold text-charcoal">Request received!</p>
                                    <p className="text-[11px] text-muted">We&apos;ll call you within 24 hours.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
