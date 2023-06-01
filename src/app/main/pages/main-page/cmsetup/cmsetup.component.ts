import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CmsSetupDto } from 'src/app/main/models/cmsSetupDto';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/utility/services/common.service';

@Component({
  selector: 'app-cmsetup',
  templateUrl: './cmsetup.component.html',
  styleUrls: ['./cmsetup.component.scss']
})
export class CMSetupComponent implements OnInit {
  cmsSetup: any = new CmsSetupDto('');
  cmsSetupForm: FormGroup;
  accountForm: FormGroup;
  promissorySetup = false;
  creditManagementSetup = false
  constructor(private _apiService: ApiService, private commonService: CommonService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.commonService.breadcrumb = [
      { title: 'Credit Management Setup', routeLink: '' },
      { title: 'Edit Setup ', routeLink: '' },
    ]
    this.cmsSetupFormcontrol();
    this.getCmsSetup();

  }
  cmsSetupFormcontrol() {
    this.cmsSetupForm = this.formBuilder.group({
      periodBetweenPNType: [''],
      periodBetweenPNValue: [''],
      periodBetweenPNValueMonth: [''],
      overDueAlertType: [''],
      overDueAlertTypeValue: [''],
      overDueAlertTypeValueMonth: [''],
      managePNWithin: [''],

      allowedReschedulingRequestsLimit: [''],
      allowedTransferringRequestsLimit: [''],
      //extra feild
      periodBetweenPNTypeDay: [''],

      id: [0],
    });
    this.cmsSetupForm.disable();
    this.accountForm = this.formBuilder.group({
      id: [0],
      raiseLimitRequest: [''],
      reduceLimitRequest: [''],
      newAccount: [null]
    });
    this.accountForm.disable();
    // this.promissoryNoteForm = this.formBuilder.group({
    //   periodBetweenPNType: [''],
    //   periodBetweenPNValue: [''],
    //   periodBetweenPNValueMonth: [''],
    //   overDueAlertType: [''],
    //   overDueAlertTypeValue: [''],
    //   overDueAlertTypeValueMonth: [''],
    //   managePNWithin: [''],
    //   id: [0],
    // })
  }
  getCmsSetup() {
    this._apiService.getCMSSetup().subscribe(res => {
      if (res.isSuccess) {

        this.cmsSetup = res.data[0];
        this.cmsSetupForm.patchValue(this.cmsSetup);
        if (this.cmsSetup) {

          const isDay = this.cmsSetup.periodBetweenPNType.toLowerCase() === 'days';

          this.cmsSetupForm.patchValue({
            periodBetweenPNType: isDay ? 'days' : 'months',
            periodBetweenPNValue: isDay ? this.cmsSetup.periodBetweenPNValue : null,
            periodBetweenPNValueMonth: isDay ? null : this.cmsSetup.periodBetweenPNValue,
          });
          
          
          const isDay2 = this.cmsSetup.overDueAlertType.toLowerCase() === 'days';

          this.cmsSetupForm.patchValue({
            overDueAlertType: isDay2 ? 'days' : 'months',
            overDueAlertTypeValue: isDay2 ? this.cmsSetup.overDueAlertTypeValue : null,
            overDueAlertTypeValueMonth: isDay2 ? null : this.cmsSetup.overDueAlertTypeValue,
          });

          
          // this.cmsSetupForm.value.periodBetweenPNValue = this.cmsSetupForm.value.periodBetweenPNType == 'Days' ? this.cmsSetupForm.value.periodBetweenPNValue : '';
          // this.cmsSetupForm.value.periodBetweenPNValueMonth = this.cmsSetupForm.value.periodBetweenPNType == 'Months' ? this.cmsSetupForm.value.periodBetweenPNValue : '';
          // this.cmsSetupForm.value.overDueAlertTypeValue = this.cmsSetupForm.value.overDueAlertType == 'Days' ? this.cmsSetupForm.value.overDueAlertTypeValue : '';
          // this.cmsSetupForm.value.overDueAlertTypeValueMonth = this.cmsSetupForm.value.overDueAlertType == 'Months' ? this.cmsSetupForm.value.overDueAlertTypeValue : '';
        }
      }
    })
  }
  saveCmdSetupv1() {
    if (this.cmsSetupForm.valid) {
      let controls = this.cmsSetupForm.value;
  
      if (controls.periodBetweenPNType == "Days") {
        controls.periodBetweenPNValue = controls.periodBetweenPNValue;
        controls.periodBetweenPNValueMonth = null;
      } else {
        controls.periodBetweenPNValue = controls.periodBetweenPNValueMonth;
        controls.periodBetweenPNValueMonth = null;
      }
  
      if (controls.overDueAlertType == "Days") {
        controls.overDueAlertTypeValue = controls.overDueAlertTypeValue;
        controls.overDueAlertTypeValueMonth = null;
      } else {
        controls.overDueAlertTypeValue = controls.overDueAlertTypeValueMonth;
        controls.overDueAlertTypeValueMonth = null;
      }
  
      this._apiService.saveCmsSetup(controls).subscribe(res => {
        if (res.isSuccess) {
          this.commonService.showSuccess("Data update successfully..!", "Success");
        } else {
          this.commonService.showSuccess("Found some error..!", "Error");
        }
      })
    }
  }
  saveCmdSetup() {
    if (this.cmsSetupForm.valid) {
      let controls = this.cmsSetupForm.value;
  
      let formData = new FormData();
      formData.append('PeriodBetweenPNType', controls.periodBetweenPNType);
      formData.append('OverDueAlertType', controls.overDueAlertType);
      formData.append('ManagePNWithin', controls.managePNWithin);
      formData.append('AllowedReschedulingRequestsLimit', controls.allowedReschedulingRequestsLimit.toString());
      formData.append('AllowedTransferringRequestsLimit', controls.allowedTransferringRequestsLimit.toString());
  
      if (controls.periodBetweenPNType.toLowerCase() === "days") {
        formData.append('PeriodBetweenPNValue', controls.periodBetweenPNValue.toString());
      } else {
        formData.append('PeriodBetweenPNValue', controls.periodBetweenPNValueMonth.toString());
      }
  
      if (controls.overDueAlertType.toLowerCase() === "days") {
        formData.append('OverDueAlertTypeValue', controls.overDueAlertTypeValue.toString());
      } else {
        formData.append('OverDueAlertTypeValue', controls.overDueAlertTypeValueMonth.toString());
      }
  
      // Capitalize the first letter
      let capitalizedPeriodBetweenPNType = controls.periodBetweenPNType.charAt(0).toUpperCase() + controls.periodBetweenPNType.slice(1);
      let capitalizedOverDueAlertType = controls.overDueAlertType.charAt(0).toUpperCase() + controls.overDueAlertType.slice(1);
  
      formData.set('PeriodBetweenPNType', capitalizedPeriodBetweenPNType);
      formData.set('OverDueAlertType', capitalizedOverDueAlertType);
  
      this._apiService.saveCmsSetup(formData).subscribe(res => {
        if (res.isSuccess) {
          this.commonService.showSuccess("Data updated successfully..!", "Success");
        } else {
          this.commonService.showError("Found some error..!", "Error");
        }
      });
    }
  }
  
  
  
  

  
  onAlertTypeChange(event: Event) {
    this.cmsSetupForm.get('overDueAlertTypeValue').setValue('');
    this.cmsSetupForm.get('overDueAlertTypeValueMonth').setValue('');
  }
  onPeriodTypeChange(event: Event) {
    this.cmsSetupForm.get('periodBetweenPNValue').setValue('');
    this.cmsSetupForm.get('periodBetweenPNValueMonth').setValue('');
  }
  formdisablePromissory() {
    this.promissorySetup = !this.promissorySetup;
    if (this.promissorySetup)
      this.cmsSetupForm.enable();
    else
      this.cmsSetupForm.disable();
  }
  formdisableCreditManagement() {
    this.creditManagementSetup = !this.creditManagementSetup;
    if (this.creditManagementSetup)
      this.accountForm.enable();
    else
      this.accountForm.disable();
  }
  cancel() {
    this.creditManagementSetup = false;
    this.promissorySetup = false;
    this.accountForm.disable();
    this.cmsSetupForm.disable();
  }
}

