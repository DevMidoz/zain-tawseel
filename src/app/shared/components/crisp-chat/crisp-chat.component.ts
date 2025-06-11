import { Component, OnInit, inject } from '@angular/core';
import { CrispService } from '@shared/services/crisp.service';

@Component({
  selector: 'app-crisp-chat',
  standalone: true,
  template: '', // Empty template - this component just initializes the service
})
export class CrispChatComponent implements OnInit {
  private crispService = inject(CrispService);

  ngOnInit(): void {
    // Initialize the Crisp service
    this.crispService.initialize();
  }
}
