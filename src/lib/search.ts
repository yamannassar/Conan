export interface BaseItem {
    id: number;
    number?: number;
    title: string;
    titleJapanese?: string;
    description?: string | null;
    airDate?: string | null;
    releaseDate?: string | null;
    duration?: number | null;
    isImportant?: boolean;
    isFiller?: boolean;
    tags?: string[];
    caseType?: "murder" | "theft" | "kidnapping" | "other";
}

export interface DateRange { start: string | null; end: string | null; }

export interface AdvancedSearchParams {
    query: string;
    dateRange: DateRange;
    tags: string[];
    arcFilter: string | null;
    characterFilter: string[];
    caseType: "all" | "murder" | "theft" | "kidnapping" | "other";
}

const normalize = (s: string) => s.toLowerCase().trim();

const fuzzyIncludes = (text: string, query: string) => {
    const t = normalize(text);
    const q = normalize(query);
    if (!q) return true;
    // بسيط: تحقّق contains + شوية تساهل
    return t.includes(q) || t.replace(/\s+/g, "").includes(q.replace(/\s+/g, ""));
};

const inDateRange = (dateStr: string | null | undefined, range: DateRange) => {
    if (!dateStr) return true;
    const d = new Date(dateStr).getTime();
    const start = range.start ? new Date(range.start).getTime() : -Infinity;
    const end = range.end ? new Date(range.end).getTime() : Infinity;
    return d >= start && d <= end;
};

export function filterAndRank<T extends BaseItem>(items: T[], params: AdvancedSearchParams): T[] {
    const { query, dateRange, tags, caseType } = params;

    // فلترة
    let filtered = items.filter(it => {
        const textBag = [it.title, it.titleJapanese || "", it.description || ""].join(" ");
        const dateField = it.airDate || it.releaseDate || null;

        const passText = fuzzyIncludes(textBag, query);
        const passDate = inDateRange(dateField, dateRange);
        const passTags = tags.length ? (it.tags?.some(t => tags.includes(t)) ?? false) : true;
        const passCase = caseType === "all" ? true : it.caseType === caseType;

        return passText && passDate && passTags && passCase;
    });

    // ترتيب بسيط: الأهم > غير الأهم، ثم حسب الرقم إن وجد
    filtered.sort((a, b) => {
        const impA = a.isImportant ? 1 : 0;
        const impB = b.isImportant ? 1 : 0;
        if (impA !== impB) return impB - impA;
        const numA = a.number ?? 0;
        const numB = b.number ?? 0;
        return numA - numB;
    });

    return filtered;
}
