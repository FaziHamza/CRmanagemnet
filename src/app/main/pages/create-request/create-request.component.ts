import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/shared/services/api.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CommonService } from 'src/app/utility/services/common.service';
import { DatePipe } from '@angular/common';
import { ConfirmPopupComponent } from '../common/confirm-popup/confirm-popup.component';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.scss']
})
export class CreateRequestComponent implements OnInit {
  @Input() data: any;
  statusList: any[] = [];
  @Input()  statusType = '';
  today = new Date();
  interestPer = 0;
  noofInstallment = 0;
  firstDueDate: any;
  errorsList: any[] = [];
  interestVal = 0;
  remainingAmount = 0;
  customerId: string;
  gurantorId: string;
  customerList: any[] = [];
  gurantorList: any[] = [];
  customerDetail: FormGroup;
  searchInput$ = new Subject<any>();
  searchInputGurantor$ = new Subject<any>();
  constructor(private modal: NzModalService, private apiService: ApiService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,private router:Router,
    public commonService: CommonService) { }

  ngOnInit(): void {
    this.makeStatusList();
    this.initForm();
    this.searchInput$
    .pipe(debounceTime(500)) // Adjust the debounce time as needed
    .subscribe(value => {
      this.getCustomer(value);
    });
    this.searchInputGurantor$
    .pipe(debounceTime(500)) // Adjust the debounce time as needed
    .subscribe(value => {
      this.getCustomerGurantor(value);
    });

  }
  initForm() {
    this.customerDetail = this.formBuilder.group({
      customerName: [''],
      customerAccount: [''],
      customerId: [''],
      customerPhone: [''],
      customerAddress: [''],
      customerAttachment: [''],
      guarantorName: [''],
      guarantorAccount: [''],
      guarantorId: [''],
      guarantorPhone: [''],
      guarantorAddress: [''],
      guarantorAttachment: [''],
      // cardNo: [''],
    });
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
    debugger
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
    formData.append('OrderId', this.data);
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
  onChangeName(event: any) {
    this.searchInput$.next(event);
  }
  onChangeNameGurantor(event: any) {
    this.searchInputGurantor$.next(event);
  }
  getCustomer(event: any) {
    if (event.length >= 1) {
      this.apiService.getCustomer(event).subscribe(res => {
        if (res.data.length > 0) {
          this.customerList = res.data;
        }
      })
    }
    if (typeof event === 'number') {
      debugger
      let obj = this.customerList.find(a => a.customerId == event);
      if (obj){
        let data = {
          customerName: obj.customerName ? obj.customerName :'---',
          customerAccount: obj.customerAccount ? obj.customerAccount : '---',
          customerId: obj.customerId ? obj.customerId : '---',
          customerPhone: obj.mobile ? obj.mobile : '---',
          customerAddress: obj.custAddress ? obj.custAddress : '---',
        } 
        this.customerDetail.patchValue(data);
      }
    }
  }
  getCustomerGurantor(event: any) {
    if (event.length >= 1) {
      this.apiService.getCustomer(event).subscribe(res => {
        if (res.data.length > 0) {
          this.gurantorList = res.data;
        }
      })
    }
    if (typeof event === 'number') {
      let obj = this.gurantorList.find(a => a.customerId == event);
      if (obj){
        let data = {
          guarantorName: obj.customerName ? obj.customerName :'---',
          guarantorAccount: obj.customerAccount ? obj.customerAccount : '---',
          guarantorId: obj.customerId ? obj.customerId : '---',
          guarantorPhone: obj.mobile ? obj.mobile : '---',
          guarantorAddress: obj.custAddress ? obj.custAddress : '---',
        } 
        this.customerDetail.patchValue(data);
      }
    }
  }
  makeTransferRequest(){
    debugger
    if(!this.customerId){
      this.commonService.showError("Please enter your customer","Error");
      return;
    }
    if(!this.gurantorId){
      this.commonService.showError("Please enter your Gurantor","Error");
      return;
    }
    let formData = new FormData();
    formData.append('OrderId', this.data);
    formData.append('NewCustomerID', this.customerId)
    formData.append('NewGuarantorID', this.gurantorId)

    this.apiService.generatePNTransferOrderRequest(formData).subscribe(res=>{
      if(res.isSuccess){
        this.commonService.showSuccess("Informations updated!","Success!");
        this.confirm();
      }
    })
  }
}
