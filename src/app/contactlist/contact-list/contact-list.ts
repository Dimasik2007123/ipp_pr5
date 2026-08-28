import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contact } from '../contact';
import { ServiceAPI } from '../contact.service';
import { ContactDetailsComponent } from '../contact-details/contact-details';

@Component({
  selector: 'contact-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ContactDetailsComponent],
  templateUrl: './contact-list.html',
  styleUrls: ['./contact-list.css'],
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  selectedContact: Contact | null = null;

  constructor(
    private contactService: ServiceAPI,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.contactService.getContacts().then((contacts: Contact[] | void) => {
      if (contacts) {
        this.contacts = contacts;
        this.cdr.detectChanges();
      }
    });
  }

  private getIndexOfContact(contactId: string): number {
    return this.contacts.findIndex((contact) => {
      return contact._id === contactId;
    });
  }

  selectContact(contact: Contact | null) {
    this.selectedContact = contact;
  }

  createNewContact() {
    const contact: Contact = {
      username: '',
      email: '',
      telephone: { mobile: '', home: '' },
    };
    this.selectContact(contact);
  }

  deleteContact = (contactId: string) => {
    const idx = this.getIndexOfContact(contactId);
    if (idx !== -1) {
      this.contacts.splice(idx, 1);
      this.selectContact(null);
    }
    return this.contacts;
  };

  addContact = (contact: Contact) => {
    this.contacts.push(contact);
    this.selectContact(contact);
    return this.contacts;
  };

  updateContact = (contact: Contact) => {
    const idx = this.getIndexOfContact(contact._id!);
    if (idx !== -1) {
      this.contacts[idx] = contact;
      this.selectContact(contact);
    }
    return this.contacts;
  };
}
