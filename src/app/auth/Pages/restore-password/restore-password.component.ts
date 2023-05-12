import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBaseComponent } from 'src/app/utility/shared-component/base-form/form-base.component';
import { MessageService } from '../message.service';
import { AuthService } from '../../authServices/auth.service';
import { CommonService } from 'src/app/utility/services/common.service';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.css']
})
export class RestorePasswordComponent extends FormBaseComponent implements OnInit {

  restorePassForm!: FormGroup;
  verificationCode: number;
  // userList: any;
  constructor(private router: Router, private toaster: ToastrService,
    private formBuilder: FormBuilder, private messageService: MessageService,
    private commonService: CommonService, private authSerive: AuthService) {
    super();
  }
  ngOnInit(): void {
    this.initForm();
    // this.GetUserList();
  }

  initForm() {
    this.restorePassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    })

  }

  get formControls() {
    console.log(this.restorePassForm.controls);
    return this.restorePassForm.controls;
  }
  restorePassword() {
    if (this.restorePassForm.valid) {
      let obj = {
        Email: this.restorePassForm.value.email
      }
      this.commonService.startLoader();
      this.authSerive.sendCodeAgain(obj).subscribe((res:any) => {
        this.commonService.stopLoader();
        if (res.successFlag) {
          this.commonService.showSuccess("Confirmation email send. Please check your email!", "Send")
          this.router.navigate(['/auth/verify-password',this.restorePassForm.value.email])
        } else {
          this.commonService.showError(res.message, 'Error')
        }
      })
    } else {
      this.commonService.showError("you enteref invalid user email. Please provide correct user email", 'Error')
    }
  }
}
