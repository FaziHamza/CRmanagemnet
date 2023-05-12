import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-base',
  template: ''
})
export class FormBaseComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  isRequiredField = (formControlName: any) => {
    return formControlName.touched && formControlName.hasError('required');
  };

  isEmailField = (formControlName: any) => {
    return formControlName.touched && formControlName.hasError('email');
  };

  isValidLength = (formControlName: any) => {
    return (
      formControlName.touched &&
      (formControlName.hasError('minlength') ||
       formControlName.hasError('maxlength'))
    );
  };

  isValidField = (formControlName: any) => {
    return formControlName.touched && formControlName.hasError('pattern');
  };

  //   hasError = (errorName: any, formGroup: any, formControl: any, submitted: any) => {
  //     return submitted && formGroup.hasError(errorName) && formControl.dirty;
  // };

}
