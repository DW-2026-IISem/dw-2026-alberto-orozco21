import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Contact, ContactPayload } from '../../core/models/contact.model';
import { EntityApi } from '../../core/services/entity-api';

@Injectable({ providedIn: 'root' })
export class ContactApi extends EntityApi<Contact, ContactPayload> {
  constructor() {
    super(`${environment.apiUrl}/contacts`, 'contacts', 'contact');
  }
}