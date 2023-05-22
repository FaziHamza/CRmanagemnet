import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/utility/services/common.service';

@Component({
  selector: 'app-work-order-create',
  templateUrl: './work-order-create.component.html',
  styleUrls: ['./work-order-create.component.scss'],
})
export class WorkOrderCreateComponent implements OnInit {
  searchInput$ = new Subject<any>();
  searchPartNo$ = new Subject<any>();
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
  taxList: any[] = [];
  errorsList: any[] = [];
  constructor(private commonService: CommonService, private apiService: ApiService,
    private formBuilder: FormBuilder, private router: Router) {
  }

  ngOnInit() {
    this.commonService.breadcrumb = [
      { title: ' Spare Parts', routeLink: '' },
      { title: ' Create Order ', routeLink: 'order' },
    ]
    this.initForm();
    this.getTaxLookup();
    this.searchInput$
      .pipe(debounceTime(500)) // Adjust the debounce time as needed
      .subscribe(value => {
        this.getCustomer(value);
      });
    this.searchPartNo$
      .pipe(debounceTime(500)) // Adjust the debounce time as needed
      .subscribe(value => {
        this.getPartNo(value.value, value.id);
      });
  }
  getTaxLookup() {
    this.apiService.getStatusLookup(23).subscribe(res => {
      if (res.isSuccess) {
        this.taxList = res.data;
      } else {
        this.taxList = [];
      }
    })
  }
  initForm() {
    this.orderForm = this.formBuilder.group({
      customerName: ['', [Validators.required]],
      mobile: [''],
      nationalId: [''],
      salesNote: ['', [Validators.maxLength(150)]],
      pnStartDate: [''],
      pnEndDate: [''],
      paymentType: ['', [Validators.required]],
      // cardNo: [''],
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
    this.searchInput$.next(event);
  }
  getCustomer(event: any) {
    if (event.length >= 2) {
      this.apiService.getCustomer(event).subscribe(res => {
        if (res.data.length > 0) {
          this.customerList = res.data;
        }
      })
    }
    if (typeof event === 'number') {
      let obj = this.customerList.find(a => a.customerId == event);
      if (obj)
        this.orderForm.patchValue(obj);
    }
  }
  onChange(value: any, id: any): void {
    let obj = {
      value: value,
      id: id
    }
    this.searchPartNo$.next(obj);
  }
  getPartNo(value: any, id: any) {
    if (value.length >= 3) {
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


        this.avalaibeQty = this.getLastDigit(data.partQtyConcat);
        //  this.avalaibeQty= parseInt(data.partQtyConcat.split('-')[2]);
        this.editCache[id].data.description = data.description;
        this.editCache[id].data.partQtyConcat = data.partQtyConcat;
        this.editCache[id].data.partNo = data.part;
        this.editCache[id].data.qty = 1;
        this.editCache[id].data.tax = 0;
        this.editCache[id].data.discount = 0;
        this.editCache[id].data.allowTax = data.tax;
        this.editCache[id].data.total = parseFloat(data.price);
        this.editCache[id].data.unitofMeasure = parseFloat(data.price);
        this.editCache[id].data.net = parseFloat(data.price);
        this.editCache[id].data.totalPrice = parseFloat(data.price);
      }
    }
  }

  getLastDigit = (str) => {
    const lastIndex = str.lastIndexOf('-');
    const lastDigit = str.substring(lastIndex + 1).trim();
    return lastDigit;
  };
  onChangeQty(value: any, id: any) {
    let data = this.editCache[id].data;
    if (data) {

      this.editCache[id].data.qty = value;
      this.editCache[id].data.total = value * this.editCache[id].data.unitofMeasure;
      this.onChangeDiscount(this.editCache[id].data.discount, id);
    }
  }
  avalaibeQty: number = -1;
  onChangeDiscount(value: any, id: any) {
    if (value >= 100) {

    }
    let data = this.editCache[id].data;
    if (data) {
      this.editCache[id].data.net = (this.editCache[id].data.qty * data.unitofMeasure) - ((value / 100) * this.editCache[id].data.total);
      this.onChangeTax(this.editCache[id].data.tax, id);
    }
  }
  onChangeTax(value: any, id: any) {
    let data = this.editCache[id].data;
    if (data) {
      var textvalue = this.editCache[id].data.net.toFixed(3) * parseFloat(value) / 100;
      this.editCache[id].data.totalPrice = parseFloat(textvalue.toFixed(3)) + parseFloat(this.editCache[id].data.net.toFixed(3))
    }
  }
  addRow(): void {
    let data = this.listOfData.find(a => a.partNo == '');
    if (data) {
      return this.commonService.showError("Please fill all the products first!", "Error");
    }
    const newRow = {
      id: 0,
      partNo: '',
      qty: 0,
      total: 0,
      description: '',
      unitofMeasure: 0,
      discount: 0,
      net: 0,
      tax: 0,
      totalPrice: 0,
      allowTax: false,

    }
    this.listOfData.unshift(newRow);
    this.updateData();
    this.enableEditCache();
  }
  checkQtyValidation(id: number) {
    if (!this.editCache[id].data.partNo)
      return this.commonService.showError("Please fill detail first!", "Error");

    if (!this.editCache[id].data.qty || this.editCache[id].data.qty <= 0)
      return this.commonService.showError("Qty must be greater than 0", "Error");

    const item = this.filteredOptions.find(item => item.part === this.editCache[id].data.partNo);
    if (item.qty < this.editCache[id].data.qty)
      return this.commonService.showError("Branch qty must not exceed to the available qty", "Error");
  }
  checkDiscountValidation(id: number) {
    if (this.editCache[id].data.discount < 0)
      return this.commonService.showError("Discount must be greater than 0 or equal to 0", "Error");
  }
  checkTaxValidation(id: number) {
    if (!this.editCache[id].data.tax || this.editCache[id].data.tax < 0)
      return this.commonService.showError("Tax must be greater than 0 or equal to 0", "Error");
  }
  saveEdit(id: number): void {
    this.avalaibeQty = -1;
    if (!this.editCache[id].data.partNo)
      return this.commonService.showError("Please fill detail first!", "Error");

    if (!this.editCache[id].data.qty || this.editCache[id].data.qty <= 0)
      return this.commonService.showError("Qty must be greater than 0", "Error");

    const item = this.filteredOptions.find(item => item.part === this.editCache[id].data.partNo);
    if(item)
    if (item.qty < this.editCache[id].data.qty)
      return this.commonService.showError("Branch qty must not exceed to the available qty", "Error");
    const index = this.listOfData.findIndex(item => item.id === id);
    Object.assign(this.listOfData[index], this.editCache[id].data);
    this.editCache[id].edit = false;
    this.getGrandTotal();
  }

  updateEditCache(): void {
    debugger
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
    this.errorsList = [];
    if (this.listOfData.length == 0) {
      return this.commonService.showError("Please Enter at least one product", "Error");
    }
    this.listOfData.forEach((item) => {
      this.saveEdit(item.id);
    });
    let customerData = this.customerList.find(a => a.customerName == this.orderForm.value.customerName);
    this.orderForm.value['spareParts'] = this.listOfData;
    this.orderForm.value['grandAmount'] = parseFloat(this.grandTotal.toFixed(3));
    this.orderForm.value['customerId'] = customerData?.customerId;
    this.saveSubmitted = true;
    if (this.paymentMethodName == 'pn') {
      if (!this.orderForm.value.pnStartDate)
        return this.commonService.showError("Please select start date!", "Error");
      if (!this.orderForm.value.pnEndDate)
        return this.commonService.showError("Please select end date!", "Error");
    }
    if (this.orderForm.valid) {
      if (this.paymentMethodName != 'pn') {
        this.orderForm.value.pnStartDate = new Date();
        this.orderForm.value.pnEndDate = new Date();
      }
      this.listOfData.forEach((item) => {
        item.tax = parseInt(item.tax);
        item.total = parseFloat(item.total.toFixed(3));
        item.totalPrice = parseFloat(item.totalPrice.toFixed(3));
        item.net = parseFloat(item.net.toFixed(3));

        delete item.partQtyConcat;
        delete item.unitofMeasure
      });
      this.saveLoader = true;

      this.apiService.createWorkOrder(this.orderForm.value).subscribe(
        (response) => {
          if (response.isSuccess) {
            this.saveLoader = false;
            this.commonService.showSuccess("Data save successfully..!", "Success");
            this.router.navigateByUrl('home/allorder')
            this.orderForm.reset();
            this.listOfData = [];
            this.updateEditCache();
            this.getGrandTotal();
          } else {
            this.saveLoader = false;
            this.errorsList = response["Errors"];
            this.commonService.showError("found some error..!", "Error");
          }
        },
        (error) => {
          this.saveLoader = false;
          this.errorsList = [];

          this.commonService.showError("found some error..!", "Error");
        }
      )
    }
    console.log(JSON.stringify(this.orderForm.value))
  }
}
