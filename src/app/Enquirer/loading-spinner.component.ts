// loading-spinner.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div *ngIf="isLoading" class="loading-spinner">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only"></span>
      </div>
    </div>
  `,
  styles: [`
    .loading-spinner {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000; /* Ensure it's on top of other elements */
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() isLoading: boolean = false;
}
