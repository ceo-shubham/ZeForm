"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { 
  FileText, 
  ShieldCheck, 
  PlusCircle, 
  LogOut, 
  LogIn, 
  LayoutDashboard,
  ExternalLink 
} from "lucide-react";
import { ADMIN_EMAIL } from "@/lib/utils";

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isMasterAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center font-black text-2xl tracking-tight text-slate-900">
            <span>ZeForm</span>
            <span className="text-indigo-600 text-3xl font-extrabold leading-none ml-0.5 animate-pulse">*</span>
          </div>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          {status === "authenticated" ? (
            <>
              {/* Regular Dashboard Link */}
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>My Forms</span>
              </Link>

              {/* Master Admin Link (Exclusive to ceo.shubhampathak@gmail.com) */}
              {isMasterAdmin && (
                <Link
                  href="/dashboard/admin"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-all shadow-sm"
                  title="Master Administrator Dashboard"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Admin Panel</span>
                  <span className="hidden md:inline px-1.5 py-0.2 bg-amber-500 text-white rounded text-[10px] uppercase font-extrabold">
                    CEO
                  </span>
                </Link>
              )}

              {/* Create Form Quick CTA */}
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Form</span>
              </Link>

              {/* User Dropdown / Sign Out */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="hidden lg:block text-right">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {user?.name || "User"}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                    {user?.email}
                  </div>
                </div>

                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-8 h-8 rounded-full border border-slate-300 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                    {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/signin"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In with Google</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
