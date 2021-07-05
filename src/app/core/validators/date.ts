import { AbstractControl, FormGroup, ValidatorFn } from "@angular/forms";
import { CONFIG } from "src/config/config";
import { CoreService } from "../service/CoreService.service";

export function dateRangeGreaterThanOneWeek(begin: string, end: string): ValidatorFn {
  return (control: FormGroup) : {[key: string] : any} | null => {
    if (!control.controls[begin].value || !control.controls[end].value) {
      return null
    }
    let dayDiff = CoreService.getDayDiff(control.controls[begin].value, control.controls[end].value)
    return dayDiff > 7 ? { 
      'dateRangeGreaterThanOneWeek': {
        msg: CONFIG.errorMessages.dateRangeGreaterThanOneWeek,
        data: dayDiff
      }
    } : null;
  }
}

export function beginDateGreaterThanEndDate(begin: string, end: string): ValidatorFn {
  return (control: FormGroup) : {[key: string] : any} | null => {
    if (!control.controls[begin].value || !control.controls[end].value) {
      return null
    }
    let beginDate = new Date(control.controls[begin].value).getTime()
    let endDate = new Date(control.controls[end].value).getTime()
    let timeDiff = endDate - beginDate
    return timeDiff < 0 ? { 
      'beginDateGreaterThanEndDate': {
        msg: CONFIG.errorMessages.beginDateGreaterThanEndDate,
        data: timeDiff
      } 
    } : null;
  }
}