import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/utility/services/common.service';
import { ErrorsComponent } from '../errors/errors.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reject',
  templateUrl: './reject.component.html',
  styleUrls: ['./reject.component.scss']
})
export class RejectComponent implements OnInit {
  @Input() requestId: any;
  rejectForm: FormGroup;
  saveSubmitted: boolean = false;
  errorsList: any[] = [];
  constructor(private formBuilder: FormBuilder, private modal: NzModalService, private apiService: ApiService,
    private commonService: CommonService,private router:Router) { }

  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.rejectForm = this.formBuilder.group({
      reason: ['', [Validators.maxLength(150)]],
    });
  }
  saveForm() {
    this.saveSubmitted = true;
    if (this.rejectForm.valid) {
      let formData = new FormData();
      formData.append('RequestId', this.requestId);
      formData.append('RejectReason', this.rejectForm.value.reason);
      this.apiService.rejectRequest(formData).subscribe(
        (response) => {
          if (response.isSuccess) {
            this.commonService.showSuccess("Data updated successfully..!", "Success");
            this.router.navigate(['/home/workorders'])
            this.close();
          } else {
            this.errorsList = response["errors"] ? response["errors"] : response["Errors"];
            this.commonService.showError("found some error..!", "Error");
            this.error(this.errorsList);
          }
        },
        (error) => {
          this.errorsList = error["errors"] ? error["errors"] : error["Errors"];
          this.error(this.errorsList);
        }
      )
    }
  }
  close() {
    this.modal.closeAll();
  }
  error(errorsList:any): void {
    const modal = this.modal.create<ErrorsComponent>({
      nzWidth: 500,
      nzContent: ErrorsComponent,
      nzComponentParams: {
        errorsList:errorsList
      },
      nzFooter: null
    });
    modal.afterClose.subscribe(res => {
      if (res) {
      }
    });
  }
}
