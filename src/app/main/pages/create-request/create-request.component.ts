import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/shared/services/api.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CommonService } from 'src/app/utility/services/common.service';
import { DatePipe } from '@angular/common';
import { ConfirmPopupComponent } from '../common/confirm-popup/confirm-popup.component';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorsComponent } from '../common/errors/errors.component';
import { PDFViewComponent } from '../pdfview/pdfview.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddNewCustomerComponent } from './add-new-customer/add-new-customer.component';
import { MessageModalComponent } from '../../../shared/module/message-modal/message-modal.component';
import { ViewFileComponent } from '../../../shared/module/view-file/view-file.component';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.scss']
})
export class CreateRequestComponent implements OnInit {
  @Input() data: any;
  statusList: any[] = [];
  @Input() statusType = '';
  // interestPer: any = "";
  // noofInstallment: any;
  // firstDueDate: any;
  errorsList: any[] = [];
  // interestVal: any = "";
  remainingAmount = 0;
  rescheduleType = 0;
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
  rescheduleDetail: FormGroup;
  searchInput$ = new Subject<any>();
  searchInputGurantor$ = new Subject<any>();
  transferOrderRequestForm: FormGroup;
  totalRemainingAmount = 0;
  customerType: number;
  @ViewChild('fileInput') inputRef: ElementRef<any>;
  @ViewChild('fileInput1') inputRef1: ElementRef<any>;
  uploadedFile;
  uploadedFile1;
  enter: boolean;
  enter1: boolean;
  selctedCustomerInfo;
  selctedGuranteeeInfo;
  constructor(private modal: NzModalService, private apiService: ApiService,
    private formBuilder: FormBuilder, private activeModel: NzModalRef,
    private _modalService: NgbModal,
    private datePipe: DatePipe, private router: Router,
    public commonService: CommonService) { }

