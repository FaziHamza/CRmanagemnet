import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/utility/services/common.service';
import { FormBaseComponent } from 'src/app/utility/shared-component/base-form/form-base.component';
import { AuthService } from '../../authServices/auth.service';
import { MessageService } from '../message.service';
import { JwtService } from 'src/app/shared/services/jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends FormBaseComponent implements OnInit {
  loginForm!: FormGroup;
  token:string = '';
  passwordVisible = false;
  constructor(public messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private jwtService:JwtService
    ) {
    super();
  }
  ngOnInit(): void {
    this.initForm();
    this.route.queryParams.subscribe(param => {
      if (param) {
        const token = param['token'];
        if (token) {
          debugger
          this.token = token;
          let getuser = JSON.parse(window.atob(token.split(".")[1]));
          getuser['token'] = token;
          localStorage.setItem('userDetail', JSON.stringify(getuser));
          this.jwtService.saveToken(this.token);
          this.authService.setAuth(getuser);
          this.router.navigate(['/home/dashboard']);
        }
      }
    });
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
          this.authService.setAuth(response.data);
          // this.router.navigate(['/home/allorder']);
          this.router.navigate(['/home/dashboard']);
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
