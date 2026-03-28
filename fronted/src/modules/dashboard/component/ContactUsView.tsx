"use client";

import React, { useState } from "react";

function ContactUsView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    console.log(formData)
    setSubmitted(true);
  };

  return (
    <div className="bg-hero relative min-h-screen flex items-center justify-center px-4 py-16">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 border border-[#daa3b0]/20 shadow-2xl">
        {/* ── Left Panel ── */}
        <div className="bg-white/40 backdrop-blur-sm px-10 py-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#daa3b0]/15">
          <div>
            <p className="text-[#daa3b0]/90 tracking-[0.3em] uppercase text-[10px] font-light mb-8">
              Choreographer
            </p>

            <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight text-[#daa3b0] mb-2">
              Let&apos;s <em className="italic text-[#e8bfc9]">Create</em>
              <br /> Together
            </h1>
            <p className="text-[#daa3b0]/90 text-sm italic mt-3 tracking-wide">
              Vicky Akku — Movement Artist
            </p>

            <div className="w-12 h-px bg-gradient-to-r from-[#daa3b0] to-transparent my-8" />

            <p className="text-[#777873] text-sm font-light leading-relaxed">
              Whether you&apos;re looking for choreography for your event,
              workshop, or collaboration — reach out. Every great performance
              begins with a conversation.
            </p>
          </div>

          {/* Contact Details */}
          <div className="mt-10 space-y-5">
            <div>
              <p className="text-[#977dae] text-[9px] tracking-[0.25em] uppercase mb-1">
                Email
              </p>
              <p className="text-[#777873] text-sm">
                vickyakku@choreography.com
              </p>
            </div>
            <div>
              <p className="text-[#977dae] text-[9px] tracking-[0.25em] uppercase mb-1">
                Phone
              </p>
              <p className="text-[#777873] text-sm">+91 98765 43210</p>
            </div>
            <div>
              <p className="text-[#977dae] text-[9px] tracking-[0.25em] uppercase mb-1">
                Location
              </p>
              <p className="text-[#777873] text-sm">Mumbai, India</p>
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="bg-black/30 backdrop-blur-md px-10 py-12">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <div className="w-14 h-14 rounded-full border border-[#daa3b0]/40 flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-[#daa3b0]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h2 className="text-[#daa3b0] font-serif text-2xl font-light">
                Message Received
              </h2>
              <p className="text-white/45 text-sm leading-relaxed">
                Thank you for reaching out. Vicky will get back to you shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", phone: "", message: "" });
                }}
                className="mt-4 text-[10px] tracking-[0.25em] uppercase text-[#daa3b0]/60 hover:text-[#daa3b0] transition-colors"
              >
                Send another
              </button>
            </div>
          ) : (
            <>
              <p className="text-white/50 tracking-[0.3em] uppercase text-[10px] font-light mb-8">
                Get in touch
              </p>

              <div className="space-y-5">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#fff]/50 text-[9px] tracking-[0.25em] uppercase">
                    Full Name <span className="text-[#daa3b0]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="bg-white/5 border border-white/10 focus:border-[#daa3b0]/50 text-white/80 placeholder:text-white/20 text-sm px-4 py-3 outline-none transition-colors rounded-sm"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#ffff]/50 text-[9px] tracking-[0.25em] uppercase">
                    Email <span className="text-[#daa3b0]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="bg-white/5 border border-white/10 focus:border-[#daa3b0]/50 text-white/80 placeholder:text-white/20 text-sm px-4 py-3 outline-none transition-colors rounded-sm"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#fff]/50 text-[9px] tracking-[0.25em] uppercase">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 00000 00000"
                    className="bg-white/5 border border-white/10 focus:border-[#daa3b0]/50 text-white/80 placeholder:text-white/20 text-sm px-4 py-3 outline-none transition-colors rounded-sm"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#ffff]/50 text-[9px] tracking-[0.25em] uppercase">
                    Message <span className="text-[#daa3b0]">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your event or vision..."
                    className="bg-white/5 border border-white/10 focus:border-[#daa3b0]/50 text-white/80 placeholder:text-white/20 text-sm px-4 py-3 outline-none transition-colors rounded-sm resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  className="w-full mt-2 bg-[#daa3b0]/10 hover:bg-[#daa3b0]/20 border border-[#daa3b0]/30 hover:border-[#daa3b0]/60 text-[#daa3b0] text-[11px] tracking-[0.3em] uppercase py-4 transition-all duration-300"
                >
                  Send Message
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactUsView;
