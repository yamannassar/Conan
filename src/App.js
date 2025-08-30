import React from "react";
import ProgressRing from "./components/ProgressRing";
import StatsCard from "./components/StatsCard";
import ContentCard from "./components/ContentCard";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-gray-100 p-4">
                {/* هنا تحطي كل المكونات اللي عندك */}
                <StatsCard />
                <ContentCard />
                <ProgressRing />
            </div>
        </ThemeProvider>
    );
}

export default App;
