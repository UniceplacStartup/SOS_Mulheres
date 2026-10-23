import { Router } from 'express';
import { contactController } from '../controllers/ContactController';

export const contactRoutes = Router();

contactRoutes.get('/', contactController.list.bind(contactController));
contactRoutes.post('/', contactController.create.bind(contactController));
contactRoutes.delete('/:id', contactController.delete.bind(contactController));
