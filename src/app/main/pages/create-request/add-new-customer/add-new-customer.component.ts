import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewFileComponent } from '../../../../shared/module/view-file/view-file.component';
import { ApiService } from '../../../../shared/services/api.service';
import { CommonService } from '../../../../utility/services/common.service';
import { PDFViewComponent } from '../../pdfview/pdfview.component';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-add-new-customer',
  templateUrl: './add-new-customer.component.html',
  styleUrls: ['./add-new-customer.component.scss']
})
export class AddNewCustomerComponent {
  @Input() data;
  responseMessage;
  isSubmitted = false;
  isNewCustomer = false;
  isIndividual = true;
  customerList = [];
  formGroup: FormGroup;
  selectedCustomer: number = 0;
  selectedItem;
  titleList = [/*{ value: 0, text: 'Messrs' }, */{ value: 1, text: 'Mr.' }, { value: 2, text: 'Ms.' }, { value: 11, text: 'Dr.' }, { value: 12, text: 'Eng.' }];
  @Output() sendData = new EventEmitter();
  uploadedFile
  @ViewChild('fileInput') inputRef: ElementRef<any>;

  constructor(private fb: FormBuilder, public _activeModal: NgbActiveModal,
    private modal: NzModalService,
    private _apiService: ApiService,
    private _commonService: CommonService,
    private _modalService: NgbModal,
  ) { }
  ngOnInit() {
    this.initCustomerForm();
    this.updateCustomer();
    this.getAddressList();
  }
  addressList: any[] = []
  getAddressList() {
    this._apiService.getStatusLookup(5).subscribe(res => {
      if (res.isSuccess) {
        this.addressList = res.data || [];
      }
    })
  }
  updateCustomer() {
    let customer = this.data?.customerInfo;

    if (customer?.customerId) {
      this.isIndividual = customer?.customerCategory == 1 && true || false;
      this.handleCetegoryChange(customer?.customerCategory);
      let obj = {
        title: customer?.customerTitle,
        fname: customer?.customerCategory == 1 && customer?.customerName1 || customer?.customerName,
        sname: customer?.customerName2,
        thName: customer?.customerName3,
        fourthName: customer?.customerName4,
        gender: customer?.gender,
        customerCategory: '' + customer?.customerCategory,
        nationalId: customer?.nationalID,
        address: customer?.address,
        mobile: customer?.mobile,
        customerId: customer?.customerId,
        image: customer.idImage,
      }
      this.formGroup.patchValue(obj);
      if (customer.idImage)
        this.convertFile(customer.idImage)
    }
  }
  checkFileUploaded: boolean = false;
  convertFile(file) {
    this.uploadedFile = file;
    this.checkFileUploaded = false;
    // this._apiService.downloadFile(file).subscribe((fileBlob: Blob) => {
    //   const fileUrl = URL.createObjectURL(fileBlob);
    // })
  }
  initCustomerForm() {
    this.formGroup = this.fb.group({
      customerId: [''],
      title: [null, [Validators.required]],
      nationalId: ['', [Validators.required]],
      address: [null, [Validators.required]],
      image: ['', [Validators.required]],
      fname: ['', [Validators.required, Validators.pattern('^[\u0600-\u06FFa-zA-Z\\s]+$')]],
      sname: ['', [Validators.required, Validators.pattern('^[\u0600-\u06FFa-zA-Z\\s]+$')]],
      thName: ['', [Validators.required, Validators.pattern('^[\u0600-\u06FFa-zA-Z\\s]+$')]],
      fourthName: ['', [Validators.required, Validators.pattern('^[\u0600-\u06FFa-zA-Z\\s]+$')]],
      gender: ['0'],
      customerCategory: ['1'],
      mobile: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(10)]],
    })
  }
  handleCetegoryChange(value) {
    this.isIndividual = value == 1 ? true : false;
    if (this.isIndividual) {
      this.f.get('title').setValidators([Validators.required]);
      this.f.get('title').updateValueAndValidity();
      this.f.get('sname').setValidators([Validators.required, Validators.pattern('^[\u0600-\u06FFa-zA-Z\\s]+$')]);
      this.f.get('sname').updateValueAndValidity();
      this.f.get('thName').setValidators([Validators.required, Validators.pattern('^[\u0600-\u06FFa-zA-Z\\s]+$')]);
      this.f.get('thName').updateValueAndValidity();
      this.f.get('fourthName').setValidators([Validators.required, Validators.pattern('^[\u0600-\u06FFa-zA-Z\\s]+$')]);
      this.f.get('fourthName').updateValueAndValidity();
    }
    else {
      this.f.get('title').clearValidators();
      this.f.get('title').updateValueAndValidity();
      this.f.get('sname').clearValidators();
      this.f.get('sname').updateValueAndValidity();
      this.f.get('thName').clearValidators();
      this.f.get('thName').updateValueAndValidity();
      this.f.get('fourthName').clearValidators();
      this.f.get('fourthName').updateValueAndValidity();
    }
  }
  fileChange(event) {
    this.checkFileUploaded = true;
    let files = [...event.target.files];
    if (files.length > 0) {
      let isInvalid = this._commonService.checkInvalidImageFormat(files);
      if (!isInvalid) {
        files.forEach((file: File) => {
          this._commonService.fileToBase64(file).then(response => {
            this.uploadedFile = response;
            console.log(this.uploadedFile);
            this.formGroup.get('image')?.setValue(response['fileName']);
          })
        })
      }
    }
  }
  fileAction(action) {
    if (this.checkFileUploaded) {
      if (action == 'view') {
        const modelRef = this._modalService.open(ViewFileComponent, {
          size: 'md',
        })
        modelRef.componentInstance.imageUploadedView = this.uploadedFile;
      }
      else {
        this.inputRef.nativeElement.value = null;
        this.formGroup.get('image')?.setValue('');
        this.uploadedFile = null;
      }
    } else {
      this.pdfView(this.uploadedFile);
    }

  }
  removeByIndex(str, index) {
    return str.slice(0, index) + str.slice(index + 1);
  }
  pdfView(file: any, data?: any): void {
    const modelRef = this._modalService.open(PDFViewComponent, {
      size: 'md',
    })
    modelRef.componentInstance.file = file;
    modelRef.componentInstance.data = data;
  }
  saveCustomer() {
    ;
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    else {
      this.isSubmitted = true;
      let formData = new FormData();
      let values = this.formGroup.value;
      let mobile = values?.mobile;
      if (mobile.charAt(0) == 0) {
        mobile = this.removeByIndex(values?.mobile, 0);
      }
      values = { ...values, customerCategory: +values?.customerCategory, gender: +values?.customerCategory, mobile: `962${mobile}` }
      if (this.isIndividual) {
        formData.append("Title", values?.title);
        formData.append("Fname", values?.fname);
        formData.append("Sname", values?.sname);
        formData.append("ThName", values?.thName);
        formData.append("FourthName", values?.fourthName);
        formData.append("Gender", values?.gender);
      }
      formData.append("Mobile", values?.mobile);
      formData.append("CustomerCategory", values.customerCategory);
      formData.append("CorporateName", values?.fname);
      formData.append("Address", values?.address);
      formData.append("NationalID", values?.nationalId);
      formData.append("ImageFile", this.checkFileUploaded && this.uploadedFile.file || this.uploadedFile);
      if (this.data?.customerInfo?.customerId) {
        formData.append("CustomerNo", this.data?.customerInfo?.customerId);
      }
      this._apiService.addMarkaziaCustomer(formData).subscribe(response => {
        this.isSubmitted = false;
        if (response.isSuccess) {
          this.sendData.emit(response.data)
          this._activeModal.close();
        }
        else if (!response.isSuccess) {
          this.isSubmitted = false;
          this.sendData.emit(false)
          this.responseMessage = response.errors[0]?.ErrorMessageEn;
          setTimeout(() => {
            this.responseMessage = '';
          }, 5000)
        }
      })
    }
  }
  selectCustomer(item) {
    this.selectedItem = item;
    this.selectedCustomer = item?.customerNo;
  }
  handleSelect() {
    let data = { customerNo: this.selectedItem?.customerNo, corporateName: this.selectedItem?.customerName, mobile: this.selectedItem?.customerPhone }
    this.sendData.emit(data);
    this._activeModal.close();
  }
  addNewCustomer() {
    this.isNewCustomer = true;
  }
  goBack() {
    this.isNewCustomer = false;
  }
  get f() {
    return this.formGroup;
  }
}
