import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CoreService {
  static capitalize(word: string) : string {
      const lower = word.toLowerCase()
      return word.charAt(0).toUpperCase() + lower.slice(1)
  }
}