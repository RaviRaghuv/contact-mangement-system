import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '../api/api';
import toast from 'react-hot-toast';
import { XMarkIcon } from './Icons';

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
    email: z
        .string()
        .email('Invalid email format')
        .max(255, 'Email is too long')
        .optional()
        .or(z.literal('')),
    phone: z.string().max(50, 'Phone number is too long').optional().or(z.literal('')),
    company: z.string().max(255, 'Company name is too long').optional().or(z.literal('')),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface AddContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddContactModal({ isOpen, onClose }: AddContactModalProps) {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const createMutation = useMutation({
        mutationFn: contactsApi.createContact,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
            toast.success('Contact added successfully!');
            reset();
            onClose();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to add contact');
        },
    });

    const onSubmit = (data: ContactFormData) => {
        createMutation.mutate(data);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-8 text-left align-middle shadow-2xl transition-all border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-xl font-semibold leading-6 text-gray-900"
                                    >
                                        Add New Contact
                                    </Dialog.Title>
                                    <button
                                        onClick={handleClose}
                                        className="text-gray-400 hover:text-gray-500 transition-colors rounded-full p-1 hover:bg-gray-100"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    {/* Name Field */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            {...register('name')}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 border placeholder-gray-400 transition-colors"
                                            placeholder="John Doe"
                                        />
                                        {errors.name && (
                                            <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.name.message}</p>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            {...register('email')}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 border placeholder-gray-400 transition-colors"
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && (
                                            <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.email.message}</p>
                                        )}
                                    </div>

                                    {/* Phone Field */}
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Phone
                                        </label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            {...register('phone')}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 border placeholder-gray-400 transition-colors"
                                            placeholder="+1 234 567 8900"
                                        />
                                        {errors.phone && (
                                            <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.phone.message}</p>
                                        )}
                                    </div>

                                    {/* Company Field */}
                                    <div>
                                        <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Company
                                        </label>
                                        <input
                                            id="company"
                                            type="text"
                                            {...register('company')}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 border placeholder-gray-400 transition-colors"
                                            placeholder="Acme Inc."
                                        />
                                        {errors.company && (
                                            <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.company.message}</p>
                                        )}
                                    </div>

                                    {/* Buttons */}
                                    <div className="mt-8 flex gap-3 justify-end pt-2">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
                                            onClick={handleClose}
                                            disabled={createMutation.isPending}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center rounded-lg border border-transparent bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200"
                                            disabled={createMutation.isPending}
                                        >
                                            {createMutation.isPending ? 'Adding...' : 'Add Contact'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
