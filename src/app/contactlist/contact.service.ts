import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from './contact';

@Injectable({
  providedIn: 'root',
})
export class ServiceAPI {
  private APIUrl = 'http://localhost:8080/api/contacts';

  constructor(private http: HttpClient) {}

  // создание нового контакта
  createContact(newContact: Contact): Promise<void | Contact> {
    return this.http
      .post(this.APIUrl, newContact)
      .toPromise()
      .then((response) => response as Contact)
      .catch(this.handleError);
  }

  // получение данных о контакте
  getContacts(): Promise<void | Contact[]> {
    return this.http
      .get(this.APIUrl)
      .toPromise()
      .then((response) => response as Contact[])
      .catch(this.handleError);
  }

  // удаление контакта по id
  deleteContact(delContactId: String): Promise<void | String> {
    return this.http
      .delete(this.APIUrl + '/' + delContactId)
      .toPromise()
      .then((response) => response as String)
      .catch(this.handleError);
  }

  // обновление контакта по id
  updateContact(putContact: Contact): Promise<void | Contact> {
    var putUrl = this.APIUrl + '/' + putContact._id;
    return this.http
      .put(putUrl, putContact)
      .toPromise()
      .then((response) => response as Contact)
      .catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg = error.message
      ? error.message
      : error.status
        ? `${error.status} – ${error.statusText}`
        : 'Ошибка сервера';
    console.error(errMsg);
  }
}
