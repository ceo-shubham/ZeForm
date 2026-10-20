"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "@/components/Providers";
import { 
  ShieldCheck, 
  PlusCircle, 
  LogOut, 
  LogIn, 
  LayoutDashboard
} from "lucide-react";
import { ADMIN_EMAIL } from "@/lib/utils";

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isMasterAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group">
          <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:opacity-90 transition-opacity">
            ZeForm<span className="text-indigo-600 font-bold text-2xl leading-none">.</span>
          </span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-5 text-sm text-slate-600">
            <Link href="/#features" className="hover:text-slate-900 transition-colors">
              Features
            </Link>
            <Link href="/#faq" className="hover:text-slate-900 transition-colors">
              FAQ
            </Link>
          </nav>

          {status === "authenticated" ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>My Forms</span>
              </Link>

              {isMasterAdmin && (
                <Link
                  href="/dashboard/admin"
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-md transition-colors"
                  title="Master Administrator"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Admin</span>
                </Link>
              )}

              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Form</span>
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-7 h-7 rounded-full border border-slate-300 object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-semibold flex items-center justify-center text-xs">
                    {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In with Google</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
