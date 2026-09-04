import React from 'react';
import { Lock, ShieldCheck, Camera } from 'lucide-react';

export default function FooterRedesign() {
  return (
    <footer className="w-full bg-[#EDECF7] text-[#2C2A40] font-sans px-6 sm:px-10 py-10 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Grid layout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 sm:gap-8">
          
          {/* Brand + Trust */}
          <div className="col-span-2 sm:col-span-1">
            <h2 className="font-serif text-xl text-[#1F1C33] mb-2">Ask My Moon</h2>
            <p className="text-sm text-[#5C5875] leading-relaxed mb-5">
              Personalized Vedic remedies, built with care.
            </p>
            <div className="flex flex-col gap-2.5">
              <span className="inline-flex items-center gap-2 text-sm text-[#4A3FCF]">
                <Lock className="w-4 h-4" /> Private and confidential
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-[#4A3FCF]">
                <ShieldCheck className="w-4 h-4" /> Verified astrologers
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-[#4A3FCF]">
                <ShieldCheck className="w-4 h-4" /> Secure payments
              </span>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-[#1F1C33] mb-3">Explore</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[#5C5875]">
              <li><a href="#" className="hover:text-[#4A3FCF] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#4A3FCF] transition-colors">Consultation</a></li>
              <li><a href="#" className="hover:text-[#4A3FCF] transition-colors">About</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-[#1F1C33] mb-3">Legal</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[#5C5875]">
              <li><a href="#" className="hover:text-[#4A3FCF] transition-colors">Terms and conditions</a></li>
              <li><a href="#" className="hover:text-[#4A3FCF] transition-colors">Privacy policy</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-[#1F1C33] mb-3">Follow</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[#5C5875]">
              <li className="inline-flex items-center gap-2">
                <Camera className="w-4 h-4" />
                <a href="#" className="hover:text-[#4A3FCF] transition-colors">@askmymoon</a>
              </li>
              <li className="inline-flex items-center gap-2">
                <Camera className="w-4 h-4" />
                <a href="#" className="hover:text-[#4A3FCF] transition-colors">@_13verse</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-[#D6D4E8] mt-8 pt-4 text-center">
          <p className="text-xs text-[#7A7690] tracking-wide">
            © 2026 Ask My Moon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
