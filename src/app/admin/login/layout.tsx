import React from "react";
import { Inter } from "next/font/google"
import "../../globals.css"

const inter = Inter({ subsets: ["latin"] })

// Layout completamente independente para a página de login admin
// Substitui completamente o layout principal, incluindo as tags html e body
export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          {children}
        </div>
      </body>
    </html>
  );
} 