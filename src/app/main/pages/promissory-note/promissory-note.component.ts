import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonService } from 'src/app/utility/services/common.service';
import { CreateRequestComponent } from '../create-request/create-request.component';
import { ApiService } from 'src/app/shared/services/api.service';
import { PDFViewComponent } from '../pdfview/pdfview.component';
import { DatePipe } from '@angular/common';
import { CmsSetupDto } from '../../models/cmsSetupDto';
import { DomSanitizer } from '@angular/platform-browser';
import { ErrorsComponent } from '../common/errors/errors.component';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { orderParam } from '../workorders/models/orderParam';
declare var $: any; // Use this line to tell TypeScript that $ is defined elsewhere (by jQuery)
import Swal from 'sweetalert2';
import { differenceInCalendarDays, setHours } from 'date-fns';

@Component({
  selector: 'app-promissory-note',
  templateUrl: './promissory-note.component.html',
  styleUrls: ['./promissory-note.component.scss']
})
export class PromissoryNoteComponent implements OnInit, AfterViewInit {

  constructor(public commonService: CommonService, private router: Router,
    private activatedRoute: ActivatedRoute, private apiService: ApiService,
    private sanitizer: DomSanitizer, private permissionService: PermissionService,
    private modal: NzModalService, private cdr: ChangeDetectorRef, private datePipe: DatePipe) { }
  orderParamObj: orderParam = { PageSize: 1000, BranchId: 1, Status: 0, Sort: 1, OrderNumber: '', FromDate: '', ToDate: '', Search: '' }
  current = 0;
  isGenerate = false;
  saveLoader = false;
  selectedItemOrderId = 0;
  promissoryist = [];
  displaypromissoryist = [];
  generatedlist = [];
  displaygeneratedlist = [];
  orderDetail: any;
  orderDetailMaster: any;
  orderId = 0;
  pdfInfoData: any;
  errorsList: any[] = [];
  versionTab: any[] = [];
  differenceAmount = 0;
  cmsSetup: any = new CmsSetupDto('');
  editCache: { [key: number]: { edit: boolean; data: any } } = {};
  stepSaveLoader = false;
  isPrintShow = false;
  safeUrl: any;
  pageSize = 6;
  pageIndex: number = 1;
  start = 1;
  end = 6;
  ngOnInit(): void {
    this.commonService.breadcrumb = [
      { title: '', routeLink: 'home/promissory-note' }
    ]
    this.activatedRoute.params.subscribe(res => {
      if (res) {
        this.orderId = res['id'];
        this.getPNOrderDetails();
        // this.getListofPromissoryNote();
        // console.log(this.orderId);
      }
    })
  }
  getPNOrderDetails() {
    this.saveLoader = true;
    this.selectedItemOrderId = this.orderId;
    this.apiService.getPNOrders(this.orderId).subscribe(res => {

      this.saveLoader = false;
      this.orderDetail = res.data;
      this.commonService.breadcrumb = [
        { title: this.orderDetail.comingFromTypeID == 26002 ? 'Rescheduling Promissory Notes Orders' : this.orderDetail.comingFromTypeID == 26003 ? 'Transferring Promissory Notes Orders' : 'Generating Promissory Notes Orders', routeLink: 'home/promissory-note' }
      ]
      this.orderDetailMaster = JSON.parse(JSON.stringify(res.data));

      this.versionTab = res.data['versions'];
      if (res.data['versions']) {
        for (let index = 0; index < res.data['versions'].length; index++) {
          // const element = res.data['versions'][index];
          this.versionTab[index]['tabName'] = 'PN V' + (index + 1);
        }
        this.versionTab.push(res.data);
        this.versionTab[this.versionTab.length - 1]['tabName'] = 'PN V' + this.versionTab.length;
        this.versionTab = this.versionTab.reduce((acc, curr) => [curr, ...acc], []);
        // this.versionTab =  this.versionTab.reverse();
      } else {
        this.versionTab = [];
        this.versionTab.push(res.data);
        this.versionTab[this.versionTab.length - 1]['tabName'] = 'PN V' + this.versionTab.length;
      }
      if (this.orderDetail) {
        if (this.orderDetail.statusObj) {
          if (this.orderDetail.statusObj?.translations[0].lookupName.toLowerCase() == 'generated') {
            this.getGeneratedList(1);
          }
          else if (this.orderDetail.statusObj?.translations[0].lookupName.toLowerCase() == 'printed') {
            this.getGeneratedList(2);
          }
          else if (this.orderDetail.statusObj?.translations[0].lookupName.toLowerCase() == 'signed') {
            this.getGeneratedList(3);
          }
          else if (this.orderDetail.statusObj?.translations[0].lookupName.toLowerCase() == 'under collecting') {
            this.getGeneratedList(4);
          }
          else if (this.orderDetail.statusObj?.translations[0].lookupName.toLowerCase() == 'collected') {
            this.getGeneratedList(5);
          }
          else {
            if (this.orderDetail.statusObj?.translations[0].lookupName.toLowerCase() == 'pending')
              this.getCmsSetup();
          }
        }

      }
    })
  }
  pre(): void {
    this.current -= 1;
  }

