import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormBaseComponent } from 'src/app/utility/shared-component/base-form/form-base.component';
import { jsDocComment } from '@angular/compiler';
import { AuthService } from '../../authServices/auth.service';
import { CommonService } from 'src/app/utility/services/common.service';
import { MessageService } from '../message.service';
import { CountryCodeList } from './countryCodes';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends FormBaseComponent implements OnInit {
  registerForm!: FormGroup;
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private authSerive: AuthService,
    private commonService: CommonService,
    private messageService: MessageService
  ) {
    super();
  }


  countryCodeList = CountryCodeList;

  ngOnInit(): void {
    this.initForm();

  }

  initForm() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      middleName: [''],
      profilePic: [''],
      userName: [''],  // userName should be unique which is = Email in api
      lastName: ['', [Validators.required]],
      countryCode: ['', Validators.required],
      phoneNumber: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4)]],
      privacyCheck: [false, Validators.requiredTrue]
    })
  }

  get formControls() {
    return this.registerForm.controls;
  }

  get completeForm() {
    return console.log(this.registerForm);

  }


  signup() {
    

    console.log(this.registerForm);

    if (this.formControls['password'].value === this.formControls['confirmPassword'].value) {
      if (this.registerForm.valid) {
        let formObj = {
          email: this.registerForm.get("email").value,
          firstName: this.registerForm.get("firstName").value,
          middleName: this.registerForm.get("middleName").value,
          profilePic: this.registerForm.get("profilePic").value,
          userName: "",
          verifyCode: "",
          lastName: this.registerForm.get("lastName").value,
          phoneNumber: this.registerForm.get("countryCode").value + this.registerForm.get("phoneNumber").value,
          password: this.registerForm.get("password").value,
          confirmPassword: this.registerForm.get("confirmPassword").value,
        }

        // console.log(formObj);
        this.commonService.startLoader();
        this.authSerive.userRegister(formObj).subscribe((res: any) => {
          this.commonService.stopLoader();
          // this.commonService.jsonBeautify(res);
          if (res?.successFlag) {
            
            this.commonService.showSuccess("OPT send on your Number please verify First!", "Success")
            this.router.navigate(['/auth/confirm-number', this.registerForm.value.email]);
          } else {
            this.commonService.showError(res.message, "Register Error")
          }
        })
      }
    } else this.commonService.showError("Password Should be match", "Error")

  }
}
