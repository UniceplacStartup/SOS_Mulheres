import { Request, Response, NextFunction } from 'express';
import { contactService } from '../../application/services/ContactService';
import { createContactSchema } from '../../application/dtos';

export class ContactController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.query.userId as string) || 'usr-default-001';
      const contacts = await contactService.listUserContacts(userId);
      return res.status(200).json({
        success: true,
        data: contacts,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.query.userId as string) || 'usr-default-001';
      const validated = createContactSchema.parse(req.body);
      const contact = await contactService.addContact(userId, validated);
      return res.status(201).json({
        success: true,
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req.query.userId as string) || 'usr-default-001';
      await contactService.removeContact(id, userId);
      return res.status(200).json({
        success: true,
        message: 'Contato removido com sucesso.',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const contactController = new ContactController();
