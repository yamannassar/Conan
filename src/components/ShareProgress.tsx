"use client";
import React from "react";

interface Stats {
    episodes: { watched: number; total: number };
    chapters: { read: number; total: number };
    movies: { watched: number; total: number };
}

export default function ShareProgress({ stats }: { stats: Stats }) {
    const text = `I've watched ${stats.episodes.watched}/${stats.episodes.total} Detective Conan episodes! 🔍`;

    const shareTo = (platform: "twitter" | "facebook" | "reddit") => {
        const url = "https://conan-tracker.app";
        const map = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            reddit: `https://reddit.com/submit?title=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        };
        window.open(map[platform], "_blank", "noopener,noreferrer");
    };

    return (
        <div className="flex gap-2">
            <button onClick={() => shareTo("twitter")} className="px-3 py-2 rounded-lg bg-blue-500 text-white">Share Twitter</button>
            <button onClick={() => shareTo("facebook")} className="px-3 py-2 rounded-lg bg-blue-600 text-white">Facebook</button>
            <button onClick={() => shareTo("reddit")} className="px-3 py-2 rounded-lg bg-orange-600 text-white">Reddit</button>
        </div>
    );
}
