import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/utility/services/common.service';
import { FormBaseComponent } from 'src/app/utility/shared-component/base-form/form-base.component';

@Component({
  selector: 'app-work-order-create',
  templateUrl: './work-order-create.component.html',
  styleUrls: ['./work-order-create.component.scss']
})
export class WorkOrderCreateComponent implements OnInit {

  filteredOptions: any[] = [];
  orderForm: FormGroup;
  editCache: { [key: number]: { edit: boolean; data: any } } = {};
  listOfData: any[] = [];
  pageSize = 6;
  customerId: string;
  grandTotal = 0;
  customerList: any[] = [];
  inputValue: string | null = null;
  saveSubmitted: boolean = false;
  paymentMethodName: string;
  saveLoader: any = false;
  tableLoader: any = false;
  constructor(private commonService: CommonService, private apiService: ApiService,
    private formBuilder: FormBuilder,private router:Router) {
  }

  ngOnInit() {
    this.commonService.breadcrumb = [
      { title: ' Spare Parts', routeLink: '' },
      { title: ' Create Order ', routeLink: 'order' },
    ]
    this.initForm();
  }

  initForm() {
    this.orderForm = this.formBuilder.group({
      customerName: ['', [Validators.required]],
      mobile: [''],
      nationalId: [''],
      salesNote: [''],
      pnStartDate: [''],
      pnEndDate: [''],
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
    this.listOfData.forEach((record, index) => {
      record.id = index + 1;
    });
    this.listOfData = [...this.listOfData];
  }
  cancelEdit(index: number): void {
    this.editCache[index] = {
      data: { ...this.listOfData[index] },
      edit: false
    };
  }

  onChangeName(event: any) {
    if (event.length >= 3) {
      this.apiService.getCustomer(event).subscribe(res => {
        if (res.data.length > 0) {
          this.customerList = res.data;
        }
      })
    }
    if (typeof event === 'number') {
      let obj = this.customerList.find(a => a.customerId == event);
      if(obj)
        this.orderForm.patchValue(obj);
    }
    
  }
  onChange(value: any, id: any): void {
    if (value.length >= 3) {
      debugger
      this.tableLoader = true;
      this.apiService.getParts(value).subscribe(res => {
        this.tableLoader = false;
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
        this.editCache[id].data.partNo = data.part;
        this.editCache[id].data.qty = 1;
        this.editCache[id].data.tax = 0;
        this.editCache[id].data.discount = 0;
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
    let data = this.listOfData.find(a=>a.partNo == '');
    if(data){
      return this.commonService.showError("Please fill all the products first!","Error");
    }
    const newRow = {
      id: 0,
      partNo: '',
      qty: 1,
      description: '',
      unitofMeasure: 0,
      discount: 0,
      net: 0,
      tax: 0,
      totalPrice: 0
    }
    this.listOfData.unshift(newRow);
    this.updateData();
    this.enableEditCache();
  }
  saveEdit(id: number): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    Object.assign(this.listOfData[index], this.editCache[id].data);
    this.editCache[id].edit = false;
    this.getGrandTotal();
  }

  updateEditCache(): void {
    this.listOfData.forEach((item, index) => {
      this.editCache[index + 1] = {
        edit: false,
        data: { ...item }
      };
    });
  }
  enableEditCache(): void {
    this.listOfData.forEach((item, index) => {
      this.editCache[index + 1] = {
        edit: false,
        data: { ...item }
      };
    });
    let item = this.listOfData[0];
    this.editCache[1] = {
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
    this.orderForm.value['customerId'] = customerData?.customerId;
    this.saveSubmitted = true;
    if (this.listOfData.length == 0) {
      return this.commonService.showError("Please Enter at least one product", "Error");
    }
    if (this.orderForm.valid) {
      this.saveLoader = true;
      this.orderForm.value.pnStartDate = this.orderForm.value.pnStartDate ? this.orderForm.value.pnStartDate : new Date();
      this.orderForm.value.pnEndDate = this.orderForm.value.pnEndDate ? this.orderForm.value.pnEndDate : new Date();
      this.apiService.createWorkOrder(this.orderForm.value).subscribe(res => {
        if (res.isSuccess) {
          this.saveLoader = false;
          this.commonService.showSuccess("Data save successfully..!","Success");
          this.router.navigateByUrl('home/allorder')
          this.orderForm.reset();
          this.listOfData = [];
          this.updateEditCache();
          this.getGrandTotal();
        }else{
          this.saveLoader = false;
          this.commonService.showError("found some error..!","Error");
        }
      })
    }
    console.log(JSON.stringify(this.orderForm.value))
  }
}
