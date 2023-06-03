import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/shared/services/api.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CommonService } from 'src/app/utility/services/common.service';
import { DatePipe } from '@angular/common';
import { ConfirmPopupComponent } from '../common/confirm-popup/confirm-popup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.scss']
})
export class CreateRequestComponent implements OnInit {
  @Input() data: any;
  statusList: any[] = [];
  statusType = '';
  today = new Date();
  interestPer = 0;
  noofInstallment = 0;
  firstDueDate: any;
  errorsList: any[] = [];
  interestVal = 0;
  remainingAmount = 0;
  constructor(private modal: NzModalService, private apiService: ApiService,
    private datePipe: DatePipe,private router:Router,
    public commonService: CommonService) { }

  ngOnInit(): void {
    this.makeStatusList();

  }
  makeStatusList() {
    this.apiService.getStatusLookup(24).subscribe(res => {
      if (res.isSuccess) {
        this.statusList = res.data;
      }
    })
  }
  cancelModal() {
    this.modal.closeAll();
  }
  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) < 0;

  interestPercentage() {
    if (!this.interestPer)
      this.interestPer = 0
  }
  interestValue() {
    if (!this.interestVal)
      this.interestVal = 0
  }
  getPNOrderRemainingAmountforRescheduling() {
    this.apiService.getPNOrderRemainingAmountforRescheduling(this.data, this.interestPer, this.interestVal).subscribe(res => {
      if (res.isSuccess) {
        this.remainingAmount = res.data;
      }
    })
  }
  saveRequestApproval() {
    this.errorsList = [];
    if(!this.firstDueDate)
    {
      this.commonService.showError("Please select a New First Due Date","Error");
      return;
    }    
    if(!this.noofInstallment)
    {
      this.commonService.showError("Please select a New No. of Installment","Error");
      return;
    }    
    const fromDate = new Date(this.firstDueDate);
    const formattedFromDate = fromDate.toISOString();
    let formData = new FormData();
    formData.append('OrderId ', this.data);
    formData.append('NewInstallmentsNumber', this.noofInstallment.toString());
    formData.append('NewFirstDueDate', formattedFromDate);
    formData.append('InterestPercentage', this.interestPer.toString());
    formData.append('InterestValue', this.interestVal.toString());
    this.apiService.generatePNRescheduleOrderRequest(formData).subscribe(
      (response) => {
        if(response.isSuccess){
          this.commonService.showSuccess("Informations updated!","Success!");
          // this.cancelModal();
          this.confirm();
        }else{
          this.errorsList = response["errors"];
          this.commonService.showError(response.message,"Error!");
        }
      },
      (error) => {
        this.errorsList = error.Errors;;
        console.log(error);
      }
    )

  }
  confirm(): void {
    const modal = this.modal.create<ConfirmPopupComponent>({
      nzWidth: 500,
      nzContent: ConfirmPopupComponent,
      nzFooter: null
    });
    modal.afterClose.subscribe(res => {
      this.cancelModal();
      this.router.navigate(['/home/workorders'])
    });
  }
}
