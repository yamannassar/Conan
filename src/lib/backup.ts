// src/lib/backup.ts
export class BackupService {
    static exportData(progress: any) {
        const data = {
            version: "2.0.0",
            exportDate: new Date().toISOString(),
            progress
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `conan-tracker-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    static async importData(file: File): Promise<any> {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            if (data?.version && data?.progress) {
                return data.progress;
            }
            throw new Error("Invalid backup file");
        } catch (error) {
            console.error("Import failed:", error);
            return null;
        }
    }
}

export const { exportData, importData } = BackupService;