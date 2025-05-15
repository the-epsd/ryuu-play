import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors } from '@angular/forms';

const addressPattern = /^https?:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(:[0-9]+)?\/?$/;

@Directive({
  selector: '[ptcgAddressValidator][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: AddressValidatorDirective, multi: true }]
})
export class AddressValidatorDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors {
    const value: string = control.value;
    if (!value) {
      return null;
    }
    // Remove any @ symbol from the start of the URL
    const cleanValue = value.replace(/^@/, '');
    return addressPattern.test(cleanValue) ? null : { address: true };
  }

}
