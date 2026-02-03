import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
    if (!date) return '-';
    try {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('en-US', options || {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return '-';
    }
}

export function formatCurrency(amount: number | string, currency: string = 'EUR'): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '€0.00';
    return new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency,
    }).format(num);
}

export function getInitials(name: string): string {
    if (!name) return '??';
    return name
        .split(' ')
        .map(part => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        active: 'var(--green)',
        pending: 'var(--gold-start)',
        'on-hold': '#f59e0b',
        cancelled: '#ef4444',
        completed: 'var(--green)',
        processing: 'var(--blue)',
        failed: '#ef4444',
        refunded: '#9ca3af',
    };
    return colors[status.toLowerCase()] || 'var(--text-muted)';
}

export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export function truncate(str: string, length: number): string {
    if (!str || str.length <= length) return str;
    return str.slice(0, length) + '...';
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
}
