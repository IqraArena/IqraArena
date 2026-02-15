/**
 * Reading Progress Service
 * Tracks reading progress locally and syncs with Supabase.
 */
export class ReadingProgressService {
    private readPages: Map<string, Set<number>> = new Map();

    /**
     * Mark a page as read for a specific book
     */
    markPageRead(bookId: string, pageNumber: number): void {
        if (!this.readPages.has(bookId)) {
            this.readPages.set(bookId, new Set());
        }
        this.readPages.get(bookId)!.add(pageNumber);
    }

    /**
     * Check if a page has been read in this session
     */
    isPageRead(bookId: string, pageNumber: number): boolean {
        return this.readPages.get(bookId)?.has(pageNumber) ?? false;
    }

    /**
     * Get total pages read for a book in this session
     */
    getPagesReadCount(bookId: string): number {
        return this.readPages.get(bookId)?.size ?? 0;
    }

    /**
     * Reset progress for a book
     */
    resetBook(bookId: string): void {
        this.readPages.delete(bookId);
    }
}

export const readingProgressService = new ReadingProgressService();
