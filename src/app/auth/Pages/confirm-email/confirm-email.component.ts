import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormBaseComponent } from 'src/app/utility/shared-component/base-form/form-base.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../authServices/auth.service';
import { MessageService } from '../message.service';
import { CommonService } from 'src/app/utility/services/common.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent extends FormBaseComponent implements OnInit {

  confirmEmailForm !: FormGroup;
  paraId:any;
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
    this.confirmEmailForm = this.formBuilder.group({
      firstDigit: ['', [Validators.required]],
      secondDigit: ['', [Validators.required]],
      thirdDigit: ['', [Validators.required]],
      forthDigit: ['', [Validators.required]],
      // fifthDigit: ['', [Validators.required]],
      // sixDigit: ['', [Validators.required]],
    });
  }
  // get each FormControls
  get formControls() {
    return this.confirmEmailForm.controls
  }
  public parseQueryParams() {
    this._route.params.subscribe(
      (res) => {
        
        this.paraId = this._route.snapshot.paramMap.get('id')?.toString();
        
        // if (this.paraId) {
        // }
      },
      (err) => {
        this._router.navigateByUrl('/');
      }
    );
  }
  confirmEmail() {
    let verifiedCode = this.confirmEmailForm.value.firstDigit.concat(this.confirmEmailForm.value.secondDigit, this.confirmEmailForm.value.thirdDigit, this.confirmEmailForm.value.forthDigit);
    let obj = {
      Code: verifiedCode,
      email : this.paraId
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
   sendEmail() {
    
    // this.verificationCode = this.messageService.generateVerificationCode();
    let smsSend = {
      Email: this.paraId
    }
    this.commonService.startLoader();
    this.authSerive.sendSMSAgain(smsSend).subscribe((res:any) => {
      this.commonService.stopLoader();
      if (res) {
        this.commonService.showSuccess("Confirmation Phone send. Please check your Mobile inbox!", "Send")
      } else {
        this.commonService.showError(res.message, 'Error')
      }
    })
  }
}
