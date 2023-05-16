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
export class LoginComponent extends FormBaseComponent  implements OnInit {
  loginForm!: FormGroup;
  userData: any;
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }
  get formControls() {
    return this.loginForm.controls;
  }
  
  login() {
    
    if (this.loginForm.valid) {
      this.router.navigate(['/home/createorders']);
      // this.commonService.startLoader();
      // this.authService.login(this.loginForm.value).subscribe(
      //   (response: any) => {
      //     this.commonService.stopLoader();
      //     // this.userInfo = response;
      //     // this.userData = response.data;
      //     console.log("response", response)
      //     if (this.userData) {
      //       localStorage.setItem('fullName', this.userData.fullName);
      //       localStorage.setItem('city', this.userData.city);
      //       localStorage.setItem('userid', this.userData.id);
      //       localStorage.setItem('role', JSON.stringify(this.userData.role));
      //       localStorage.setItem('userPortals', JSON.stringify(this.userData.userPortals));
      //       localStorage.setItem(
      //         'branch',
      //         JSON.stringify(this.userData.branch)
      //       );
      //       localStorage.setItem(
      //         'register',
      //         JSON.stringify(this.userData.register)
      //       );
      //       localStorage.setItem(
      //         'permissions',
      //         JSON.stringify(this.userData.permissions)
      //       );

      //       // localStorage.setItem('rememberMe', this.rememberMe.toString());
      //       // localStorage.setItem('rememberMe', this.rememberMe.toString());
      //       // localStorage.setItem('rememberMe', this.rememberMe.toString());

      //       if (this.loginForm.value.rememberMe) {
      //         localStorage.setItem(
      //           'identity',
      //           this.loginForm.controls['email'].value
      //         );
      //         localStorage.setItem(
      //           'password',
      //           this.loginForm.controls['password'].value
      //         );
      //         localStorage.setItem('rememberMe', this.loginForm.value.rememberMe.toString());

      //         localStorage.setItem('token', this.userData.token);
      //       } else {
      //         // sessionStorage.setItem('fullName', this.userInfo.data.fullName);
      //         // sessionStorage.setItem('id', this.userInfo.data.id);
      //         sessionStorage.setItem('token', this.userData.token);
      //         // localStorage.removeItem('identity');
      //         // localStorage.removeItem('password');
      //         // localStorage.removeItem('rememberMe');
      //       }
      //       this.router.navigate(['/home']);

      //       // this.router.navigateByUrl('/');

      //     } else {
      //       this.commonService.showError(response.ErrorMessageEn,"error");
      //       this.commonService.stopLoader();
      //     }
      //   },
      //   (error) => {
      //     this.commonService.stopLoader();
      //     this.commonService.showError(error.message,"error");
      //   }
      // );
    }
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
