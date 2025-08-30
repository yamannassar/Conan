"use client";
import { useEffect } from "react";

export default function PWARegister() {
    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js").catch(err => {
                console.error("Service Worker registration failed:", err);
            });
        }
    }, []);
    return null;
}
