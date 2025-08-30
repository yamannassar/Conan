import { StorageService } from "./storage";

export class BackupService {
    exportData() {
        if (typeof window === "undefined") return;

        const data = {
            version: "1.0.0",
            exportDate: new Date().toISOString(),
            progress: StorageService.getUserProgress(),
            settings: StorageService.getSettings()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `conan-tracker-backup-${Date.now()}.json`;
        a.click();

        URL.revokeObjectURL(url);
    }

    async importData(file: File) {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data && data.version === "1.0.0" && data.progress) {
            StorageService.mergeProgress(data.progress);
            if (data.settings) StorageService.saveSettings(data.settings);
            return true;
        }
        return false;
    }
}
