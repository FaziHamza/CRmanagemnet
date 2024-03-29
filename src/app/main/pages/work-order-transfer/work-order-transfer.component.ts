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
import { RejectComponent } from '../common/reject/reject.component';
import { ErrorsComponent } from '../common/errors/errors.component';
import { ConfirmPopupComponent } from '../common/confirm-popup/confirm-popup.component';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { orderParam } from '../workorders/models/orderParam';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CheckGuarantorComponent } from '../common/check-guarantor/check-guarantor.component';
declare var $: any; // Use this line to tell TypeScript that $ is defined elsewhere (by jQuery)

@Component({
  selector: 'app-work-order-transfer',
  templateUrl: './work-order-transfer.component.html',
  styleUrls: ['./work-order-transfer.component.scss']
})

export class WorkOrderTransferComponent implements OnInit, AfterViewInit {

  constructor(public commonService: CommonService, private router: Router,
    private activatedRoute: ActivatedRoute, private apiService: ApiService,
    private _modalService: NgbModal,
    private sanitizer: DomSanitizer, private permissionService: PermissionService,
    private modal: NzModalService, private cdr: ChangeDetectorRef, private datePipe: DatePipe) { }

  orderParamObj: orderParam = { PageSize: 1000, BranchId: 1, Status: 0, Sort: 1, OrderNumber: '', FromDate: '', ToDate: '', Search: '' }
  selectedItemOrderId = 0;
  current = 0;
  isGenerate = false;
  saveLoader = false;
  generatedlist = [];
  displaygeneratedlist = [];
  orderDetail: any;
  otherDetail: any;
  orderDetailMaster: any;
  orderId = 0;
  pdfInfoData: any;
  versionTab: any[] = [];
  errorsList: any[] = [];
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
      { title: 'Transferring Promissory Notes Orders', routeLink: 'home/workorders' }
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
    this.apiService.getTransfereRequestDetails(this.orderId).subscribe(res => {

      this.saveLoader = false;
      this.orderDetail = res.data;
      this.orderDetailMaster = JSON.parse(JSON.stringify(res.data));
      this.versionTab = res.data['versions'];
      if (res.data['versions']) {
        for (let index = 0; index < res.data['versions'].length; index++) {
          // const element = res.data['versions'][index];
          this.versionTab[index]['tabName'] = 'PN V' + (index + 1);
        }
        let originalCustomer = this.versionTab[this.versionTab.length - 1]['customer'];
        this.orderDetail['originalCustomer'] = {};
        this.orderDetail['originalCustomer'] = originalCustomer;
        this.orderDetailMaster['originalCustomer'] = {};
        this.orderDetailMaster['originalCustomer'] = originalCustomer;
        this.versionTab.push(res.data);
        this.versionTab[this.versionTab.length - 1]['tabName'] = 'PN V' + this.versionTab.length;
        this.versionTab = this.versionTab.reduce((acc, curr) => [curr, ...acc], []);

      } else {
        this.versionTab = [];
        this.versionTab.push(res.data);
        this.versionTab[this.versionTab.length - 1]['tabName'] = 'PN V' + this.versionTab.length;
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

  //#endregion

  //#region  generated tab 2
  getGeneratedList(item: any) {

    if (item.versions) {
      this.gotoMainTab();
    } else {
      this.orderDetail.customer = item.customer;
      this.orderDetail.guarantor = item.guarantor;
      this.otherDetail = item;
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
      this.selectedItemOrderId = this.orderDetailMaster?.pnOrderID;
      this.apiService.getPNOrderBookNotes(this.orderDetailMaster?.pnOrderID, 1).subscribe(res => {
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
          this.initlizePaginationControl();
          this.end = this.displaygeneratedlist.length > 6 ? 6 : this.displaygeneratedlist.length;
          this.current = index;
          this.isGenerate = true;
        }
      })
    }

  }
  initlizePaginationControl() {
    this.pageSize = 6;
    this.pageIndex = 1;
    this.start = 1;
  }
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
    const modelRef = this._modalService.open(PDFViewComponent, {
      size: 'md',
    })
    modelRef.componentInstance.file = file;
    modelRef.componentInstance.data = data;
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
        }
      },
      (error) => {
        this.errorsList = error.errors ? error.errors : error.Errors;
        this.commonService.showError("found some error..!", "Error");
      }

    )
  }
  printClose() {
    this.isPrintShow = false;
  }
  rejected() {
    const modal = this.modal.create<RejectComponent>({
      nzWidth: 600,
      nzContent: RejectComponent,
      nzComponentParams: {
        requestId: this.orderId,
      },
      nzFooter: null
    });
    modal.afterClose.subscribe(res => {
      if (res) {
        // this.controls(value, data, obj, res);
      }
    });
  }
  gotoMainTab() {
    this.isGenerate = false;
    this.orderDetail = JSON.parse(JSON.stringify(this.orderDetailMaster));
  }
  approveRequest() {
    let formData = new FormData();
    formData.append('requestId', this.orderId.toString());
    this.saveLoader = true;
    this.apiService.approveRequest(formData).subscribe(
      (response) => {
        this.saveLoader = false;
        if (response.isSuccess) {
          this.commonService.showSuccess("Data updated successfully..!", "Success");
          this.router.navigate(['/home/workorders'])
        }
        else {
          this.errorsList = response["errors"] ? response["errors"] : response["Errors"];
          this.error(this.errorsList)
          this.commonService.showError("found some error..!", "Error");
        }
      },
      (error) => {
        this.saveLoader = false;
        this.errorsList = error.errors ? error.errors : error.Errors;
        this.error(this.errorsList)
        this.commonService.showError("found some error..!", "Error");
      }
    )
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
    this.commonService.selectedWorkorder = 1
    this.commonService.loadRequestTab = true;
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
      this.router.navigate(['/home/workorders']);
    });
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
        // this.pdfInfoData = res['info'];
        let generatedlist = res['data'];
        let getCount = generatedlist.length;
        for (let index = 0; index < generatedlist.length; index++) {
          const obj = {
            id: Sort == 3 || Sort == 1 ? this.generatedlist.length + 1 : getCount,
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
          getCount -= 1;
        }
        this.displaygeneratedlist = this.generatedlist.length > 6 ? this.generatedlist.slice(0, 6) : this.generatedlist;
        this.initlizePaginationControl();
        this.end = this.displaygeneratedlist.length > 6 ? 6 : this.displaygeneratedlist.length;
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
    this.displaygeneratedlist = this.generatedlist.slice(start, end);
    this.end = this.displaygeneratedlist.length != 6 ? this.generatedlist.length : this.pageIndex * this.pageSize;
  }

  loadCheckGuarantor(customerId) {
    if (customerId) {
      const modalRef = this._modalService.open(CheckGuarantorComponent, {
        size: 'xl',
      });
      modalRef.componentInstance.data = customerId || 0;
    }
  }
}
