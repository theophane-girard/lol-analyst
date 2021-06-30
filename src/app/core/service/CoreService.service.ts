import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class CoreService {
  static capitalize(word: string) : string {
      const lower = word.toLowerCase()
      return word.charAt(0).toUpperCase() + lower.slice(1)
  }

  static isFormGroup(control: AbstractControl): control is FormGroup {
    return !!(<FormGroup>control).controls;
  }
  
  static collectFormErrors(control: AbstractControl): any | null {
    if (CoreService.isFormGroup(control)) {
      return Object.entries(control.controls)
        .reduce(
          (acc, [key, childControl]) => {
            const childErrors = CoreService.collectFormErrors(childControl);
            if (childErrors) {
              acc = {...acc, [key]: childErrors};
            }
            return acc;
          },
          null
        );
    } else {
      return control.errors;
    }
  }
}