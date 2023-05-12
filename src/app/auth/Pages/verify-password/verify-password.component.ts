import { FormBaseComponent } from 'src/app/utility/shared-component/base-form/form-base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../message.service';
import { CommonService } from 'src/app/utility/services/common.service';
import { AuthService } from '../../authServices/auth.service';

@Component({
  selector: 'app-verify-password',
  templateUrl: './verify-password.component.html',
  styleUrls: ['./verify-password.component.css']
})
export class VerifyPasswordComponent extends FormBaseComponent implements OnInit {
  verificationCode: any;
  paraId:any
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private formBuilder: FormBuilder, private messageService: MessageService,
    private commonService: CommonService, private authSerive: AuthService) {
    super();
  }
  verifyPassForm !: FormGroup;
  ngOnInit(): void {
    this.initForm();
    this.parseQueryParams();
  }

  initForm() {
    this.verifyPassForm = this.formBuilder.group({
      firstDigit: ['', [Validators.required]],
      secondDigit: ['', [Validators.required]],
      thirdDigit: ['', [Validators.required]],
      forthDigit: ['', [Validators.required]],
    })
  }

  get formControls() {
    return this.verifyPassForm.controls;
  }

  verifyPassword() {
    let verifiedCode = this.verifyPassForm.value.firstDigit.concat(this.verifyPassForm.value.secondDigit, this.verifyPassForm.value.thirdDigit, this.verifyPassForm.value.forthDigit);
    let obj = {
      Code: verifiedCode,
      Email : this.paraId
    }
    this.commonService.startLoader();
    this.authSerive.confirmEmail(obj).subscribe((res: any) => {
      this.commonService.stopLoader();
      // this.commonService.jsonBeautify(res);
      if (res?.successFlag) {
        this.commonService.showSuccess(res.message, "Success")
        this._router.navigate(['auth/confirm-password',this.paraId])
      } else {
        this.commonService.showError(res.message, "Invalid code. Please try again")
      }
    })
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
  sendAgain() {
    // this.verificationCode = this.messageService.generateVerificationCode();
    let emailSend = {
      Email: this.paraId
    }
    this.commonService.startLoader();
    this.authSerive.sendCodeAgain(emailSend).subscribe((res:any) => {
      this.commonService.stopLoader();
      if (res.successFlag) {
        this.commonService.showSuccess("Confirmation email send. Please check your email!", "Send")
      } else {
        this.commonService.showError(res.message, 'Error')
      }
    })
  }
}