  next(): void {

    this.current += 1;
  }

  done(): void {
    console.log('done');
  }
  handleIndexChange(event: any) {
    console.log("step click");
  }
  onIndexChange(index: number): void {
    this.current = index;
  }
  //#region  Generating Promissory Notes Orders Tab 1
  getListofPromissoryNote() {
    if(this.orderDetail?.comingFromTypeID == 26003){
      this.saveLoader = true;
      this.stepSaveLoader = true;
      this.selectedItemOrderId = this.orderId;
      this.apiService.getListOfPNsTobeTransfered(this.orderId).subscribe(res => {
        this.stepSaveLoader = false;
        this.saveLoader = false;
        if (res.isSuccess) {

          this.generatedlist = [];
          this.pdfInfoData = res['info'];
          let generatedlist = res.data;
          for (let index = 0; index < generatedlist.length; index++) {
            const obj = {
              id: this.generatedlist.length + 1,
              customerName: this.orderDetail?.customer?.customerName,
              // customerName: this.orderDetail.customer.customerName,
              amount: generatedlist[index].pnAmount,
              dueDate: generatedlist[index].dueDate,
              status:  'Generating',
              lookupBGColor: '#5956e9',
              lookupTextColor: '#e6e5ff',
              pnBookID: generatedlist[index].pnBookID,
              pdfView: generatedlist[index].pNpdfFile
            };
            this.generatedlist.push(obj);
          }
          this.displaygeneratedlist = this.generatedlist.length > 6 ? this.generatedlist.slice(0, 6) : this.generatedlist;
          this.initilizeTableField();
          this.end = this.displaygeneratedlist.length > 6 ? 6 : this.displaygeneratedlist.length;
          this.isGenerate = true;
          this.current = 0;
        }
      })
    }
    else{
      this.promissoryist = [];
      let remainingAmount = this.orderDetail.pnTotalAmount;
      // let decimalPartSum = 0;
      for (let index = 0; index < this.orderDetail.numberOfInstallments; index++) {
        const dueDate = new Date(this.orderDetail.startDate);
        if (this.cmsSetup.periodBetweenPNType.toLowerCase() == "months") {
          dueDate.setMonth(dueDate.getMonth() + (index * this.cmsSetup.periodBetweenPNValue)); // Add 6 days for each iteration
        } else {
          dueDate.setDate(dueDate.getDate() + (index * this.cmsSetup.periodBetweenPNValue)); // Add 6 days for each iteration
        }
        let installment = parseFloat((this.orderDetail.pnTotalAmount / this.orderDetail.numberOfInstallments).toFixed(3));
        let obj = {};
        // let decimalPart = installment % 1;
        if (index == this.orderDetail.numberOfInstallments - 1) {
          // installment += decimalPartSum;
          obj = {
            id: this.promissoryist.length + 1,
            customerName: this.orderDetail.customer.customerName,
            amount: this.formatRemainingAmount(remainingAmount),
            orginalAmount: this.formatRemainingAmount(remainingAmount),
            dueDate: this.datePipe.transform(dueDate, 'yyyy-MM-dd'),
            originalDueDate: this.datePipe.transform(dueDate, 'yyyy-MM-dd'),
            status: 'Generating',
            edit: false,
            last: true,
            first: false,
          };
        }
        else {
          remainingAmount -= Math.floor(installment);
          if (index == 0) {
            obj = {
              id: this.promissoryist.length + 1,
              customerName: this.orderDetail.customer.customerName,
              amount: Math.floor(installment),
              orginalAmount: Math.floor(installment),
              dueDate: this.datePipe.transform(dueDate, 'yyyy-MM-dd'),
              originalDueDate: this.datePipe.transform(dueDate, 'yyyy-MM-dd'),
              status: 'Generating',
              edit: false,
              first: true,
              last: false,
            };
          }
          else {
            obj = {
              id: this.promissoryist.length + 1,
              customerName: this.orderDetail.customer.customerName,
              amount: Math.floor(installment),
              orginalAmount: Math.floor(installment),
              dueDate: this.datePipe.transform(dueDate, 'yyyy-MM-dd'),
              originalDueDate: this.datePipe.transform(dueDate, 'yyyy-MM-dd'),
              status: 'Generating',
              edit: false,
              last: false,
              first: false,
            };
          }

          // if (decimalPart > 0) {
          //   decimalPartSum += decimalPart;
          // }
        }

        this.promissoryist.push(obj);
      }
      this.displaypromissoryist = this.promissoryist.length > 6 ? this.promissoryist.slice(0, 6) : this.promissoryist;
      this.initilizeTableField();
      this.end = this.displaypromissoryist.length > 6 ? 6 : this.displaypromissoryist.length;
      this.updateEditCache();
      this.isGenerate = true;
      this.differenceAmount = 0;
      this.current = 0;
      this.displaygeneratedlist =  [];
      this.generatedlist = [];
    }

  }
  formatRemainingAmount(remainingAmount) {
    const integerPart = Math.floor(remainingAmount);
    const decimalPart = remainingAmount % 1;
    const roundedDecimal = decimalPart.toFixed(3).slice(-3);
    const roundedDecimalInt = parseInt(roundedDecimal);
    if(roundedDecimalInt){
      return `${integerPart}.${roundedDecimal}`;
    }else{
      return remainingAmount;
    }
    // if (roundedDecimalInt >= 5) {
    //   return integerPart + 1;
    // } else if (roundedDecimalInt > 0) {
    //   return `${integerPart}.${roundedDecimal}`;
    // } else {
    //   return remainingAmount;
    // }
  }
  saveEdit(id: number) {
    const datesWithoutTime = this.promissoryist.map(date => {
      let newDate = new Date(date.dueDate);
      const year = newDate.getFullYear();
      const month = newDate.getMonth();
      const day = newDate.getDate();
      return `${year}-${month + 1}-${day}`;
    });
    let dueDate = new Date(this.editCache[id].data.dueDate);
    const year = dueDate.getFullYear();
    const month = dueDate.getMonth();
    const day = dueDate.getDate();
    let dueDateFinal = `${year}-${month + 1}-${day}`;
    // Check if any pair of dates match
    for (let i = 0; i < datesWithoutTime.length; i++) {
      if (datesWithoutTime[i] === dueDateFinal && id != i + 1) {
        this.commonService.showError("No 2 PNs allowed to have same due date.", "error");
        return;
      }
    }
    if (id == this.promissoryist.length) {
      const number = parseFloat(this.editCache[id].data.amount);
      const integerPart = parseInt(number.toString().split('.')[0]); // Get the integer part
      const decimalPart = number.toString().split('.')[1]; // Get the decimal part
      const roundedDecimal = decimalPart.slice(0, 3); // Extract the first three digits
      this.editCache[id].data.amount = integerPart + parseFloat(`0.${roundedDecimal}`);
      // console.log(result); // Output: 853.985

      // this.editCache[id].data.amount = parseFloat(this.editCache[id].data.amount);
      if (this.editCache[id].data.amount > 0) {
        const index = this.promissoryist.findIndex(item => item.id === id);
        Object.assign(this.promissoryist[index], this.editCache[id].data);
        this.promissoryist[index].edit = true;
        this.editCache[id].edit = false;
      } else {
        this.commonService.showError("Amount must be greater than 0", "error");
      }
    } else {
      this.editCache[id].data.amount = parseInt(this.editCache[id].data.amount, 10)
      if (this.editCache[id].data.amount > 0) {
        const index = this.promissoryist.findIndex(item => item.id === id);
        Object.assign(this.promissoryist[index], this.editCache[id].data);
        this.promissoryist[index].edit = true;
        this.editCache[id].edit = false;
      } else {
        this.commonService.showError("Amount must be greater than 0", "error");
      }
    }

  }
  cancelEdit(id: number) {
    const index = this.promissoryist.findIndex(item => item.id === id);
    Object.assign(this.editCache[id].data, this.promissoryist[index]);
    this.editCache[id].edit = false;

    let amount = 0;
    for (let index = 0; index < this.promissoryist.length; index++) {
      amount += this.editCache[index + 1].data.amount ? parseFloat(this.editCache[index + 1].data.amount) : 0;
    }
    this.differenceAmount = parseFloat((this.orderDetail.pnTotalAmount - parseFloat(amount.toFixed(3))).toFixed(3));
  }
  finalSave(id: number) {
    const index = this.promissoryist.findIndex(item => item.id === id);
    // if (parseFloat(this.promissoryist[index].amount) != parseFloat(this.editCache[id].data.amount))
    // this.promissoryist[index].edit = true;
    Object.assign(this.promissoryist[index], this.editCache[id].data);
    // this.editCache[id].edit = false;
  }
  updateEditCache(): void {
    this.promissoryist.forEach((item, index) => {
      this.editCache[index + 1] = {
        edit: false,
        data: { ...item }
      };
    });
  }
  checkAllFields() {
    for (let index = 0; index < this.promissoryist.length; index++) {
      const element = this.promissoryist[index];
      let check = this.editCache[element.id].edit;
      if (check)
        return true;
    }
    return false;
  }
  saveGeneratingNotes() {
    Swal.fire({
      title: 'A promissory notes book will be generated for this customer; are you sure?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        let notes: any = [];
        // this.promissoryist.forEach((item) => {
        //   this.finalSave(item.id);
        // });
        let check = this.promissoryist.find(a => a.amount == 0 || a.amount == null || a.amount == '');
        if (check) {
          let index = this.promissoryist.findIndex(item => item.id === check.id);
          this.promissoryist[index].edit = true;
          this.commonService.showError("You must need to put more than 0 value..!", "Error");
          return;
        }
        if(this.orderDetail?.comingFromTypeID == 26003){
          this.generatedlist.forEach(element => {
            try {
              let data = {
                amount: parseFloat(element.amount.toString()).toFixed(3),
                dueDate: element.dueDate.split('T')[0]
              }
              notes.push(data);
            } catch (error) {
              console.log(error);
            }
          })
        }else if(this.generatedlist.length > 0){
          this.promissoryist.forEach(element => {
            const fromDate = new Date(element.dueDate.toString());
            try {
              let data = {
                amount: parseFloat(element.amount.toString()).toFixed(3),
                dueDate: fromDate.toISOString()
              }
              notes.push(data);
            } catch (error) {
              console.log(error);
            }
          })
        }

        let orderId: any = this.orderId
        let formData = new FormData();
        formData.append('OrderId', orderId);
        formData.append('Notes', JSON.stringify(notes));
        this.stepSaveLoader = true;
        this.apiService.saveGeneratingNotes(formData).subscribe(
          (res) => {
            this.stepSaveLoader = false;
            if (res.isSuccess) {
              this.promissoryist.forEach((item) => {
                this.finalSave(item.id);
              });
              this.commonService.showSuccess("Data updated successfully..!", "Success");
              this.ngOnInit();
            }
            else {
              this.errorsList = res["errors"] ? res["errors"] : res["Errors"];
              this.commonService.showError("found some error..!", "Error");
              this.error(this.errorsList);

            }
          },
          (error) => {
            this.stepSaveLoader = false;
            this.errorsList = error.errors ? error.errors : error.Errors;
            this.commonService.showError("found some error..!", "Error");
            this.error(this.errorsList);
          }
        )

        // Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User cancelled, do nothing or show a different message
        // Swal.fire('Cancelled', 'Your item is safe.', 'info');
      }
    });
  }
  isDateMatch(): boolean {
    if (this.promissoryist.length < 2) {
      return false;
    }

    // Extract date strings without time
    const datesWithoutTime = this.promissoryist.map(date => {
      let newDate = new Date(date.dueDate);
      const year = newDate.getFullYear();
      const month = newDate.getMonth();
      const day = newDate.getDate();
      return `${year}-${month + 1}-${day}`;
    });

    // Check if any pair of dates match
    for (let i = 0; i < datesWithoutTime.length; i++) {
      for (let j = i + 1; j < datesWithoutTime.length; j++) {
        if (datesWithoutTime[i] === datesWithoutTime[j]) {
          return true;
        }
      }
    }

    return false;
  }


  getCmsSetup() {
    this.apiService.getCMSSetup().subscribe(res => {
      if (res.isSuccess) {
        this.cmsSetup = res.data[0];
      }
    })
  }
  checkReset() {
    return this.promissoryist.find(item => item.edit === true);
  }
  undoValue(id: number) {
    const index = this.promissoryist.findIndex(item => item.id === id);
    this.promissoryist[index].edit = false;
    this.promissoryist[index].amount = this.promissoryist[index].orginalAmount;
    this.promissoryist[index].dueDate = this.promissoryist[index].originalDueDate;
    this.editCache[id].data.amount = this.promissoryist[index].amount;
    this.editCache[id].data.dueDate = this.promissoryist[index].originalDueDate;
    // this.differenceAmount = this.differenceAmount - this.editCache[id].data.amount;
    this.changeAmount(id, true);
  }
  //#endregion

  //#region  generated tab 2
  getGeneratedList(index: number) {
    this.stepSaveLoader = true;
    this.selectedItemOrderId = this.orderId;
    this.apiService.getPNOrderBookNotes(this.orderId, 1).subscribe(res => {
      this.stepSaveLoader = false;
      if (res.isSuccess) {

        this.generatedlist = [];
        this.displaygeneratedlist = [];
        this.pdfInfoData = res['info'];
        let generatedlist = res.data;
        const currentDate = new Date(); // Current date
        for (let index = 0; index < generatedlist.length; index++) {
          const obj = {
            id: this.generatedlist.length + 1,
            customerName: generatedlist[index]?.customer?.customerName,
            // customerName: this.orderDetail.customer.customerName,
            amount: generatedlist[index].pnAmount,
            dueDate: generatedlist[index].dueDate,
            status: generatedlist[index].statusObj ? generatedlist[index].statusObj.translations[0].lookupName : '',
            lookupBGColor: generatedlist[index].statusObj ? generatedlist[index].statusObj.lookupBGColor : '',
            lookupTextColor: generatedlist[index].statusObj ? generatedlist[index].statusObj.lookupTextColor : '',
            pnBookID: generatedlist[index].pnBookID,
            dateCheck: new Date(generatedlist[index].dueDate) < currentDate ? true : false,
            pdfView: generatedlist[index].pNpdfFile
          };
          this.generatedlist.push(obj);
        }
        this.displaygeneratedlist = this.generatedlist.length > 6 ? this.generatedlist.slice(0, 6) : this.generatedlist;
        this.initilizeTableField();
        this.end = this.displaygeneratedlist.length > 6 ? 6 : this.displaygeneratedlist.length;
        this.isGenerate = true;
        this.current = index;
      }
    })
  }
  initilizeTableField() {
    this.pageSize = 6;
    this.pageIndex = 1;
    this.start = 1;
  }
  //#endregion
  createRequest(): void {
    const modal = this.modal.create<CreateRequestComponent>({
      nzWidth: 700,
      // nzTitle: 'Change Control Value',

      nzContent: CreateRequestComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzOnOk: () => console.log('Click ok'),
      // nzViewContainerRef: this.viewContainerRef,
      // nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000)),
      nzComponentParams: {
        data: this.orderId
      },
      nzFooter: null
    });
    modal.afterClose.subscribe(res => {
      if (res) {
        // this.controls(value, data, obj, res);
      }
    });
  }
  changeAmount(event: any, id: any, check?: boolean) {
    // this.updateEditCache();
    // const charCode = (event.which) ? event.which : event.keyCode;
    // if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    //   // charCode 48-57 are 0-9, 46 is .
    //   return false;
    // }
    let amount = 0;
    for (let index = 0; index < this.promissoryist.length; index++) {
      amount += this.editCache[index + 1].data.amount ? parseFloat(this.editCache[index + 1].data.amount) : 0;
    }
    this.differenceAmount = parseFloat((this.orderDetail.pnTotalAmount - parseFloat(amount.toFixed(3))).toFixed(3));
  }
  changeAmountDecimal(event: any, id: any, check?: boolean) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const decimalIndex = value.indexOf('.');
    if (decimalIndex !== -1 && value.length - decimalIndex > 4) {
      input.value = value.substr(0, decimalIndex + 4);
    }
    const number = this.editCache[id].data.amount;
    const integerPart = parseInt(number.toString().split('.')[0]); // Get the integer part
    const decimalPart = number.toString().split('.')[1]; // Get the decimal part
    if(decimalPart){
      const roundedDecimal = decimalPart.slice(0, 3); // Extract the first three digits
      if(roundedDecimal)
      this.editCache[id].data.amount = integerPart + parseFloat(`0.${roundedDecimal}`);
    }

    let amount = 0;
    for (let index = 0; index < this.promissoryist.length; index++) {
      amount += this.editCache[index + 1].data.amount ? parseFloat(this.editCache[index + 1].data.amount) : 0;
    }
    this.differenceAmount = parseFloat((this.orderDetail.pnTotalAmount - parseFloat(amount.toFixed(3))).toFixed(3));
  }
  numericOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      // charCode 48-57 are 0-9, 46 is .
      return false;
    }
    return true;
  }
  truncateValue(number: number): number {
    const truncated = Math.trunc(number * 1000) / 1000; // Truncate to three decimal places
    const thirdDecimal = Math.floor((truncated * 1000) % 10); // Get the third decimal place

    if (thirdDecimal < 5) {
      return Math.trunc(truncated); // Return the truncated value as an integer
    } else {
      return truncated; // Return the original value without truncation
    }
  }

  //#region  generated tab 2
  tabChange(item: any) {
    if (item.versions) {
      this.gotoMainTab();
    }
    else {
      this.orderDetail.customer = item.customer;
      this.orderDetail.guarantor = item.guarantor;
      // this.orderDetail['comingFromTypeID'] = 0;
      // this.orderDetail['comingFromTypeID'] == 26001;
      this.orderDetail.hasActiveRequest = true;

      // this.orderDetail.statusObj = item.statusObj;
      let index = 0;
      if (this.orderDetail) {
        if (item.statusObj) {
          if (item.statusObj?.translations[0].lookupName.toLowerCase() == 'generated') {
            index = 1;
          }
          else if (item.statusObj?.translations[0].lookupName.toLowerCase() == 'printed') {
            index = 2;
          }
          else if (item.statusObj?.translations[0].lookupName.toLowerCase() == 'signed') {
            index = 3;
          }
          else if (item.statusObj?.translations[0].lookupName.toLowerCase() == 'under collecting') {
            index = 4;
          }
          else if (item.statusObj?.translations[0].lookupName.toLowerCase() == 'collected') {
            index = 5;
          }
        }
      }
      this.stepSaveLoader = true;
      this.selectedItemOrderId = item.orderId;
      this.apiService.getPNOrderBookNotes(item.orderId, 1).subscribe(res => {
        this.stepSaveLoader = false;
        if (res.isSuccess) {
          this.generatedlist = [];
          // this.pdfInfoData = res['info'];
          let generatedlist = res['data'];
          for (let index = 0; index < generatedlist.length; index++) {
            const obj = {
              id: this.generatedlist.length + 1,
              customerName: generatedlist[index]?.customer?.customerName,
              // customerName: this.orderDetail.customer.customerName,
              amount: generatedlist[index].pnAmount,
              dueDate: generatedlist[index].dueDate,
              status: generatedlist[index].statusObj ? generatedlist[index].statusObj.translations[0].lookupName : '',
              lookupBGColor: generatedlist[index].statusObj ? generatedlist[index].statusObj.lookupBGColor : '',
              lookupTextColor: generatedlist[index].statusObj ? generatedlist[index].statusObj.lookupTextColor : '',
              pnBookID: generatedlist[index].pnBookID,
              dateCheck: generatedlist[index].dueDate,
              pdfView: generatedlist[index].pNpdfFile
            };
            this.generatedlist.push(obj);
          }
          this.displaygeneratedlist = this.generatedlist.length > 6 ? this.generatedlist.slice(0, 6) : this.generatedlist;
          this.initilizeTableField();
          this.end = this.displaygeneratedlist.length > 6 ? 6 : this.displaygeneratedlist.length;
          this.current = index;
          this.isGenerate = true;
        }
      })
    }
  }
  gotoMainTab() {
    this.isGenerate = false;
    this.orderDetail = JSON.parse(JSON.stringify(this.orderDetailMaster));
    let index = 0;
    if (this.orderDetail) {
      if (this.orderDetail.statusObj) {
        if (this.orderDetail.statusObj?.translations[0].lookupName.toLowerCase() == 'generated') {
          index = 1;
        }
        else if (this.orderDetail.statusObj?.translations[0].lookupName.toLowerCase() == 'printed') {
          index = 2;
        }
        else if (this.orderDetail.statusObj?.translations[0].lookupName.toLowerCase() == 'signed') {
          index = 3;
        }
        else if (this.orderDetail.statusObj?.translations[0].lookupName.toLowerCase() == 'under collecting') {
          index = 4;
        }
        else if (this.orderDetail.statusObj?.translations[0].lookupName.toLowerCase() == 'collected') {
          index = 5;
        }
      }
    }
    this.stepSaveLoader = true;
    this.selectedItemOrderId = this.orderId;
    this.apiService.getPNOrderBookNotes(this.orderId, 1).subscribe(res => {
      this.stepSaveLoader = false;
      if (res.isSuccess) {
        this.generatedlist = [];
        // this.pdfInfoData = res['info'];
        let generatedlist = res['data'];
        for (let index = 0; index < generatedlist.length; index++) {
          const obj = {
            id: this.generatedlist.length + 1,
            customerName: generatedlist[index]?.customer?.customerName,
            // customerName: this.orderDetail.customer.customerName,
            amount: generatedlist[index].pnAmount,
            dueDate: generatedlist[index].dueDate,
            status: generatedlist[index].statusObj ? generatedlist[index].statusObj.translations[0].lookupName : '',
            lookupBGColor: generatedlist[index].statusObj ? generatedlist[index].statusObj.lookupBGColor : '',
            lookupTextColor: generatedlist[index].statusObj ? generatedlist[index].statusObj.lookupTextColor : '',
            pnBookID: generatedlist[index].pnBookID,
            dateCheck: generatedlist[index].dueDate,
            pdfView: generatedlist[index].pNpdfFile
          };
          this.generatedlist.push(obj);
        }
        this.displaygeneratedlist = this.generatedlist.length > 6 ? this.generatedlist.slice(0, 6) : this.generatedlist;
        this.initilizeTableField();
        this.end = this.displaygeneratedlist.length > 6 ? 6 : this.displaygeneratedlist.length;
        this.current = index;
        this.isGenerate = true;
      }
    })
  }
  //#endregion
  ngAfterViewInit() {

    this.cdr.detectChanges()
  }
  step: number = 1;
  showAlertBox: boolean = false;
  selectedCard
  steps = [
    {
      title: 'Promissory_Notes.Generating'
    },
    {
      title: 'Promissory_Notes.Generated'
    },
    {
      title: 'Promissory_Notes.Printed'
    },
    {
      title: 'Promissory_Notes.Signed'
    },
    {
      title: 'Promissory_Notes.Under_Collecting'
    },
    {
      title: 'Promissory_Notes.Collected'
    },
  ];
  pdfView(file: any, data?: any): void {
    if(file){
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
    }else{
      this.commonService.showError("Sorry there is no file exist!","error");
    }

  }

  printPNBook() {
    this.isPrintShow = true;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfInfoData.allPNpdfFiles);
  }
  printAll(status: any) {
    let formData = new FormData();
    formData.append('PNBookId', this.generatedlist[0].pnBookID);
    formData.append('Status', status);
    this.apiService.updatePNBookStatus(formData).subscribe(
      (response) => {
        if (response.isSuccess) {
          this.isPrintShow = false;
          this.ngOnInit();
        } else {
          this.errorsList = response.errors ? response.errors : response['Errors'];
          this.commonService.showError("found some error..!", "Error");
          this.error(this.errorsList);
        }
      },
      (error) => {
        this.errorsList = error.errors ? error.errors : error.Errors;
        this.commonService.showError("found some error..!", "Error");
        this.error(this.errorsList);
      }

    )
  }
  printClose() {
    this.isPrintShow = false;
  }
  error(errorsList: any) {
    const modal = this.modal.create<ErrorsComponent>({
      nzWidth: 600,
      nzContent: ErrorsComponent,
      nzComponentParams: {
        errorsList: errorsList,
      },
      nzFooter: null
    });
    modal.afterClose.subscribe(res => {
      if (res) {
        // this.controls(value, data, obj, res);
      }
    });
  }
  ngOnDestroy() {
    this.commonService.selectedWorkorder = 0;
    this.commonService.loadRequestTab = false;
  }
  canPerformAction(catId: number, subCatId: number, perItemName: number) {
    return this.permissionService.checkPermission(catId, subCatId, perItemName);
  }
  sortType = null;
  sortCounters = {
    'orderno': 0,
    'amount': 0,
    'date': 0,
    'status': 0
  };
  lastSortedColumn = null;

  getSortFunction(sortType: string, columnName: string,) {
    if (this.generatedlist.length > 0) {

      if (this.lastSortedColumn && this.lastSortedColumn !== columnName) {
        // reset the sort counter for other columns
        for (let key in this.sortCounters) {
          if (key !== columnName) {
            this.sortCounters[key] = 0;
          }
        }
      }

      this.sortCounters[columnName]++;

      switch (this.sortCounters[columnName] % 3) {
        case 0: // no sort
          this.sortType = null;
          this.orderParamObj.Sort = 1;
          break;
        case 1: // ascending
          this.sortType = "ascend";
          this.orderParamObj.Sort = columnName === 'orderno' ? 2 :
            columnName === 'amount' ? 4 :
              columnName === 'date' ? 6 :
                8; // assuming 'status' for the default case
          break;
        case 2: // descending
          this.sortType = "descend";
          this.orderParamObj.Sort = columnName === 'orderno' ? 3 :
            columnName === 'amount' ? 5 :
              columnName === 'date' ? 7 :
                9; // assuming 'status' for the default case
          break;
      }

      this.lastSortedColumn = columnName;
      this.generateSortList();
    }
  }
  generateSortList() {
    let Sort = this.orderParamObj.Sort;
    this.apiService.getPNOrderBookNotes(this.selectedItemOrderId, Sort).subscribe(res => {
      this.stepSaveLoader = false;
      if (res.isSuccess) {
        this.generatedlist = [];
        let generatedlist = res['data'];
        let getCount = generatedlist.length;
        for (let index = 0; index < generatedlist.length; index++) {
          const obj = {
            id: Sort == 3 || Sort == 1 ? this.generatedlist.length + 1 : getCount,
            customerName: generatedlist[index]?.customer?.customerName,
            amount: generatedlist[index].pnAmount,
            dueDate: generatedlist[index].dueDate,
            status: generatedlist[index].statusObj ? generatedlist[index].statusObj.translations[0].lookupName : '',
            lookupBGColor: generatedlist[index].statusObj ? generatedlist[index].statusObj.lookupBGColor : '',
            lookupTextColor: generatedlist[index].statusObj ? generatedlist[index].statusObj.lookupTextColor : '',
            pnBookID: generatedlist[index].pnBookID,
            dateCheck: generatedlist[index].dueDate,
            pdfView: generatedlist[index].pNpdfFile
          };
          this.generatedlist.push(obj);
          getCount -= 1;
        }
        this.displaygeneratedlist = this.generatedlist.length > 6 ? this.generatedlist.slice(0, 6) : this.generatedlist;
        this.initilizeTableField();
        this.end = this.displaygeneratedlist.length > 6 ? 6 : this.displaygeneratedlist.length;

        if (this.sortType === "ascend") {
          this.generatedlist.sort((a, b) => a.id - b.id);
        } else if (this.sortType === "descend") {
          this.generatedlist.sort((a, b) => b.id - a.id);
        }
        this.isGenerate = true;
      }
    })
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
  onPageIndexChange(index: number): void {
    this.pageIndex = index;
    this.updateDisplayData();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.updateDisplayData();
  }

  updateDisplayData(): void {
    const start = (this.pageIndex - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.start = start == 0 ? 1 : ((this.pageIndex * this.pageSize) - this.pageSize) + 1;
    if (this.current != 0 || this.orderDetail?.comingFromTypeID == 26003) {
      this.displaygeneratedlist = this.generatedlist.slice(start, end);
      this.end = this.displaygeneratedlist.length != 6 ? this.generatedlist.length : this.pageIndex * this.pageSize;
    } else {
      this.displaypromissoryist = this.promissoryist.slice(start, end);
      this.end = this.displaypromissoryist.length != 6 ? this.promissoryist.length : this.pageIndex * this.pageSize;
      this.updateEditData();
    }

  }
  updateEditData() {
    for (let index = 0; index < this.promissoryist.length; index++) {
      if (index != this.promissoryist.length - 1) {
        this.editCache[index + 1].data.amount = parseInt(this.editCache[index + 1].data.amount, 10);
      } else {
        this.editCache[index + 1].data.amount = parseFloat(this.editCache[index + 1].data.amount);
      }
    }
  }
  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date(this.orderDetail.startDate)) <= 0;
}
