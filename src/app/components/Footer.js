import Link from 'next/link';
import { Camera, Globe } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-amber-900/10 bg-[#FAF6F0] mt-4">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                <div className="flex flex-col items-center gap-5 text-center">

                    {/* Brand line */}
                    <div className="space-y-1.5">
                        <p className="text-sm font-bold text-slate-800 tracking-tight">
                            Ask My Moon
                        </p>
                        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                            Personalized Vedic remedies, built with care.
                        </p>
                    </div>

                    {/* Social / credit links */}
                    <div className="flex items-center gap-5">
                        <a
                            href="https://www.instagram.com/_13verse/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-amber-800 transition-colors duration-150"
                        >
                            <Camera className="w-3.5 h-3.5" />
                            <span>@askmymoon</span>
                        </a>
                        <span className="w-1 h-1 rounded-full bg-amber-900/20" />
                        <a
                            href="https://www.askmymoon.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-amber-800 transition-colors duration-150"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            <span>askmymoon.com</span>
                        </a>
                    </div>

                    {/* Divider */}
                    <div className="w-12 h-px bg-amber-900/15" />

                    {/* Legal nav */}
                    <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                        <Link
                            href="/terms"
                            className="text-xs font-medium text-slate-500 hover:text-amber-800 transition-colors duration-150"
                        >
                            Terms & Conditions
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-xs font-medium text-slate-500 hover:text-amber-800 transition-colors duration-150"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/about"
                            className="text-xs font-medium text-slate-500 hover:text-amber-800 transition-colors duration-150"
                        >
                            About
                        </Link>
                    </nav>

                    {/* Copyright */}
                    <p className="text-[11px] text-slate-400 pt-1">
                        © {new Date().getFullYear()} Ask My Moon. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}