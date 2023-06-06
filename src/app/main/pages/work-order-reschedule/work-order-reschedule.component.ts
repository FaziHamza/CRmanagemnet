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
declare var $: any; // Use this line to tell TypeScript that $ is defined elsewhere (by jQuery)

@Component({
  selector: 'app-work-order-reschedule',
  templateUrl: './work-order-reschedule.component.html',
  styleUrls: ['./work-order-reschedule.component.scss']
})

export class WorkOrderRescheduleComponent implements OnInit, AfterViewInit {

  constructor(public commonService: CommonService, private router: Router,
    private activatedRoute: ActivatedRoute, private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private modal: NzModalService, private cdr: ChangeDetectorRef, private datePipe: DatePipe) { }
  current = 0;
  isGenerate = false;
  saveLoader = false;
  promissoryist = [];
  generatedlist = [];
  orderDetail: any;
  orderDetailMaster: any;
  orderId = 0;
  pdfInfoData: any;
  versionTab: any[] = [];
  errorsList: any[] = [];
  differenceAmount = 0;
  cmsSetup: any = new CmsSetupDto('');
  editCache: { [key: number]: { edit: boolean; data: any } } = {};
  stepSaveLoader = false;
  isVisible = false;
  isPrintShow = false;
  safeUrl: any;
  ngOnInit(): void {
    this.commonService.breadcrumb = [
      { title: ' Rescheduling Promissory Notes Orders', routeLink: 'home/promissory-note' }
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
    this.apiService.getRescheduleRequestDetails(this.orderId).subscribe(res => {

      this.saveLoader = false;
      this.orderDetail = res.data;
      this.orderDetailMaster = JSON.parse(JSON.stringify(res.data));
      this.versionTab = res.data['versions'];
      for (let index = 0; index < res.data['versions'].length; index++) {
        // const element = res.data['versions'][index];
        this.versionTab[index]['tabName'] = 'PN V'+(index+1);
      }
      this.versionTab.push(res.data);
      this.versionTab[this.versionTab.length-1]['tabName'] = 'PN V'+this.versionTab.length;
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

  saveGeneratingNotes() {
    this.stepSaveLoader = true;
    let notes: any = [];
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
          this.isVisible = true;
          this.errorsList = res["errors"] ? res["errors"] : res["Errors"];
          this.commonService.showError("found some error..!", "Error");
        }
      },
      (error) => {
        this.stepSaveLoader = false;
        this.isVisible = true;
        this.errorsList = error.errors ? error.errors : error.Errors;
        this.commonService.showError("found some error..!", "Error");
      }
    )

  }
  //#endregion

  //#region  generated tab 2
  getGeneratedList(item: any) {

    if (item.versions) {
      this.gotoMainTab();
    } else {
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
      this.apiService.getPNOrderBookNotes(this.orderDetailMaster?.pnOrderID).subscribe(res => {
        this.stepSaveLoader = false;
        if (res.isSuccess) {
          this.generatedlist = [];
          // this.pdfInfoData = res.data['info'];
          let generatedlist = res.data['data'];
          for (let index = 0; index < generatedlist.length; index++) {
            const obj = {
              id: this.generatedlist.length + 1,
              customerName: generatedlist[index]?.customer?.customerName,
              // customerName: this.orderDetail.customer.customerName,
              amount: generatedlist[index].pnAmount,
              dueDate: generatedlist[index].dueDate,
              status: generatedlist[index].statusObj.translations[0].lookupName,
              lookupBGColor: generatedlist[index].statusObj.lookupBGColor,
              lookupTextColor: generatedlist[index].statusObj.lookupTextColor,
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
    let amount = 0;
    this.promissoryist.forEach(element => {
      if (element.id === id && !check) {
        amount += this.editCache[id].data.amount
      }
      else
        amount += element.amount
    });
    this.differenceAmount = this.orderDetail.pnTotalAmount - amount;
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
  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
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
  error(errorsList:any) {
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
}
