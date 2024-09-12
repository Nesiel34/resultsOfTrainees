import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private filterState: any = {};

  // Save state
  setState(key: string, value: any): void {
    this.filterState[key] = value;
  }

  // Get state
  getState(key: string): any {
    return this.filterState[key];
  }
}
