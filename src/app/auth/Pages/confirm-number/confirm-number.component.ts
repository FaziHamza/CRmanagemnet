import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormBaseComponent } from 'src/app/utility/shared-component/base-form/form-base.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../authServices/auth.service';
import { CommonService } from 'src/app/utility/services/common.service';

@Component({
  selector: 'app-confirm-number',
  templateUrl: './confirm-number.component.html',
  styleUrls: ['./confirm-number.component.css']
})
export class ConfirmNumberComponent extends FormBaseComponent implements OnInit {
  confirmNumberForm !: FormGroup;
  paraId: any;
  constructor(private authSerive: AuthService,
    private formBuilder: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private commonService: CommonService) {
    super();
  }
  verificationCode: number;

  ngOnInit(): void {
    
    this.parseQueryParams();
    this.initForm();
  }
  initForm() {
    this.confirmNumberForm = this.formBuilder.group({
      firstDigit: ['', [Validators.required]],
      secondDigit: ['', [Validators.required]],
      thirdDigit: ['', [Validators.required]],
      forthDigit: ['', [Validators.required]],
    });
  }
  // get each FormControls
  get formControls() {
    return this.confirmNumberForm.controls
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
  confirmNumber() {
    let verifiedCode = this.confirmNumberForm.value.firstDigit.concat(this.confirmNumberForm.value.secondDigit, this.confirmNumberForm.value.thirdDigit, this.confirmNumberForm.value.forthDigit);
    let obj = {
      Code: verifiedCode,
      email: this.paraId
    }
    this.commonService.startLoader();
    this.authSerive.confirmEmail(obj).subscribe((res: any) => {
      this.commonService.stopLoader();
      // this.commonService.jsonBeautify(res);
      if (res?.successFlag) {
        this.commonService.showSuccess(res.message, "Success")
        this._router.navigateByUrl('/auth/login')
      } else {
        this.commonService.showError(res.message, "Register Error")
      }
    })
  }

  //#region   Send Again
  //#endregion
  sendSMSAgain() {
    
    let smsSend = {
      Email: this.paraId
    }
    this.commonService.startLoader();
    this.authSerive.sendSMSAgain(smsSend).subscribe((res: any) => {
      this.commonService.stopLoader();
      if (res.successFlag) {
        this.commonService.showSuccess("Confirmation Code send. Please check your Mobile inbox!", "Send")
      } else {
        this.commonService.showError(res.message, 'Error')
      }
    })
  }
}

