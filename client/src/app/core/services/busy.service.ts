import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  private busyRequestCount: number = 0;

  constructor(private spinnerService: NgxSpinnerService) {}

  busy(): void {
    this.busyRequestCount++;
    this.spinnerService.show(undefined, {
      type: 'ball-clip-rotate',
      bdColor: 'rgba(255,255,255,0.7)',
      color: '#333333',
    });
  }

  idle(): void {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}
