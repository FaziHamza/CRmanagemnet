import { AuthService } from './../../authServices/auth.service';
import { CommonService } from 'src/app/utility/services/common.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBaseComponent } from 'src/app/utility/shared-component/base-form/form-base.component';

@Component({
  selector: 'app-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.css']
})
export class ConfirmPasswordComponent extends FormBaseComponent implements OnInit {
  confirmPassForm!: FormGroup;
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
     private formBuilder: FormBuilder,
     private _common :CommonService,
     private _auth :AuthService) {
    super();
  }
  paraId:any;
  ngOnInit(): void {
    this.initForm();
    this.parseQueryParams();
  }
  initForm() {
    this.confirmPassForm = this.formBuilder.group({
      // oldPassword: ['', [Validators.required, Validators.minLength(5)]],
      newPass: ['', [Validators.required, Validators.minLength(5)]],
      confirmPass: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  get formControls() {
    return this.confirmPassForm.controls;
  }
  public parseQueryParams() {
    this._route.params.subscribe(
      (res) => {
        
        this.paraId = this._route.snapshot.paramMap.get('id')?.toString();
      },
      (err) => {
        this._router.navigateByUrl('/');
      }
    );
  }
  // setPassword() {
  //   this._common.showSuccess("Your password successfully updated", "Success")
  //   this.router.navigateByUrl('/auth/login');
  // }
  setPassword(){
    if (this.formControls['newPass'].value === this.formControls['confirmPass'].value) {
      let obj = {
        email :this.paraId,
        password:this.confirmPassForm.value.confirmPass
      }
      this._common.startLoader();
      this._auth.resetPassword(obj).subscribe((res:any)=>{
        this._common.stopLoader();
        if (res?.successFlag) {
          this._common.showSuccess("Password Reset Successfully!", "Success")
          this._router.navigate(['/auth/login']);
        } else {
          this._common.showError(res.message, "Error")
        }
      })
    }
    else
      this._common.showError("Password and Confirm Password did not match","Error");
  }
}

