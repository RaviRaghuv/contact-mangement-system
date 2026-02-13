import { Router } from 'express';
import * as contactController from '../controllers/contacts.controller.js';

const router = Router();

router.post('/', contactController.createContact);
router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getContactById);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

export default router;
