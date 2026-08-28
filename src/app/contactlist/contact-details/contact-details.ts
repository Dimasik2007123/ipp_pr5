import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contact } from '../contact';
import { ServiceAPI } from '../contact.service';

@Component({
  selector: 'contact-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-details.html',
  styleUrls: ['./contact-details.css'],
})
export class ContactDetailsComponent {
  @Input()
  contact: Contact | null = null;

  @Input()
  createHandler: Function = () => {};

  @Input()
  updateHandler: Function = () => {};

  @Input()
  deleteHandler: Function = () => {};

  constructor(private contactService: ServiceAPI) {}

  createContact(contact: Contact) {
    if (!contact) return;
    this.contactService.createContact(contact).then((newContact: Contact | void) => {
      if (newContact) {
        this.createHandler(newContact);
      }
    });
  }

  updateContact(contact: Contact): void {
    if (!contact || !contact._id) return;
    this.contactService.updateContact(contact).then((updatedContact: Contact | void) => {
      if (updatedContact) {
        this.updateHandler(updatedContact);
      }
    });
  }

  deleteContact(contactId: string): void {
    if (!contactId) return;
    this.contactService.deleteContact(contactId).then(() => {
      this.deleteHandler(contactId);
    });
  }
}
