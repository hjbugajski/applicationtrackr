import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export class CustomValidators {
  public static passwordValidators = [
    Validators.required,
    Validators.minLength(8),
    CustomValidators.letter,
    CustomValidators.number,
    CustomValidators.symbol
  ];

  private static readonly letterRegex = /^(?=.*[a-zA-Z])/;
  private static readonly numberRegex = /^(?=.*[0-9])/;
  private static readonly symbolRegex = /^(?=.*[!@#$%^&_*+=()[\]{}<>,.;:'"\-?/\\])/;
  private static readonly urlRegex =
    /^(http:\/\/|https:\/\/)+[a-zA-Z0-9]+([-.]{1}[a-zA-Z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)/;

  public static letter(control: AbstractControl): ValidationErrors | null {
    return regexValidator(CustomValidators.letterRegex, 'letter', control);
  }

  public static matchValue(controlOne: AbstractControl | null): ValidatorFn {
    return matchValueValidator(controlOne);
  }

  public static number(control: AbstractControl): ValidationErrors | null {
    return regexValidator(CustomValidators.numberRegex, 'number', control);
  }

  public static symbol(control: AbstractControl): ValidationErrors | null {
    return regexValidator(CustomValidators.symbolRegex, 'symbol', control);
  }

  public static url(control: AbstractControl): ValidationErrors | null {
    return regexValidator(CustomValidators.urlRegex, 'url', control);
  }
}

function isEmptyValue(value: any): boolean {
  return value === null || value === undefined;
}

function matchValueValidator(controlOne: AbstractControl | null): ValidatorFn {
  return (controlTwo: AbstractControl): ValidationErrors | null => {
    if (isEmptyValue(controlOne) || isEmptyValue(controlOne?.value) || isEmptyValue(controlTwo.value)) {
      return null;
    }

    return controlOne?.value === controlTwo.value ? null : { matchValue: true };
  };
}

function regexValidator(regex: RegExp, validator: string, control: AbstractControl): ValidationErrors | null {
  if (isEmptyValue(control?.value)) {
    return null;
  }

  return regex.test(control?.value) ? null : { [validator]: true };
}
