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
import { ErrorsComponent } from '../common/errors/errors.component';
import { PDFViewComponent } from '../pdfview/pdfview.component';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.scss']
})
export class CreateRequestComponent implements OnInit {
  @Input() data: any;
  statusList: any[] = [];
  @Input() statusType = '';
  interestPer: any = "";
  noofInstallment :any;
  firstDueDate: any;
  errorsList: any[] = [];
  interestVal :any = "";
  remainingAmount = 0;
  getPNremainingAmount = 0;
  customerId: string;
  gurantorId: string;
  customerAvatarName: string = '';
  customerFileName: string = '';
  guarantorAvatarName: string = '';
  guarantorFileName: string = '';
  customerList: any[] = [];
  gurantorList: any[] = [];
  customerDetail: FormGroup;
  searchInput$ = new Subject<any>();
  searchInputGurantor$ = new Subject<any>();
  constructor(private modal: NzModalService, private apiService: ApiService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe, private router: Router,
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
    if(this.statusType == 'Reschedule Request')
        this.getPNOrderDetail();
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
    differenceInCalendarDays(current,  new Date()) <= 0;

  interestPercentage() {
    if(this.interestPer != "")
      this.interestVal = parseFloat(((this.getPNremainingAmount*parseFloat(this.interestPer))/100).toFixed(3));
    else{
      this.interestPer = "";
      this.interestVal = "";
    }

  }

  interestValue() {
    if(this.interestVal != "")
      this.interestPer = parseFloat((parseFloat(this.interestVal)/this.getPNremainingAmount).toFixed(3));
    else{
      this.interestPer = "";
      this.interestVal = "";
    }

  }
  getPNOrderRemainingAmountforRescheduling() {
    this.apiService.getPNOrderRemainingAmountforRescheduling(this.data, this.interestPer, this.interestVal).subscribe(
      (resposnse)=>{
        if (resposnse.isSuccess) {
          this.remainingAmount = resposnse.data;
        }
      },
      (error)=>{
        this.errorsList = error.Errors ? error.Errors : error.errors ? error.errors : error.error.errors;
        this.erros(this.errorsList);
      }
    )
  }
  saveRequestApproval() {

    this.errorsList = [];
    if (!this.firstDueDate) {
      this.commonService.showError("Please select a New First Due Date", "Error");
      return;
    }
    if (!this.noofInstallment) {
      this.commonService.showError("Please select a New No. of Installment", "Error");
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
        if (response.isSuccess) {
          this.commonService.showSuccess("Informations updated!", "Success!");
          // this.cancelModal();
          this.confirm("Request order successfully sent");
        } else {
          this.errorsList = response["errors"] ? response["errors"] : response["Errors"];
          this.erros(this.errorsList);
          this.commonService.showError(response.message, "Error!");
        }
      },
      (error) => {
        this.errorsList = error.Errors ? error.Errors : error.errors ? error.errors : error.error.errors;
        this.erros(this.errorsList);
      }
    )

  }
  erros(errorsList: any) {
    const modal = this.modal.create<ErrorsComponent>({
      nzWidth: 500,
      nzContent: ErrorsComponent,
      nzFooter: null,
      nzComponentParams: {
        errorsList: errorsList,
      },
    });
    modal.afterClose.subscribe(res => {
      // this.cancelModal();
      // this.router.navigate(['/home/workorders'])
    });
  }
  confirm(message: string): void {
    const modal = this.modal.create<ConfirmPopupComponent>({
      nzWidth: 500,
      nzContent: ConfirmPopupComponent,
      nzFooter: null,
      nzComponentParams: {
        message: message,
      },
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
      this.customerFileName = '';
      this.apiService.getCustomer(event).subscribe(
        (response) => {
          if (response.data.length > 0) {
            this.customerList = response.data;
          }
        },
        (error) => {
          this.errorsList = error.Errors ? error.Errors : error.errors;
          this.erros(this.errorsList);
        })
    }
    if (typeof event === 'number') {

      let obj = this.customerList.find(a => a.customerId == event);
      if (obj) {
        let data = {
          customerName: obj.customerName ? obj.customerName : '---',
          customerAccount: obj.customerId ? obj.customerId : '---',
          customerId: obj.nationalId ? obj.nationalId : '---',
          customerPhone: obj.mobile ? obj.mobile : '---',
          customerAddress: obj.custAddress ? obj.custAddress : '---',
        }
        this.customerDetail.patchValue(data);
        this.customerFileName = obj.identityFile1;
        this.customerAvatarName = obj.customerName ? obj.customerName : '';
      }
    }
  }
  getCustomerGurantor(event: any) {
    if (event.length >= 1) {
      this.guarantorFileName = ''
      this.apiService.getCustomer(event).subscribe(res => {
        if (res.data.length > 0) {
          this.gurantorList = res.data;
        }
      })
    }
    if (typeof event === 'number') {
      let obj = this.gurantorList.find(a => a.customerId == event);
      if (obj) {
        let data = {
          guarantorName: obj.customerName ? obj.customerName : '---',
          guarantorAccount: obj.customerId ? obj.customerId : '---',
          guarantorId: obj.nationalId ? obj.nationalId : '---',
          guarantorPhone: obj.mobile ? obj.mobile : '---',
          guarantorAddress: obj.custAddress ? obj.custAddress : '---',
        }
        this.customerDetail.patchValue(data);
        this.guarantorFileName = obj.identityFile1
        this.guarantorAvatarName = obj.customerName ? obj.customerName : ''
      }
    }
  }
  makeTransferRequest() {

    if (!this.customerId) {
      this.commonService.showError("Please enter your customer", "Error");
      return;
    }
    if (!this.gurantorId) {
      this.commonService.showError("Please enter your Gurantor", "Error");
      return;
    }
    let formData = new FormData();
    formData.append('OrderId', this.data);
    formData.append('NewCustomerID', this.customerId)
    formData.append('NewGuarantorID', this.gurantorId)

    this.apiService.generatePNTransferOrderRequest(formData).subscribe(
      (response) => {
        if (response.isSuccess) {
          this.commonService.showSuccess("Informations updated!", "Success!");
          this.confirm("Transfer Request Successfully Sent");
        } else {
          this.errorsList = response['Errors'] ? response['Errors'] : response['errors'];
          this.erros(this.errorsList);
        }
      },
      (error) => {
        this.errorsList = error.Errors ? error.Errors : error.errors;
        this.erros(this.errorsList);
      })
  }
  disableScheduleRequest() {
    if (this.interestVal === "" || this.interestPer === "" || !this.firstDueDate || !this.noofInstallment)
      return true;
    else
      return false
  }
  getPNOrderDetail() {
    this.apiService.getPNOrders(this.data).subscribe(res => {

      this.getPNremainingAmount = res.data['remainingAmount'];
      console.log(this.getPNremainingAmount)
    });
  }
  pdfView(file: any, data?: any): void {
    const modal = this.modal.create<PDFViewComponent>({
      nzWidth: 600,
      nzContent: PDFViewComponent,
      nzComponentParams: {
        file: file,
        data: data
      },
      // nzViewContainerRef: this.viewContainerRef,
      // nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000)),
      nzFooter: null
    });
    modal.afterClose.subscribe(res => {
      if (res) {
        // this.controls(value, data, obj, res);
      }
    });
  }
  downloadFile(file) {
    this.apiService.downloadFile(file).subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = file;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  }
}
