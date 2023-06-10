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
  generatedlist = [];
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
        { title: this.orderDetail.comingFromTypeID == 26002 ? 'Rescheduling Promissory Notes Orders' : this.orderDetail.comingFromTypeID == 26003 ? 'Transfering Promissory Notes Orders' : 'Generating Promissory Notes Orders', routeLink: 'home/promissory-note' }
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
    this.promissoryist = [];
    let remainingAmount = this.orderDetail.pnTotalAmount;
    for (let index = 0; index < this.orderDetail.numberOfInstallments; index++) {
      const dueDate = new Date(this.orderDetail.startDate);
      if (this.cmsSetup.periodBetweenPNType.toLowerCase() == "months") {
        dueDate.setMonth(dueDate.getMonth() + (index * this.cmsSetup.periodBetweenPNValue)); // Add 6 days for each iteration
      } else {
        dueDate.setDate(dueDate.getDate() + (index * this.cmsSetup.periodBetweenPNValue)); // Add 6 days for each iteration
      }
      let installment = parseFloat((this.orderDetail.pnTotalAmount / this.orderDetail.numberOfInstallments).toFixed(3));
      let obj = {};
      if (index == this.orderDetail.numberOfInstallments - 1) {
        obj = {
          id: this.promissoryist.length + 1,
          customerName: this.orderDetail.customer.customerName,
          amount: remainingAmount,
          orginalAmount: remainingAmount,
          dueDate: this.datePipe.transform(dueDate, 'yyyy-MM-dd'),
          originalDueDate: this.datePipe.transform(dueDate, 'yyyy-MM-dd'),
          status: 'Generating',
          edit: false
        };
      }
      else {
        remainingAmount -= installment;
        obj = {
          id: this.promissoryist.length + 1,
          customerName: this.orderDetail.customer.customerName,
          amount: installment,
          orginalAmount: installment,
          dueDate: this.datePipe.transform(dueDate, 'yyyy-MM-dd'),
          originalDueDate: this.datePipe.transform(dueDate, 'yyyy-MM-dd'),
          status: 'Generating',
          edit: false
        };
      }

      this.promissoryist.push(obj);
    }
    this.updateEditCache();
    this.isGenerate = true;
    this.differenceAmount = 0;
  }
  saveEdit(id: number) {
    const index = this.promissoryist.findIndex(item => item.id === id);
    Object.assign(this.promissoryist[index], this.editCache[id].data);
    this.promissoryist[index].edit = true;
    this.editCache[id].edit = false;
  }
  finalSave(id: number) {
    const index = this.promissoryist.findIndex(item => item.id === id);
    Object.assign(this.promissoryist[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }
  updateEditCache(): void {
    this.promissoryist.forEach((item, index) => {
      this.editCache[index + 1] = {
        edit: false,
        data: { ...item }
      };
    });
  }
  saveGeneratingNotes() {
    this.stepSaveLoader = true;
    let notes: any = [];
    this.promissoryist.forEach((item) => {
      this.finalSave(item.id);
    });

    this.promissoryist.forEach(element => {
      const fromDate = new Date(element.dueDate.toString());
      let data = {
        amount: parseFloat(element.amount.toFixed(3)),
        dueDate: fromDate.toISOString()
      }
      notes.push(data);
    })
    let orderId: any = this.orderId
    let formData = new FormData();
    formData.append('OrderId', orderId);
    formData.append('Notes', JSON.stringify(notes));
    this.apiService.saveGeneratingNotes(formData).subscribe(
      (res) => {
        this.stepSaveLoader = false;
        if (res.isSuccess) {
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
    this.apiService.getPNOrderBookNotes(this.orderId,1).subscribe(res => {
      this.stepSaveLoader = false;
      if (res.isSuccess) {

        this.generatedlist = [];
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
        this.isGenerate = true;
        this.current = index;
      }
    })
  }
  //#endregion
  createRequest(): void {
    const modal = this.modal.create<CreateRequestComponent>({
      nzWidth: 700,
      // nzTitle: 'Change Control Value',
      nzContent: CreateRequestComponent,
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
  changeAmount(id: any, check?: boolean) {
    // this.updateEditCache();
    let amount = 0;
    for (let index = 0; index < this.promissoryist.length; index++) {
      amount += this.editCache[index + 1].data.amount;
    }
    // let differenceamount = this.truncateValue(parseFloat((this.orderDetail.pnTotalAmount - parseFloat(amount.toFixed(3))).toFixed(3)));
    this.differenceAmount = parseFloat((this.orderDetail.pnTotalAmount - parseFloat(amount.toFixed(3))).toFixed(3));
    // this.promissoryist.forEach(element => {
    //   if (element.id === id && !check) {
    //     amount += this.editCache[id].data.amount
    //   }
    //   else
    //     amount += element.amount
    // });
    // this.differenceAmount = this.orderDetail.pnTotalAmount - amount;
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
      this.apiService.getPNOrderBookNotes(item.orderId,1).subscribe(res => {
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
    this.apiService.getPNOrderBookNotes(this.orderId,1).subscribe(res => {
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
  sortCounter = 0;
  getSortFunction(sortType: string, columnName: string,) {
    if (this.generatedlist.length > 0) {
      if (columnName === 'orderno') {
        this.sortCounter++;
        switch (this.sortCounter % 3) {
          case 0: // no sort
            this.sortType = null;
            this.orderParamObj.Sort = 1;
            break;
          case 1: // ascending
            this.sortType = "ascend";
            this.orderParamObj.Sort = 2;
            break;
          case 2: // descending
            this.sortType = "descend";
            this.orderParamObj.Sort = 3;
            break;
        }
        this.generateSortList();
      }
      if (columnName === 'amount') {
        this.sortCounter++;
        switch (this.sortCounter % 3) {
          case 0: // no sort
            this.sortType = null;
            this.orderParamObj.Sort = 1;
            break;
          case 1: // ascending
            this.sortType = "ascend";
            this.orderParamObj.Sort = 4;
            break;
          case 2: // descending
            this.sortType = "descend";
            this.orderParamObj.Sort = 5;
            break;
        }
        this.generateSortList();
      }
      // if (columnName == 'date') {
      //   this.orderParamObj.Sort = sortType === "ascend" ? 4 : 5;
      //   this.generateSortList();
      //   this.sortType = this.sortType === "ascend" ? "descend" : "ascend";
      // }
      if (columnName == 'date') {
        this.sortCounter++;
        switch (this.sortCounter % 3) {
          case 0: // no sort
            this.sortType = null;
            this.orderParamObj.Sort = 1;
            break;
          case 1: // ascending
            this.sortType = "ascend";
            this.orderParamObj.Sort = 6;
            break;
          case 2: // descending
            this.sortType = "descend";
            this.orderParamObj.Sort = 7;
            break;
        }
        this.generateSortList();
      }
      if (columnName == 'status') {
        this.sortCounter++;
        switch (this.sortCounter % 3) {
          case 0: // no sort
            this.sortType = null;
            this.orderParamObj.Sort = 1;
            break;
          case 1: // ascending
            this.sortType = "ascend";
            this.orderParamObj.Sort = 8;
            break;
          case 2: // descending
            this.sortType = "descend";
            this.orderParamObj.Sort = 9;
            break;
        }
        this.generateSortList();
      }
    }
  }
  generateSortList(){
    let Sort = this.orderParamObj.Sort;
    this.apiService.getPNOrderBookNotes(this.selectedItemOrderId,Sort).subscribe(res => {
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
        this.isGenerate = true;
      }
    })
  }
}

