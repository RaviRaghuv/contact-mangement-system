import axios from 'axios';
import { Contact, CreateContactDTO, PaginatedResponse } from '../types/types';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const contactsApi = {
    // Get all contacts with optional search
    // Get all contacts with optional search and pagination
    getContacts: async (page = 1, limit = 10, search?: string): Promise<PaginatedResponse<Contact>> => {
        const params = { page, limit, ...(search ? { search } : {}) };
        const response = await api.get<PaginatedResponse<Contact>>('/contacts', { params });
        return response.data;
    },

    // Create a new contact
    createContact: async (data: CreateContactDTO): Promise<Contact> => {
        const response = await api.post<Contact>('/contacts', data);
        return response.data;
    },

    // Delete a contact
    deleteContact: async (id: number): Promise<void> => {
        await api.delete(`/contacts/${id}`);
    },
};