  ngOnInit(): void {
    this.initReschedule();
    this.getCustomerList();
    this.initTransferOrderRequestForm();
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
      });
    this.getPNOrderDetail();
    this.getCMSSetup();
    this.getPNOrderAllNotes();

    // if(this.statusType == 'Reschedule Request')
  }
  headerList = [
    {
      key: 'pnBookNoteId',
      title: 'PN No'
    },
    {
      key: 'pnBookNoteSerial',
      title: 'PN Serial'
    },
    {
      key: 'pnAmount',
      title: 'PN Amount'
    },
    {
      key: 'remainingAmount',
      title: 'PN Remaining Amount'
    }
  ]
  pNOrderAllNotesList: any[] = [];
  numberOfSelectedNotes: any[] = [];
  checkedValues(values) {
    this.numberOfSelectedNotes = [...values];
    // this.calculateInterestValue();
  }
  getPNOrderAllNotes() {
    let params = `?PNOrderId=${this.data}&UnCollectedOnly=true&DueOverDueOnly=false&pageNo=0&pageSize=1000`;
    this.apiService.getPNOrderAllNotes(params).subscribe(response => {
      console.log("response.data : " + response.data);
      this.pNOrderAllNotesList = response.data
    })
  }
  initReschedule() {
    this.rescheduleDetail = this.formBuilder.group({
      noofInstallment: [0, [Validators.required ,this.greaterThanZeroValidator()]],
      firstDueDate: ['', Validators.required],
      interestPer: [0, [Validators.required, this.percentageValidator]],
      interestVal: [0, Validators.required]
    });
  }
  percentageValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (value === null || value === undefined || value < 0 || value > 100) {
      return { invalidPercentage: true };
    }

    return null;
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
  initTransferOrderRequestForm() {
    this.transferOrderRequestForm = this.formBuilder.group({
      noOfInstallment: [''],
      newDate: [''],
      transferingAmount: [''],
      interestRate: [''],
      interestValue: [''],
      transferFees: [0, [Validators.required, this.greaterThanZeroValidator()]],
    })
  }
  greaterThanZeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value <= 0) {
        return { greaterThanZero: true };
      }
      return null;
    };
  }
  onChangeName(event: any) {
    this.getCustomer(event);
    //this.searchInput$.next(event);
  }
  fileAction(action, index) {
    if (action == 'view') {
      const modelRef = this._modalService.open(ViewFileComponent, {
        size: 'md',
      })
      modelRef.componentInstance.imageUploadedView = (index == 1) && this.uploadedFile || this.uploadedFile1;
    }
    else {
      (document.getElementById('inputFile' + index) as HTMLInputElement).value = null
      //this.inputRef.nativeElement.value = null;
      if (index == 1) {
        this.customerDetail.get('customerAttachment').setValue('');
        this.uploadedFile = null;
      }
      else {
        this.customerDetail.get('guarantorAttachment').setValue('');
        this.uploadedFile1 = null;
      }
    }
  }
  onSelectFile(event: any, index) {
    let files = [...event.target.files];
    let isInvalid = this.commonService.checkInvalidImageFormat(files);
    if (isInvalid) {
      (document.getElementById('inputFile' + index) as HTMLInputElement).value = null
      return;
    }
    if (files.length > 0) {
      if (!isInvalid) {
        files.forEach((file: File) => {
          if (index == 1) this.customerDetail.get('customerAttachment').setValue(file.name);
          else this.customerDetail.get('guarantorAttachment').setValue(file.name);
          this.commonService.fileToBase64(file).then(response => {
            if (index == 1) this.uploadedFile = response;
            else this.uploadedFile1 = response;
          })
        })
      }
    }
  }
  filesDropped(data: any, index) {
    if (index == 1) this.enter = false;
    else this.enter1 = false;
    let isInvalid = this.commonService.checkInvalidImageFormat(data);
    if (isInvalid) {
      (document.getElementById('inputFile' + index) as HTMLInputElement).value = null
      return;
    }
    let files = data.map(x => {
      return x.file
    })
    if (!isInvalid) {
      files.forEach((file: File) => {
        if (index == 1) this.customerDetail.get('customerAttachment').setValue(file.name);
        else this.customerDetail.get('guarantorAttachment').setValue(file.name);
        this.commonService.fileToBase64(file).then(response => {
          if (index == 1) this.uploadedFile = response;
          else this.uploadedFile1 = response;
        })
      })
    }
  }
  getCustomerList() {
    this.apiService.getCustomerList().subscribe(response => {
      if (response.data.length > 0) {
        this.customerList = response.data;
      }
    })
  }
  updateCustomerInfo(type) {
    let selectedCustomer: any;
    if (type == 1) {
      selectedCustomer = JSON.parse(JSON.stringify(this.selctedCustomerInfo));
    } else {
      selectedCustomer = JSON.parse(JSON.stringify(this.selctedGuranteeeInfo));
    }
    selectedCustomer.mobile = selectedCustomer?.mobile?.split('962')[1];
    const modalRef = this._modalService.open(AddNewCustomerComponent, { size: 'lg' });
    modalRef.componentInstance.data = { customerInfo: selectedCustomer };
    modalRef.componentInstance.sendData.subscribe(x => {
      if (x) {
        this.responseModal('success', 'Data saved successfully')
        if (type == 1) {
          const obj = {
            customerName: x.corporateName,
            customerAccount: x.customerNo,
            customerId: x.nationalID,
            customerPhone: x.mobile,
            customerAddress: x.address,
            customerAttachment: x.imageFilePath,
          }
          this.customerDetail.patchValue(obj);
          this.convertFile(x.imageFilePath, 1);
        } else if (type == 2) {
          const obj = {
            guarantorName: x.corporateName,
            guarantorAccount: x.customerNo,
            guarantorId: x.nationalID,
            guarantorPhone: x.mobile,
            guarantorAddress: x.address,
            guarantorAttachment: x.imageFilePath,
          }
          this.customerDetail.patchValue(obj);
          this.convertFile(x.imageFilePath, 2);

        }
        this.getCustomerList();
        // let findCustomer  = this.customerList.find(a=>a.customerId == x.customerNo);
        // if(findCustomer){
        //   findCustomer.customerName = x.corporateName
        //   findCustomer.mobile = x.mobile;
        //   findCustomer.customerName1 = x.fname;
        //   findCustomer.customerName2 = x.sname;
        //   findCustomer.customerName3 = x.thName;
        //   findCustomer.customerName4 = x.fourthName;
        //   findCustomer.customerCategory = x.customerCategory;
        //   findCustomer.customerTitle = x.corporateName;
        //   findCustomer.address = x.address;
        //   findCustomer.nationalID = x.nationalID;
        //   findCustomer.idImage = x.imageFilePath;
        //   findCustomer.gender = x.gender;
        // }
      }
      else if (!x) this.responseModal('error', x.errors[0].ErrorMessageEn);
    });
    console.log(selectedCustomer);
    return;
    let customerValues, guarantorValues;
    let formData = new FormData();
    if (this.customerType == 1) {
      guarantorValues = null;
      customerValues = this.customerDetail.value;
      formData.append("ImageFile", this.uploadedFile);
    }
    else {
      customerValues = null;
      guarantorValues = this.customerDetail.value;
      formData.append("ImageFile", this.uploadedFile);
    }
    formData.append("CustomerNo", customerValues?.customerAccount || guarantorValues?.guarantorAccount);
    formData.append("Name", customerValues?.customerName || guarantorValues?.guarantorName);
    formData.append("Mobile", customerValues?.customerPhone || guarantorValues?.guarantorPhone);
    formData.append("NationalID", customerValues?.customerId || guarantorValues?.guarantorId);
    formData.append("Address", customerValues?.customerAddress || guarantorValues?.guarantorAddress);
    this.apiService.addMarkaziaCustomer(formData).subscribe(x => {
      if (x.data) this.responseModal('success', 'Data saved successfully');
      else if (!x.data) this.responseModal('error', x.errors[0].ErrorMessageEn);
    })
  }
  responseModal(type, message, autoCloseDelay?) {
    const modalRef = this._modalService.open(MessageModalComponent, { centered: true });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.autoCloseDelay = autoCloseDelay;
  }
  onSelection(event, type) {
    this.customerType = type;
    let x = event;
    let obj;
    if (type == 1) {
      this.selctedCustomerInfo = event;
      obj = {
        customerName: x?.customerName || x?.corporateName,
        customerAccount: x.customerId,
        customerId: x.nationalID,
        customerPhone: x.mobile,
        customerAddress: x.address,
        customerAttachment: x.idImage,
      }
      this.convertFile(x.idImage, 1);
      this.customerAvatarName = obj.customerName

    }
    else {
      this.selctedGuranteeeInfo = event;
      obj = {
        guarantorName: x?.customerName || x?.corporateName,
        guarantorAccount: x.customerId,
        guarantorId: x.nationalID,
        guarantorPhone: x.mobile,
        guarantorAddress: x.address,
        guarantorAttachment: x.idImage,
      }
      this.convertFile(x.idImage, 2);
      this.guarantorAvatarName = obj.guarantorName;

    }
    this.customerDetail.patchValue(obj);

  }

  getCustomer(event: any) {
    if (event.length >= 1) {
      this.customerFileName = '';
      this.apiService.getCustomer(event).subscribe((response) => {
        if (response.data.length > 0) {
          this.customerList = response.data;
        }
      },
        (error) => {
          this.errorsList = error.Errors ? error.Errors : error.errors;
          this.erros(this.errorsList);
        })
    }
  }
  addNewCustomer(type) {
    const modalRef = this._modalService.open(AddNewCustomerComponent, { size: 'lg' });
    modalRef.componentInstance.sendData.subscribe(x => {
      console.log(x);
      let obj;
      let customerName = (`${x.fname} ${x.sname} ${x.thName} ${x.fourthName}`)
      if (type == 1) {
        obj = {
          customerName: customerName || x.corporateName,
          customerAccount: x.customerNo,
          customerId: x.nationalID,
          customerPhone: x.mobile,
          customerAddress: x.address,
          customerAttachment: x.imageFilePath,
        }
      }
      else {
        obj = {
          guarantorName: customerName || x.corporateName,
          guarantorAccount: x.customerNo,
          guarantorId: x.nationalID,
          guarantorPhone: x.mobile,
          guarantorAddress: x.address,
          guarantorAttachment: x.imageFilePath,
        }
      }
      this.customerDetail.patchValue(obj);
    })
  }
  getCMSSetup() {
    this.apiService.getCMSSetup().subscribe(response => {
      console.log(response);
      if (response.isSuccess) {
        this.transferOrderRequestForm.controls['transferFees'].setValue(response.data[0]?.transferFees)
      }
    })
  }
  calcInterest(event) {
    let value = +event.target.value;
    let transferAmount = +this.transferOrderRequestForm.get('transferingAmount').value;
    if (value > 0) {
      let interest = (transferAmount / 100 * value)
      this.transferOrderRequestForm.get('interestValue').setValue(interest);
    } else this.transferOrderRequestForm.get('interestValue').setValue('')
  }
  calcPercentage(event) {
    let value = +event.target.value;
    if (value > 0) {
      let transferAmount = +this.transferOrderRequestForm.get('transferingAmount').value;
      this.transferOrderRequestForm.get('interestRate').setValue((value / transferAmount * 100).toFixed(3))
    }
    else this.transferOrderRequestForm.get('interestRate').setValue('')
  }
  viewResult() {
    this.totalRemainingAmount = this.transferOrderRequestForm.get('transferingAmount').value +
      this.transferOrderRequestForm.get('transferFees').value +
      this.transferOrderRequestForm.get('interestValue').value;
    // if (this.rescheduleType == 0) {

    // } else {

    //   const selectedObjects = this.pNOrderAllNotesList.filter(obj => this.numberOfSelectedNotes.includes(obj.pnBookNoteId));
    //   const sumOfAmounts = selectedObjects.reduce((sum, obj) => sum + obj.remainingAmount, 0);
    //   this.remainingAmount = sumOfAmounts + this.rescheduleDetail.get('interestVal').value;
    // }

  }
  makeStatusList() {
    this.apiService.getStatusLookup(24).subscribe(res => {
      if (res.isSuccess) {
        this.statusList = res.data.filter(x => x.id == 24001 || x.id == 24002);
      }
    })
  }
  cancelModal() {
    this.modal.closeAll();
  }

  close() {
    this.activeModel.close();
  }
  closeTrue() {
    this.activeModel.close(true);
  }
  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) <= 0;


  getPNOrderRemainingAmountforRescheduling() {
    if (this.rescheduleType == 0) {
      this.apiService.getPNOrderRemainingAmountforRescheduling(this.data, this.rescheduleDetail.value?.interestPer, this.rescheduleDetail.value?.interestVal).subscribe(
        (resposnse) => {
          if (resposnse.isSuccess) {
            this.remainingAmount = resposnse.data;
          }
        },
        (error) => {
          this.errorsList = error.Errors ? error.Errors : error.errors ? error.errors : error.error.errors;
          this.erros(this.errorsList);
        }
      )
    } else {
      const selectedObjects = this.pNOrderAllNotesList.filter(obj => this.numberOfSelectedNotes.includes(obj.pnBookNoteId));
      const sumOfAmounts = selectedObjects.reduce((sum, obj) => sum + obj.remainingAmount, 0);
      this.remainingAmount = sumOfAmounts + this.rescheduleDetail.get('interestVal').value;
    }

  }
  saveRequestApproval() {
    this.errorsList = [];
    if (!this.rescheduleDetail.value?.firstDueDate) {
      this.commonService.showError("Please select a New First Due Date", "Error");
      return;
    }
    if (!this.rescheduleDetail.value?.noofInstallment) {
      this.commonService.showError("Please select a New No. of Installment", "Error");
      return;
    }
    const fromDate = new Date(this.rescheduleDetail.value?.firstDueDate);
    const formattedFromDate = fromDate.toISOString();
    if(this.rescheduleDetail.valid){
      this.stepSaveLoader = true;
      if (this.rescheduleType == 0) {
        let formData = new FormData();
        formData.append('OrderId', this.data);
        formData.append('NewInstallmentsNumber', parseInt(this.rescheduleDetail.value?.noofInstallment).toString());
        formData.append('NewFirstDueDate', formattedFromDate);
        formData.append('InterestPercentage', this.rescheduleDetail.value?.interestPer.toString());
        formData.append('InterestValue', this.rescheduleDetail.value?.interestVal.toString());
        formData.append('GuarantorId', this.customerDetail.value?.guarantorAccount);
        this.apiService.generatePNRescheduleOrderRequest(formData).subscribe(
          (response) => {
            this.stepSaveLoader = false;
            if (response.isSuccess) {
              this.commonService.showSuccess("Informations updated!", "Success!");
              // this.cancelModal();
              this.confirm("Request order successfully sent");
              this.router.navigate(['/home/workorders'])

            } else {
              this.errorsList = response["errors"] ? response["errors"] : response["Errors"];
              this.erros(this.errorsList);
              this.commonService.showError(response.message, "Error!");
            }
          },
          (error) => {
            this.stepSaveLoader = false;
            this.errorsList = error.Errors ? error.Errors : error.errors ? error.errors : error.error.errors;
            this.erros(this.errorsList);
          }
        )
      } else if (this.rescheduleType == 1) {
        let obj = {
          "orderId": this.data,
          "newInstallmentsNumber": parseInt(this.rescheduleDetail.value?.noofInstallment).toString(),
          "newFirstDueDate": formattedFromDate,
          "interestPercentage": this.rescheduleDetail.value?.interestPer.toString(),
          "interestValue": this.rescheduleDetail.value?.interestVal.toString(),
          "guarantorId": this.customerDetail.value?.guarantorAccount,
          "pnNotesIds": this.numberOfSelectedNotes
        }
        if(!this.customerDetail.value?.guarantorAccount)
            delete obj.guarantorId;
          
        this.apiService.generatePNPartialRescheduleOrderRequest(obj).subscribe(
          (response) => {
            this.stepSaveLoader = false;
            if (response.isSuccess) {
              this.commonService.showSuccess("Informations updated!", "Success!");
              // this.cancelModal();
              this.confirm("Request order successfully sent");
              this.router.navigate(['/home/workorders'])

            } else {
              this.errorsList = response["errors"] ? response["errors"] : response["Errors"];
              this.erros(this.errorsList);
              this.commonService.showError(response.message, "Error!");
            }
          },
          (error) => {
            this.stepSaveLoader = false;
            this.errorsList = error.Errors ? error.Errors : error.errors ? error.errors : error.error.errors;
            this.erros(this.errorsList);
          }
        )
      }
    }

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
  stepSaveLoader: boolean = false;
  makeTransferRequest() {
    this.stepSaveLoader = true;
    let formData = new FormData();
    formData.append('OrderId', this.data);
    formData.append('NewCustomerID', this.customerDetail.get('customerAccount').value)
    formData.append('NewGuarantorID', this.customerDetail.get('guarantorAccount').value);
    formData.append('TransferFees', this.transferOrderRequestForm.get('transferFees').value);
    if (this.transferOrderRequestForm.valid)
      this.apiService.generatePNTransferOrderRequest(formData).subscribe((response) => {
        this.stepSaveLoader = false;
        if (response.data) this.responseModal('success', 'Transfer Request Successfully Sent', 3);
        else if (!response.data) this.responseModal('error', response.errors[0].ErrorMessageEn);
        if (response.data) {
          setTimeout(() => {
            this.stepSaveLoader = false;
            this.activeModel.close();
            this.commonService.loadRequestTab = true;
            this.commonService.selectedWorkorder = 1;
            this.router.navigate(['/home/workorders'])

          }, 3000);
        }
      },
        (error) => {
          this.stepSaveLoader = false;
          this.errorsList = error.Errors ? error.Errors : error.errors;
          this.erros(this.errorsList);
        })
  }

  orderDetail: any;
  getPNOrderDetail() {
    this.apiService.getPNOrders(this.data).subscribe(res => {
      this.orderDetail = res.data;
      this.getPNremainingAmount = res.data['remainingAmount'];
      this.transferOrderRequestForm.controls['transferingAmount'].setValue(res.data['remainingAmount'])
      console.log(this.getPNremainingAmount)
    });
  }
  pdfView(file: any, data?: any): void {
    const modelRef = this._modalService.open(PDFViewComponent, {
      size: 'md',
    })
    modelRef.componentInstance.file = file;
    modelRef.componentInstance.data = data;
  }
  downloadFile(file) {
    // this.apiService.downloadFile(file).subscribe(response => {
    const blob = new Blob([file], { type: 'application/pdf' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = file;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    // });
  }
  inputvalue(value, type) {
    let checkPoint = false;
    const inputValue = value?.target?.value;
    if (inputValue && inputValue.includes('.')) {
      const parts = inputValue.split('.');
      if (parts.length === 2 && parts[1].length > 0) {
        if (inputValue === '0.0' || parts[1] == '0')
          checkPoint = true;
        else if (inputValue === '0.00' || parts[1] == '00')
          checkPoint = true;
        else checkPoint = false;
      } else if (parts.length === 2 && parts[1].length === 0) {
        checkPoint = true;
      } else {
        checkPoint = false;
      }
    }
    let partValue2 = '0';
    if (!checkPoint) {
      partValue2 = String(value?.target?.value || 0)
      const numericPartValue2 = parseFloat(partValue2);
      if (type == 1) {
        if (!isNaN(numericPartValue2)) {
          let invoiceDiscountAmount1 = parseFloat(numericPartValue2.toFixed(3));
          this.transferOrderRequestForm.patchValue({ transferFees: invoiceDiscountAmount1 });

        } else {
          this.transferOrderRequestForm.patchValue({ transferFees: null });
        }
      }
      else if (type == 2) {
        if (!isNaN(numericPartValue2)) {
          let invoiceDiscountAmount1 = parseFloat(numericPartValue2.toFixed(3));
          if (this.rescheduleType == 1) {
            this.calculateInterestValue(invoiceDiscountAmount1, 2);
          } else {
            let amount = parseFloat(((this.getPNremainingAmount * invoiceDiscountAmount1) / 100).toFixed(3));
            this.rescheduleDetail.patchValue({ interestPer: invoiceDiscountAmount1, interestVal: amount })
          }
        } else {
          this.rescheduleDetail.patchValue({ interestPer: null, interestVal: null });
        }
      }
      else if (type == 3) {
        if (!isNaN(numericPartValue2)) {
          let invoiceDiscountAmount1 = parseFloat(numericPartValue2.toFixed(3));
          if (this.rescheduleType == 1) {
            this.calculateInterestValue(invoiceDiscountAmount1, 3);
          } else {
            let interestPer = parseFloat(((invoiceDiscountAmount1 * 100) / this.getPNremainingAmount).toFixed(3));
            this.rescheduleDetail.patchValue({ interestVal: invoiceDiscountAmount1, interestPer: interestPer })
          }

        } else {
          this.rescheduleDetail.patchValue({ interestVal: null, interestPer: null });
        }
      }
    }
  }

  calculateInterestValue(calAmount?: any, type?) {
    if (this.rescheduleType == 1) {
      const selectedObjects = this.pNOrderAllNotesList.filter(obj => this.numberOfSelectedNotes.includes(obj.pnBookNoteId));
      const sumOfAmounts = selectedObjects.reduce((sum, obj) => sum + obj.remainingAmount, 0);
      if (type == 2) {
        let amount = parseFloat(((sumOfAmounts * calAmount) / 100).toFixed(3));
        this.rescheduleDetail.patchValue({ interestPer: calAmount, interestVal: amount })
      }
      else if (type == 3) {
        let interestPer = parseFloat(((calAmount * 100) / sumOfAmounts).toFixed(3));
        this.rescheduleDetail.patchValue({ interestVal: calAmount, interestPer: interestPer })
      } else {
        let amount = parseFloat(((sumOfAmounts * this.rescheduleDetail.value?.interestPer) / 100).toFixed(3));
        // let interestPer = parseFloat(((calAmount * 100) / sumOfAmounts).toFixed(3));
        this.rescheduleDetail.patchValue({ interestVal: amount })
      }
    }
  }
  convertFile(file, type) {
    if (type == 1)
      this.uploadedFile = file
    else
      this.uploadedFile1 = file
    // this.apiService.downloadFile(file).subscribe((fileBlob: Blob) => {
    //   const fileUrl = URL.createObjectURL(fileBlob);
    //   if (type == 1)
    //     this.uploadedFile = fileUrl
    //   else
    //     this.uploadedFile1 = fileUrl
    // })
  }
}
