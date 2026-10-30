import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Messenger, MessengerPayload } from '../../core/models/messenger.model';
import { EntityApi } from '../../core/services/entity-api';

@Injectable({ providedIn: 'root' })
export class MessengerApi extends EntityApi<Messenger, MessengerPayload> {
  constructor() {
    super(`${environment.apiUrl}/messengers`, 'messengers', 'messenger');
  }
}