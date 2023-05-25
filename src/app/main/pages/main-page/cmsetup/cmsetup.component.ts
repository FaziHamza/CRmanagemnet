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
      id: [0],
    })
  }
  getCmsSetup() {
    this._apiService.getCMSSetup().subscribe(res => {
      if (res.isSuccess) {
        debugger
        this.cmsSetup = res.data[0];
        this.cmsSetupForm.patchValue(this.cmsSetup);
        if(this.cmsSetup){
          this.cmsSetupForm.value.periodBetweenPNValue = this.cmsSetupForm.value.periodBetweenPNType == 'Days' ? this.cmsSetupForm.value.periodBetweenPNValue : '' ;
          this.cmsSetupForm.value.periodBetweenPNValueMonth = this.cmsSetupForm.value.periodBetweenPNType == 'Months' ? this.cmsSetupForm.value.periodBetweenPNValue : '';
          this.cmsSetupForm.value.overDueAlertTypeValue = this.cmsSetupForm.value.overDueAlertType == 'Days' ? this.cmsSetupForm.value.overDueAlertTypeValue : '' ;
          this.cmsSetupForm.value.overDueAlertTypeValueMonth = this.cmsSetupForm.value.overDueAlertType == 'Months' ? this.cmsSetupForm.value.overDueAlertTypeValue : '';
        }
      }
    })
  }
  saveCmdSetup() {
    if (this.cmsSetupForm.valid) {
      let controls = this.cmsSetupForm.value;
      controls.periodBetweenPNValue = controls.periodBetweenPNType == "Days" ? controls.periodBetweenPNValue : controls.periodBetweenPNValueMonth
      controls.overDueAlertTypeValue = controls.overDueAlertType == "Days" ? controls.overDueAlertTypeValue : controls.overDueAlertTypeValueMonth
      this._apiService.saveCmsSetup(this.cmsSetupForm.value).subscribe(res => {
        if (res.isSuccess) {
          this.commonService.showSuccess("Data update successfully..!", "Success");
        } else {
          this.commonService.showSuccess("found some error..!", "Error");
        }
      })
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

}
