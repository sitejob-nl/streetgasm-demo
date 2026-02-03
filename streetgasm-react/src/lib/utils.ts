// Utility functions for StreetGasm Dashboard

/**
 * Format a date string to localized format
 */
export function formatDate(dateString: string | Date, options?: Intl.DateTimeFormatOptions): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', options ?? {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format a date to relative time ago format
 */
export function formatTimeAgo(dateString: string | Date): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return formatDate(date);
}

/**
 * Format currency in EUR
 */
export function formatCurrency(amount: number | string): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '€0.00';
    return new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR',
    }).format(num);
}

/**
 * Get initials from first and last name
 */
export function getInitials(firstName?: string, lastName?: string): string {
    return (
        (firstName?.[0] || '') + (lastName?.[0] || '')
    ).toUpperCase();
}

/**
 * Get status badge color class
 */
export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        'on-hold': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        pending: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
        completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
        waitlist: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return function executedFunction(...args: Parameters<T>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Generate a random ID
 */
export function generateId(): string {
    return crypto.randomUUID();
}

/**
 * Classnames utility (simple version of clsx/classnames)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}