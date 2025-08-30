import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWARegister from "../components/PWARegister"; // تأكد من مسار الملف

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Conan Tracker",
    description: "Track your Detective Conan progress",
    // رابط manifest
    manifest: "/manifest.json",
    themeColor: "#3B82F6",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full">
        <head>
            {/* أضف رابط manifest */}
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#3B82F6" />
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 dark:bg-gray-900`}
        >
        {/* تسجيل Service Worker */}
        <PWARegister />
        {children}
        </body>
        </html>
    );
}
