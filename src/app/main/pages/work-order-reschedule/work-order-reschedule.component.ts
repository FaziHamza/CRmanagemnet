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
  orderId = 0;
  pdfInfoData :any;
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
      // this.orderDetail = res.data;
      this.orderDetail = {
        "orderId": 15,
        "orderTypeId": 7002,
        "orderType": {
            "lookupId": 7002,
            "lookupBGColor": null,
            "lookupTextColor": null,
            "description": "Direct Payment Sales Orders",
            "translations": [
                {
                    "languageId": 1001,
                    "lookupName": "Direct Payment Sales Orders"
                }
            ]
        },
        "vinId": 210168264,
        "orderDetail": {
            "vinId": 210168264,
            "vinNo": "JTDKBRFU6H3029000",
            "plateNumber": "25-25893",
            "brand": {
                "brandId": 24,
                "brand": "Yamaha"
            },
            "model": {
                "modelId": 10038928,
                "modelName": "MT-07"
            }
        },
        "customer": {
            "customerId": 100218,
            "customerName": "عامر مروان فوزي الحسين",
            "email": null,
            "mobile": "962790000022",
            "profileImage": null,
            "remainingAvailableCredit": 0,
            "creditLimit": 0,
            "consumedCredit": 0,
            "onAccountAllowed": false,
            "custAddress": null,
            "identityFile1": null,
            "identityFile2": null,
            "nationalId": null
        },
        "totalAmount": 1000,
        "pnTotalAmount": 1000,
        "remainingAmount": 1000,
        "rescheduleInterest": null,
        "orderQNTRLLink": "www.google.com",
        "branch": null,
        "orderDate": "2023-10-08T00:00:00",
        "salesConsultantId": 101173,
        "salesConsultant": {
            "salesConsultantId": 101173,
            "salesConsultantName": "Osama Abu Obaid"
        },
        "opportunityNo": "77-ggg",
        "numberOfInstallments": 10,
        "startDate": "2023-11-11T00:00:00",
        "newStartDate": null,
        "newNumberOfInstallments": null,
        "guarantorId": 100217,
        "guarantor": {
            "customerId": 100217,
            "customerName": "ايوب داوود مجلي يعقوب",
            "email": null,
            "mobile": "962790000021",
            "profileImage": null,
            "remainingAvailableCredit": 0,
            "creditLimit": 0,
            "consumedCredit": 0,
            "onAccountAllowed": false,
            "custAddress": null,
            "identityFile1": null,
            "identityFile2": null,
            "nationalId": null
        },
        "statusObj": {
            "lookupId": 21001,
            "lookupBGColor": "#FFF3DB",
            "lookupTextColor": "#FFB155",
            "description": "Pending",
            "translations": [
                {
                    "languageId": 1001,
                    "lookupName": "Pending"
                }
            ]
        },
        "book": null
    }
      // if (this.orderDetail) {
      //   if (this.orderDetail.statusObj) {
      //     if (this.orderDetail.statusObj?.translations[0].lookupName.toLowerCase() == 'generated') {
      //       this.getGeneratedList(1);
      //     }
      //     else if (this.orderDetail.statusObj?.translations[0].lookupName.toLowerCase() == 'printed') {
      //       this.getGeneratedList(2);
      //     }
      //     else if (this.orderDetail.statusObj?.translations[0].lookupName.toLowerCase() == 'signed') {
      //       this.getGeneratedList(3);
      //     }
      //     else if (this.orderDetail.statusObj?.translations[0].lookupName.toLowerCase() == 'under collecting') {
      //       this.getGeneratedList(4);
      //     }
      //     else if (this.orderDetail.statusObj?.translations[0].lookupName.toLowerCase() == 'collected') {
      //       this.getGeneratedList(5);
      //     }
      //     else {
      //       if (this.orderDetail.statusObj?.translations[0].lookupName.toLowerCase() == 'pending')
      //         this.getCmsSetup();
      //     }
      //   }

      // }
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
    for (let index = 0; index < this.orderDetail.numberOfInstallments; index++) {
      const dueDate = new Date(this.orderDetail.startDate);
      if (this.cmsSetup.periodBetweenPNType.toLowerCase() == "months") {
        dueDate.setMonth(dueDate.getMonth() + (index * this.cmsSetup.periodBetweenPNValue)); // Add 6 days for each iteration
      } else {
        dueDate.setDate(dueDate.getDate() + (index * this.cmsSetup.periodBetweenPNValue)); // Add 6 days for each iteration
      }

      const obj = {
        id: this.promissoryist.length + 1,
        customerName: this.orderDetail.customer.customerName,
        amount: this.orderDetail.pnTotalAmount / this.orderDetail.numberOfInstallments,
        orginalAmount: this.orderDetail.pnTotalAmount / this.orderDetail.numberOfInstallments,
        dueDate: this.datePipe.transform(dueDate, 'yyyy-MM-dd'),
        originalDueDate: this.datePipe.transform(dueDate, 'yyyy-MM-dd'),
        status: 'Generating',
        edit: false
      };

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
    this.changeAmount(id, true);
  }
  //#endregion

  //#region  generated tab 2
  getGeneratedList(index:number) {
    this.stepSaveLoader = true;
    this.apiService.getPNOrderBookNotes(this.orderId).subscribe(res => {
      this.stepSaveLoader = false;
      if (res.isSuccess) {
        
        this.generatedlist = [];
        this.pdfInfoData = res.data['info'];
        let generatedlist = res.data['data'];
        const currentDate = new Date(); // Current date
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
        data:this.orderId
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
  pdfView(file: any,data?:any): void {
    const modal = this.modal.create<PDFViewComponent>({
      nzWidth: 600,
      nzContent: PDFViewComponent,
      nzComponentParams: {
        file: file,
        data:data
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
  printAll(status:any) {
    let formData = new FormData();
    formData.append('PNBookId', this.generatedlist[0].pnBookID);
    formData.append('Status', status);
    this.apiService.updatePNBookStatus(formData).subscribe(
      (response)=>{
        if (response.isSuccess) {
          this.isPrintShow = false;
          this.ngOnInit();
        }
      },
      (error)=>{
        this.errorsList = error.errors ? error.errors : error.Errors;
        this.commonService.showError("found some error..!", "Error");
      }
      
    )
  }
  printClose() {
    this.isPrintShow = false;
  }
}
