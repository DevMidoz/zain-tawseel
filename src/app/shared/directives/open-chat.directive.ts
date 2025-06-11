import { Directive, HostListener, inject } from '@angular/core';
import { ChatService } from '@core/services/chat.service';

@Directive({
  selector: '[appOpenChat]',
  standalone: true,
})
export class OpenChatDirective {
  private chatService = inject(ChatService);

  @HostListener('click')
  onClick(): void {
    this.chatService.openChat();
  }
}
