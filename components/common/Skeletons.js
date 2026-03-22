// Reusable skeleton loader components for consistent loading states across the app

export function CardSkeleton({ className = '' }) {
    return (
        <div className={`rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse ${className}`} />
    );
}

export function TextSkeleton({ width = 'w-full', className = '' }) {
    return (
        <div className={`h-4 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse ${width} ${className}`} />
    );
}

export function EventCardSkeleton() {
    return (
        <div className="glass-panel border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden">
            <div className="h-48 bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="p-6 space-y-3">
                <div className="h-5 w-3/4 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-3 w-1/2 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="flex gap-2 pt-2">
                    <div className="flex-1 h-9 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    <div className="flex-1 h-9 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                </div>
            </div>
        </div>
    );
}

export function BlogCardSkeleton() {
    return (
        <div className="glass-panel border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden">
            <div className="h-52 bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="p-6 space-y-3">
                <div className="h-5 w-4/5 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-3 w-2/3 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-3 w-1/4 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse mt-4" />
            </div>
        </div>
    );
}

export function MessageRowSkeleton() {
    return (
        <div className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/5">
            <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-3 w-2/3 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>
            <div className="h-3 w-12 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="admin-glass-card p-6 space-y-4">
            <div className="flex justify-between">
                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="w-12 h-5 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>
            <div className="space-y-2">
                <div className="h-3 w-1/2 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-10 w-1/3 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>
        </div>
    );
}

export function TableRowSkeleton({ cols = 4 }) {
    const widths = ['w-3/5', 'w-4/5', 'w-2/3', 'w-1/2', 'w-3/4'];
    return (
        <tr>
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <div className={`h-4 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse ${widths[i % widths.length]}`} />
                </td>
            ))}
        </tr>
    );
}
