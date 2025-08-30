"use client" // لازم لأنه ممكن يحتوي state أو effects مستقبلًا

import React from "react"

// تعريف نوع البيانات لكل حلقة
interface Episode {
    id: number
    number: number
    title: string
    description?: string
    duration_minutes?: number
    is_filler?: boolean
    is_important?: boolean
}

interface EpisodeListProps {
    episodes: Episode[]
}

const EpisodeList: React.FC<EpisodeListProps> = ({ episodes }) => {
    return (
        <div className="grid gap-4">
            {episodes.map((ep) => (
                <div
                    key={ep.id}
                    className="p-4 border rounded shadow hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <h3 className="text-lg font-bold">
                        #{ep.number} - {ep.title}
                    </h3>
                    {ep.description && <p className="text-sm mt-1">{ep.description}</p>}
                </div>
            ))}
        </div>
    )
}

export default EpisodeList
