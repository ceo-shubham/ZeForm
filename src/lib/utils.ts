import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ceo.shubhampathak@gmail.com";
export const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || "zeform.zenstro.space";

export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export const RESERVED_SUBDOMAINS = [
  "www",
  "app",
  "admin",
  "api",
  "zeform",
  "mail",
  "auth",
  "static",
  "assets",
  "dashboard",
  "login",
  "signup",
  "zenstro",
];

export function isValidSubdomain(slug: string): { valid: boolean; error?: string } {
  if (!slug || slug.length < 3) {
    return { valid: false, error: "Subdomain must be at least 3 characters long" };
  }
  if (slug.length > 40) {
    return { valid: false, error: "Subdomain cannot exceed 40 characters" };
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { valid: false, error: "Only lowercase letters, numbers, and hyphens allowed" };
  }
  if (slug.startsWith("-") || slug.endsWith("-")) {
    return { valid: false, error: "Cannot start or end with a hyphen" };
  }
  if (RESERVED_SUBDOMAINS.includes(slug)) {
    return { valid: false, error: `"${slug}" is a reserved system subdomain` };
  }
  return { valid: true };
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
