import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import * as moment from 'moment';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/utility/services/common.service';
import { HeaderService } from 'src/app/utility/services/header.service';
import { ModalMessageComponent } from '../modal-message/modal-message.component';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent {
  formGroup: FormGroup;

  submitted = false;
  userDetails: any;
  errorMessage: any
  isLoading: boolean;
  userDetail:any;
  constructor(
    private apiService: ApiService,
    public commonService: CommonService,
    private fb: FormBuilder,
    private modalService: NgbModal,private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.commonService.breadcrumb = [
      { title: 'Profile', routeLink: '' },
    ];
    debugger
    this.userDetail = this.commonService.getUser();
    this.getForm();
    this.GetUserDetails();
    this.formGroup.controls['fullName'].disable();
    this.formGroup.controls['mobile'].disable();
  }

  getForm() {
    this.formGroup = this.fb.group({
      userId: '',
      fullName: '',
      mobile: '',
    });
  }

  get formValid(): { [key: string]: AbstractControl } {
    return this.formGroup.controls;
  }

  GetUserDetails() {
    this.apiService
      .GetUserDetails(this.userDetail?.nameid)
      .subscribe((response: any) => {
        if (response.isSuccess == true) {
          this.userDetails = response.data;
          if (this.userDetails.contractStartDate) this.userDetails.contractStartDate =  this.datePipe.transform(this.userDetails.contractStartDate, 'yyyy-MM-dd')
          if (this.userDetails.contractEndDate) this.userDetails.contractEndDate = this.datePipe.transform(this.userDetails.contractEndDate, 'yyyy-MM-dd')
          console.log("userDetails")
          console.log(this.userDetails)
          if (this.userDetails) {
            this.formGroup
              .get('userId')
              .patchValue(this.userDetail?.nameid);
            this.formGroup
              .get('fullName')
              .patchValue(this.userDetails.fullName);
            this.formGroup.get('mobile').patchValue(this.userDetails?.mobile);
          }
        }
      });
  }
  fullName: string;
  mobile: string;

  EditUser() {
    console.log(this.formGroup.value);
    this.apiService
      .EditUser(this.formGroup.value)
      .subscribe((response: any) => {
        if (response.isSuccess == true) {
          this.errorMessage = ""
          this.formGroup.controls['fullName'].disable();
          this.isShowFullName = false;
          this.formGroup.controls['mobile'].disable();
          this.isShowmobile = false;

          const modalRef = this.modalService.open(ModalMessageComponent);
          modalRef.componentInstance.type = 'success';
          modalRef.componentInstance.message = 'Updated successfully';
          modalRef.componentInstance.routeName = '/profile';
        } else {
          this.errorMessage = response?.Errors.reduce((acc: string, item: { ErrorMessageEn: any; }) => acc += `${item?.ErrorMessageEn}, `, "")
        }
      });
  }

  CancelEditing() {
    this.errorMessage = ""
    this.formGroup.controls['fullName'].disable();
    this.isShowFullName = false;
    this.formGroup.controls['mobile'].disable();
    this.isShowmobile = false;
    this.GetUserDetails()
  }

  isShowFullName: boolean = false;
  editfullname() {
    this.errorMessage = ""
    if (this.isShowFullName == false) {
      this.formGroup.controls['fullName'].enable();
      this.isShowFullName = true;
    } else {
      this.formGroup.controls['fullName'].disable();
      this.isShowFullName = false;
    }
  }

  resetError() {
    this.errorMessage = ""
  }

  isShowmobile: boolean = false;

  editfmobile() {
    this.errorMessage = ""
    if (this.isShowmobile == false) {
      this.formGroup.controls['mobile'].enable();
      this.isShowmobile = true;
    } else {
      this.formGroup.controls['mobile'].disable();
      this.isShowmobile = false;
    }
  }
}
