import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { contactsApi } from '../api/api';
import toast from 'react-hot-toast';
import AddContactModal from '../components/AddContactModal';
import ConfirmDialog from '../components/ConfirmDialog';
import {
    MagnifyingGlassIcon,
    PlusIcon,
} from '../components/Icons';
import { Contact } from '../types/types';
import companyIcon from '../assets/company-icon.png';
import totalContactsIcon from '../assets/total-contacts-icon.png';

export default function ContactsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteContactId, setDeleteContactId] = useState<number | null>(null);

    const queryClient = useQueryClient();

    // Debounced search
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Reset page when search changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearchTerm]);

    // Fetch contacts
    const { data: response, isLoading, error } = useQuery({
        queryKey: ['contacts', page, debouncedSearchTerm],
        queryFn: () => contactsApi.getContacts(page, 10, debouncedSearchTerm || undefined),
        placeholderData: keepPreviousData,
    });

    const contacts = response?.data;
    const meta = response?.meta;

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: contactsApi.deleteContact,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
            toast.success('Contact deleted successfully!');
            setDeleteContactId(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to delete contact');
        },
    });

    const handleDelete = (id: number) => {
        setDeleteContactId(id);
    };

    const confirmDelete = () => {
        if (deleteContactId) {
            deleteMutation.mutate(deleteContactId);
        }
    };

    // Derived stats
    const totalContacts = meta?.total || 0;
    const uniqueCompanies = new Set(contacts?.map(c => c.company).filter(Boolean)).size;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-blue-600 via-primary-500 to-violet-500 pb-32 pt-12 px-4 sm:px-6 lg:px-8 shadow-lg relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">
                            Contacts Dashboard
                        </h1>
                        <p className="mt-2 text-blue-100 text-lg">
                            Manage and organize your saved contacts
                        </p>
                    </div>

                    {/* Stats Cards in Header */}
                    <div className="flex flex-wrap gap-4">
                        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-4 flex items-center gap-4 min-w-[180px]">
                            <div className="p-3 bg-blue-500/30 rounded-lg text-white">
                                <img src={totalContactsIcon} alt="Total Contacts" className="w-6 h-6 object-contain" />
                            </div>
                            <div>
                                <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">Total Contacts</p>
                                <p className="text-2xl font-bold text-white">{totalContacts}</p>
                            </div>
                        </div>

                        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-4 flex items-center gap-4 min-w-[180px]">
                            <div className="p-3 bg-violet-500/30 rounded-lg text-white">
                                <img src={companyIcon} alt="Companies" className="w-6 h-6 object-contain" />
                            </div>
                            <div>
                                <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">Companies</p>
                                <p className="text-2xl font-bold text-white">{uniqueCompanies}</p>
                            </div>
                        </div>

                        {/* User Avatar */}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
                {/* Action Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Search */}
                    <div className="relative w-full sm:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border-none rounded-lg leading-5 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm text-gray-700"
                            placeholder="Search by name or company..."
                        />
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-lg shadow-md text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add Contact
                    </button>
                </div>

                {/* Main Content Card */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 min-h-[500px] flex flex-col">
                    {/* Table Header */}
                    <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-3">Name</div>
                        <div className="col-span-3">Email</div>
                        <div className="col-span-2">Company</div>
                        <div className="col-span-2">Phone</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="flex-1 flex items-center justify-center text-center p-8">
                            <div>
                                <p className="text-red-500 font-medium text-lg">Unable to load contacts</p>
                                <p className="text-gray-400 text-sm mt-1">{(error as any).message}</p>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !error && contacts?.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                            <div className="w-48 h-48 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                <span className="text-6xl">📇</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {searchTerm ? 'No contacts found' : 'No contacts yet'}
                            </h3>
                            <p className="text-gray-500 max-w-sm mx-auto">
                                {searchTerm
                                    ? `We couldn't find any contacts matching "${searchTerm}". Try different keywords.`
                                    : 'Get started by creating your first contact using the "Add Contact" button above.'}
                            </p>
                        </div>
                    )}

                    {/* Contact List */}
                    {!isLoading && !error && contacts && contacts.length > 0 && (
                        <div className="divide-y divide-gray-100">
                            {contacts.map((contact: Contact) => (
                                <div
                                    key={contact.id}
                                    className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50 transition-colors duration-150 group"
                                >
                                    <div className="col-span-3 font-semibold text-gray-900 truncate">
                                        {contact.name}
                                    </div>
                                    <div className="col-span-3 text-gray-600 truncate text-sm">
                                        {contact.email}
                                    </div>
                                    <div className="col-span-2 text-gray-900 font-medium truncate text-sm">
                                        {contact.company || '-'}
                                    </div>
                                    <div className="col-span-2 text-gray-500 truncate text-sm">
                                        {contact.phone}
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <button
                                            onClick={() => handleDelete(contact.id)}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {!isLoading && !error && meta && meta.totalPages > 1 && (
                        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50/50">
                            <div className="text-sm text-gray-500">
                                Showing <span className="font-medium">{(meta.page - 1) * meta.limit + 1}</span> to <span className="font-medium">{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="font-medium">{meta.total}</span> results
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                    disabled={page === meta.totalPages}
                                    className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center text-gray-400 text-sm pb-8">
                    &copy; {new Date().getFullYear()} Contact Management System
                </div>
            </div>

            {/* Modals */}
            <AddContactModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <ConfirmDialog
                isOpen={deleteContactId !== null}
                onClose={() => setDeleteContactId(null)}
                onConfirm={confirmDelete}
                title="Delete Contact"
                message="Are you sure you want to delete this contact? This action cannot be undone."
                confirmText="Delete"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
