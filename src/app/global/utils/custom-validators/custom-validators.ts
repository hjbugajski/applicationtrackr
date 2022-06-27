import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export class CustomValidators {
  public static emailValidators = [Validators.required, Validators.maxLength(320), CustomValidators.email];
  public static passwordValidators = [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(128),
    CustomValidators.letter,
    CustomValidators.number,
    CustomValidators.symbol
  ];

  private static readonly emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private static readonly letterRegex = /^(?=.*[a-zA-Z])/;
  private static readonly numberRegex = /^(?=.*[0-9])/;
  private static readonly symbolRegex = /^(?=.*[!@#$%^&_*+=()[\]{}<>,.;:'"\-?/\\])/;
  private static readonly urlRegex =
    /^(http:\/\/|https:\/\/)+[a-zA-Z0-9]+([-.]{1}[a-zA-Z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)/;

  public static email(control: AbstractControl): ValidationErrors | null {
    return regexValidator(CustomValidators.emailRegex, 'email', control);
  }

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

export function getEmailError(control: AbstractControl | null): string {
  if (control?.hasError('email')) {
    return 'Invalid email';
  } else if (control?.hasError('maxlength')) {
    return 'Email must be less than 320 characters';
  }

  return 'Required';
}

export function getPasswordError(control: AbstractControl | null): string {
  if (control?.hasError('minlength')) {
    return 'Length must be at least 8 characters';
  } else if (control?.hasError('maxlength')) {
    return 'Length must be less than 128 characters';
  } else if (control?.hasError('letter')) {
    return 'Must contain at least one letter';
  } else if (control?.hasError('number')) {
    return 'Must contain at least one number';
  } else if (control?.hasError('symbol')) {
    return 'Must contain at least one symbol';
  } else if (control?.hasError('matchValue')) {
    return 'Passwords must match';
  } else {
    return 'Required';
  }
}

function isEmptyValue(value: any): boolean {
  return value === null || value === undefined || value === '';
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
  if (isEmptyValue(control) || isEmptyValue(control?.value)) {
    return null;
  }

  return regex.test(control?.value) ? null : { [validator]: true };
}
