import { Injectable, inject } from '@angular/core';
import { CrispService } from '@shared/services/crisp.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private crispService = inject(CrispService);

  /**
   * Open the chat window
   */
  openChat(): void {
    this.crispService.openChat();
  }
}
