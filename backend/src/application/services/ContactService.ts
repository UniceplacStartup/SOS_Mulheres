import { contactRepository } from '../../infrastructure/database/NeonRepository';
import { CreateContactInput } from '../dtos';
import { ValidationError, NotFoundError } from '../../core/errors/AppError';
import { EmergencyContact } from '../../core/entities';

export class ContactService {
  async listUserContacts(userId = 'usr-default-001'): Promise<EmergencyContact[]> {
    return contactRepository.findByUserId(userId);
  }

  async addContact(userId = 'usr-default-001', input: CreateContactInput): Promise<EmergencyContact> {
    const existing = await contactRepository.findByUserId(userId);
    if (existing.length >= 5) {
      throw new ValidationError('Limite máximo de 5 contatos de emergência atingido.');
    }

    return contactRepository.create({
      userId,
      name: input.name,
      relationship: input.relationship,
      phone: input.phone,
      telegramChatId: input.telegramChatId,
      email: input.email,
    });
  }

  async removeContact(id: string, userId = 'usr-default-001'): Promise<boolean> {
    const removed = await contactRepository.delete(id, userId);
    if (!removed) {
      throw new NotFoundError('Contato de emergência', id);
    }
    return true;
  }
}

export const contactService = new ContactService();
