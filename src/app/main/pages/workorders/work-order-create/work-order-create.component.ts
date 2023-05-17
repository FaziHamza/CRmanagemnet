import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/utility/services/common.service';
import { FormBaseComponent } from 'src/app/utility/shared-component/base-form/form-base.component';

@Component({
  selector: 'app-work-order-create',
  templateUrl: './work-order-create.component.html',
  styleUrls: ['./work-order-create.component.scss']
})
export class WorkOrderCreateComponent extends FormBaseComponent implements OnInit {

  filteredOptions: any[] = [];
  orderForm!: FormGroup;
  editCache: { [key: number]: { edit: boolean; data: any } } = {};
  listOfData: any[] = [];
  pageSize = 6;
  customerId: string;
  grandTotal = 0;
  customerList: any[] = [];
  inputValue: string | null = null;
  constructor(private commonService: CommonService, private apiService: ApiService,
    private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.commonService.breadcrumb = [
      { title: ' Spare Parts', routeLink: '' },
      { title: ' Create Order ', routeLink: 'order' },
    ]
    this.initForm();
    this.getCustomer();
  }
  getCustomer() {
    this.apiService.getCustomer().subscribe(res => {
      if (res.data.length > 0) {
        this.customerList = res.data;
      } else {
        this.customerList = [];
      }
    })
  }
  initForm() {
    this.orderForm = this.formBuilder.group({
      customerName: ['', [Validators.required]],
      mobile: [''],
      nationalId: [''],
      salesNote: [''],
      paymentType: [''],
      cardNo: ['', [Validators.required]],
    });
  }
  get formControls() {
    return this.orderForm.controls;
  }


  startEdit(id: number): void {
    this.editCache[id].edit = true;
  }
  deleteRow(data: any): void {
    const idx = this.listOfData.indexOf(data);
    this.listOfData.splice(idx as number, 1);
    this.updateData();
    this.updateEditCache();
    this.getGrandTotal();
  }
  updateData() {
    this.listOfData = [...this.listOfData];
  }
  cancelEdit(index: number): void {
    this.editCache[index] = {
      data: { ...this.listOfData[index] },
      edit: false
    };
  }

  onChangeName(event: any) {

    let obj = this.customerList.find(a => a.customerName == event);
    this.orderForm.patchValue(obj);
  }
  onChange(value: any, id: any): void {
    if (value.length >= 3) {
      this.apiService.getParts(value).subscribe(res => {
        if (res.isSuccess) {
          if (res.data.length > 0) {
            const newData = res.data.map(item => {
              return {
                ...item,
                partQtyConcat: `${item.part10} - ${item.qty}`
              };
            });
            this.filteredOptions = newData;
          }
        }
      })
    }
    if (typeof value === 'number') {
      let data = this.filteredOptions.find(a => a.id == value);
      if (data) {
        this.editCache[id].data.description = data.description;
        this.editCache[id].data.partQtyConcat = data.partQtyConcat;
        this.editCache[id].data.partNo = data.part10;
        this.editCache[id].data.qty = 1;
        this.editCache[id].data.unitofMeasure = parseFloat(data.price);
        this.editCache[id].data.net = parseFloat(data.price);
        this.editCache[id].data.totalPrice = parseFloat(data.price);
      }
    }
  }
  onChangeQty(value: any, id: any) {
    let data = this.editCache[id].data;
    if (data) {
      this.editCache[id].data.qty = value;
      this.onChangeDiscount(this.editCache[id].data.discount, id);
    }
  }
  onChangeDiscount(value: any, id: any) {
    if (value >= 100) {

    }
    let data = this.editCache[id].data;
    if (data) {
      this.editCache[id].data.net = (this.editCache[id].data.qty * data.unitofMeasure) - ((value / 100) * data.unitofMeasure * this.editCache[id].data.qty);
      this.onChangeTax(this.editCache[id].data.tax, id);
    }
  }
  onChangeTax(value: any, id: any) {
    let data = this.editCache[id].data;
    if (data) {
      this.editCache[id].data.totalPrice = parseFloat(this.editCache[id].data.net) + ((value / 100) * data.unitofMeasure * this.editCache[id].data.qty);
    }
  }
  addRow(): void {
    this.listOfData = [
      ...this.listOfData,
      {
        id: this.listOfData.length + 1,
        partNo: '',
        qty: 1,
        description: '',
        unitofMeasure: 0,
        discount: 0,
        net: 0,
        tax: 0,
        totalPrice: 0
      }
    ];
    this.enableEditCache();
  }
  saveEdit(id: number): void {

    Object.assign(this.listOfData[id], this.editCache[id].data);
    this.editCache[id].edit = false;
    this.getGrandTotal();
  }

  updateEditCache(): void {
    this.listOfData.forEach((item, index) => {
      this.editCache[index] = {
        edit: false,
        data: { ...item }
      };
    });
  }
  enableEditCache(): void {
    this.listOfData.forEach((item, index) => {
      this.editCache[index] = {
        edit: false,
        data: { ...item }
      };
    });
    let item = this.listOfData[this.listOfData.length - 1];
    this.editCache[this.listOfData.length - 1] = {
      edit: true,
      data: { ...item }
    };
  }
  getGrandTotal() {
    let grandTotal = 0;
    for (const item of this.listOfData) {
      grandTotal += parseFloat(item.totalPrice);
    }
    this.grandTotal = grandTotal;
  }
  saveForm() {
    let customerData = this.customerList.find(a => a.customerName == this.orderForm.value.customerName);
    this.orderForm.value['spareParts'] = this.listOfData;
    this.orderForm.value['grandAmount'] = this.grandTotal;
    this.orderForm.value['pnStartDate'] = new Date();
    this.orderForm.value['pnEndDate'] = new Date();
    this.orderForm.value['customerId'] = customerData?.customerId;

    if (this.orderForm.valid) {
      this.apiService.createWorkOrder(this.orderForm.value).subscribe(res => {
        if (res.isSuccess) {
          this.commonService.showSuccess(res.message,"Success");
          this.orderForm.reset();
          this.listOfData = [];
          this.updateEditCache();
          this.getGrandTotal();
        }else{
          this.commonService.showError(res.message,"Error");
        }
      })
    }
    console.log(JSON.stringify(this.orderForm.value))
  }
}
