import { Request, Response, NextFunction } from 'express';
import * as contactService from '../services/contacts.service.js';
import { contactSchema, partialContactSchema } from '../types/contact.types.js';

export const createContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = contactSchema.parse(req.body);
        const contact = await contactService.createContact(data);
        res.status(201).json(contact);
    } catch (error) {
        next(error);
    }
};

export const getAllContacts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string | undefined;

        const result = await contactService.getAllContacts(page, limit, search);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const getContactById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string);
        const contact = await contactService.getContactById(id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json(contact);
    } catch (error) {
        next(error);
    }
};

export const updateContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string);
        const data = partialContactSchema.parse(req.body);
        const contact = await contactService.updateContact(id, data);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json(contact);
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string);
        const contact = await contactService.deleteContact(id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        next(error);
    }
};
