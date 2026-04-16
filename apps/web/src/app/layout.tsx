import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dado Triple - Real-time Game",
  description: "Play Dado Triple with your friends in real-time!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Barra de navegación del dashboard administrativo */}
        <nav className="bg-[#0f172a] border-b border-slate-800 px-6 py-3 flex items-center gap-6 sticky top-0 z-50">
          <span className="text-white font-bold text-lg tracking-tight mr-4">
            🎲 Dado Triple
          </span>
          <NavLink href="/">Consola</NavLink>
          <NavLink href="/dashboard">Jugadores</NavLink>
          <NavLink href="/historial">Historial</NavLink>
        </nav>

        {children}
      </body>
    </html>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
    >
      {children}
    </Link>
  );
}
