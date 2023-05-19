import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/utility/services/common.service';
import { FormBaseComponent } from 'src/app/utility/shared-component/base-form/form-base.component';
import { AuthService } from '../../authServices/auth.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends FormBaseComponent implements OnInit {
  loginForm!: FormGroup;
  passwordVisible = false;
  constructor(public messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    private commonService: CommonService,
    private formBuilder: FormBuilder) {
    super();
  }
  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      identity: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }
  get formControls() {
    return this.loginForm.controls;
  }

  login() {
    // this.router.navigate(['/home/allorder']);
    if (this.loginForm.valid) {
      this.commonService.startLoader();
      this.authService.loginUser(this.loginForm.value).subscribe(
        (response: any) => {
          if (response.isSuccess) {
            this.commonService.stopLoader();
            localStorage.setItem('userDetail', JSON.stringify(response.data));
          this.commonService.showSuccess("Login Successfully!", "Success");
          this.router.navigate(['/home/allorder']);
          } else {
            this.commonService.stopLoader();
          this.commonService.showError(response.Errors[0].ErrorMessageEn, "error");
        }

        },
        (error) => {
          this.commonService.stopLoader();
          this.commonService.showError(error.message, "error");
        }
      );
    }
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
