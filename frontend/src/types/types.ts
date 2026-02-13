export interface Contact {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    createdAt: string;
}

export interface CreateContactDTO {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        totalPages: number;
        limit: number;
    };
}
