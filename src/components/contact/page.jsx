'use client';

import React, { useState } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
});

export default function ContactSection() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ email: '', phone: '', message: '' });
    }, 4000);
  };

  return (
    <section
      id="contact"
      className="relative w-full py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-20 flex items-center justify-center overflow-hidden bg-[#07080b]"
    >
      {/* Ambient background glow & atmospheric depth */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full blur-[140px] opacity-25 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(59, 130, 246, 0.2) 40%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at center, transparent 30%, rgba(7, 8, 11, 0.8) 75%, #07080b 100%)',
          }}
        />
      </div>

      {/* Main Floating Glassmorphic Card */}
      <div
        className="relative z-10 w-full max-w-[1140px] rounded-[24px] sm:rounded-[36px] overflow-hidden p-6 sm:p-10 md:p-14 lg:p-16 transition-all duration-300 border border-white/20 border-t-white/35 border-l-white/25"
        style={{
          boxShadow:
            '0 30px 90px -15px rgba(0, 0, 0, 0.85), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Card Background: contact-bg.jpg + Frosted Glass Layer */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/contact-bg.jpg"
            alt=""
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Frosted Glass Blur & Tint overlay */}
          <div
            className="absolute inset-0 backdrop-blur-md"
            style={{
              background:
                'linear-gradient(135deg, rgba(8, 10, 15, 0.74) 0%, rgba(14, 17, 24, 0.82) 50%, rgba(6, 8, 12, 0.88) 100%)',
            }}
          />
          {/* Specular sheen reflection */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 15% 10%, rgba(255, 255, 255, 0.16) 0%, transparent 55%)',
            }}
          />
        </div>

        {/* Content container sitting above glass background */}
        <div className="relative z-10">
          {/* Top Bar: [CONTACT] --- Logo --- [MENU] */}
          <div className="flex items-center justify-between pb-8 sm:pb-12 md:pb-16 border-b border-transparent">
            {/* Left indicator */}
            <div className="text-[11px] sm:text-xs font-mono font-medium tracking-[0.22em] text-white/80">
              [CONTACT]
            </div>

            {/* Center Logo */}
            <a
              href="#home"
              className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
              aria-label="Home"
            >
              {/* Double-helix / chromosome cross icon */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              >
                <path
                  d="M7 4.5C7 7.5 17 9.5 17 12C17 14.5 7 16.5 7 19.5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M17 4.5C17 7.5 7 9.5 7 12C7 14.5 17 16.5 17 19.5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <circle cx="7" cy="4.5" r="1.6" fill="currentColor" />
                <circle cx="17" cy="4.5" r="1.6" fill="currentColor" />
                <circle cx="7" cy="19.5" r="1.6" fill="currentColor" />
                <circle cx="17" cy="19.5" r="1.6" fill="currentColor" />
              </svg>
            </a>

            {/* Right indicator */}
            <div className="text-[11px] sm:text-xs font-mono font-medium tracking-[0.22em] text-white/80">
              [MENU]
            </div>
          </div>

          {/* Content Body: Left Column + Right Column */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-8 sm:pt-12">
            {/* Left Column: Heading + Social Links */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <h2
                  className={`${playfair.className} text-4xl sm:text-5xl md:text-[56px] lg:text-[62px] leading-[1.08] tracking-[-0.025em] font-normal text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]`}
                >
                  Let’s Create Something
                  <br />
                  Extraordinary Together.
                </h2>
              </div>

              {/* Social Icons (LinkedIn, GitHub, Resume, Email) */}
              <div className="flex items-center gap-3.5 pt-12 sm:pt-20 lg:pt-28 text-white/80">
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/karan-malkar-75579a3b4?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center hover:text-white hover:scale-105 transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                {/* Resume PDF */}
                <a
                  href="/assets/9e46a5bd-0789-4900-a7dc-8ef7bb383ee6.pdf"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Resume PDF"
                  className="px-3.5 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center gap-1.5 text-xs font-semibold hover:text-white hover:scale-105 transition-all"
                >
                  <span>RESUME</span>
                  <span className="text-[10px]">↗</span>
                </a>

                {/* Email */}
                <a
                  href="mailto:karanmalkar6@gmail.com"
                  aria-label="Send Email"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center hover:text-white hover:scale-105 transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Column: Contact info columns + Underlined Inputs + Submit button */}
            <div className="lg:col-span-6 flex flex-col justify-between pt-2 lg:pt-0">
              {/* Info Columns: Contact Info & Address */}
              <div className="grid grid-cols-2 gap-6 sm:gap-10 pb-8 sm:pb-12 text-white">
                {/* Contact Info */}
                <div className={`${inter.className}`}>
                  <h3 className="font-semibold text-xs sm:text-[13px] text-neutral-200 mb-2 tracking-wide uppercase">
                    Contact Info
                  </h3>
                  <div className="text-[11px] sm:text-xs text-neutral-300 space-y-1 leading-relaxed">
                    <p>
                      <a href="tel:8767307610" className="hover:text-white transition-colors">
                        +91 87673 07610
                      </a>
                    </p>
                    <p>
                      <a href="mailto:karanmalkar6@gmail.com" className="hover:text-white transition-colors">
                        karanmalkar6@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className={`${inter.className}`}>
                  <h3 className="font-semibold text-xs sm:text-[13px] text-neutral-200 mb-2 tracking-wide uppercase">
                    Location & Availability
                  </h3>
                  <div className="text-[11px] sm:text-xs text-neutral-300 space-y-1 leading-relaxed">
                    <p>Pune, Maharashtra, India</p>
                    <p className="text-emerald-400 font-medium">Available for select projects</p>
                  </div>
                </div>
              </div>

              {/* Interactive Form with underlined inputs */}
              <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="name@yourname.com"
                    className={`${playfair.className} w-full bg-transparent border-b border-white/25 focus:border-white pb-2.5 pt-1 text-base sm:text-lg text-white placeholder:text-neutral-400 placeholder:italic focus:outline-none transition-colors`}
                  />
                </div>

                {/* Phone */}
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+91 1234567890"
                    className={`${playfair.className} w-full bg-transparent border-b border-white/25 focus:border-white pb-2.5 pt-1 text-base sm:text-lg text-white placeholder:text-neutral-400 placeholder:italic focus:outline-none transition-colors`}
                  />
                </div>

                {/* Message */}
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Enter your message here..."
                    className={`${playfair.className} w-full bg-transparent border-b border-white/25 focus:border-white pb-2.5 pt-1 text-base sm:text-lg text-white placeholder:text-neutral-400 placeholder:italic focus:outline-none transition-colors`}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-4">
                  {submitted ? (
                    <span
                      className={`${inter.className} text-xs font-medium text-emerald-400 animate-fadeIn`}
                    >
                      ✓ Message received. We’ll be in touch.
                    </span>
                  ) : (
                    <div />
                  )}

                  <button
                    type="submit"
                    className={`${inter.className} ml-auto bg-white hover:bg-neutral-100 text-[#0c0e12] px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.98] shadow-[0_4px_25px_rgba(255,255,255,0.2)] hover:shadow-[0_6px_30px_rgba(255,255,255,0.35)] cursor-pointer`}
                  >
                    Submit Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
