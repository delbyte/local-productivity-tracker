import { getAllData, importAllData } from './storage';

/**
 * Export all application data as a JSON file downloaded to the user's machine.
 */
export function exportData(): void {
    const data = getAllData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `productivity-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Import data from a JSON file. Returns a promise that resolves when complete.
 */
export function importData(): Promise<boolean> {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return resolve(false);

            try {
                const text = await file.text();
                const data = JSON.parse(text);

                if (!data.tasks || !data.settings) {
                    throw new Error('Invalid backup file format');
                }

                importAllData(data);
                resolve(true);
            } catch {
                resolve(false);
            }
        };

        input.oncancel = () => resolve(false);
        input.click();
    });
}
