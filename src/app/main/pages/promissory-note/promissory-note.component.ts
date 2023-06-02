import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonService } from 'src/app/utility/services/common.service';
import { CreateRequestComponent } from '../create-request/create-request.component';
import { ApiService } from 'src/app/shared/services/api.service';
import { PDFViewComponent } from '../pdfview/pdfview.component';
import { DatePipe } from '@angular/common';
import { CmsSetupDto } from '../../models/cmsSetupDto';
declare var $: any; // Use this line to tell TypeScript that $ is defined elsewhere (by jQuery)

@Component({
  selector: 'app-promissory-note',
  templateUrl: './promissory-note.component.html',
  styleUrls: ['./promissory-note.component.scss']
})
export class PromissoryNoteComponent implements OnInit, AfterViewInit {

  constructor(public commonService: CommonService, private router: Router,
    private activatedRoute: ActivatedRoute, private apiService: ApiService,
    private modal: NzModalService, private cdr: ChangeDetectorRef, private datePipe: DatePipe) { }
  current = 0;
  isGenerate = false;
  saveLoader = false;
  promissoryist = [];
  generatedlist = [];
  printedlist = [];
  orderDetail: any;
  orderId = 0;
  errorsList:any[] = [];
  differenceAmount = 0;
  cmsSetup: any = new CmsSetupDto('');
  editCache: { [key: number]: { edit: boolean; data: any } } = {};
  stepSaveLoader = false;
  isVisible = false;
  ngOnInit(): void {
    this.commonService.breadcrumb = [
      { title: ' Generating Promissory Notes Orders', routeLink: 'home/promissory-note' }
    ]
    this.activatedRoute.params.subscribe(res => {
      if (res) {
        this.orderId = res['id'];
        this.getPNOrderDetails();
        // this.getListofPromissoryNote();
        this.getGeneratedList();
        this.getCmsSetup();
        // console.log(this.orderId);
      }
    })
  }
  getPNOrderDetails() {
    this.saveLoader = true;
    this.apiService.getPNOrders(this.orderId).subscribe(res => {
      debugger
      this.saveLoader = false;
      this.orderDetail = res.data;
      if (this.orderDetail.statusObj) {
        if (this.orderDetail.statusObj?.translations[0].lookupName.toLowerCase() == 'generated') {
          this.isGenerate = true;
          this.current = 1;
        }
      }
    })
  }
  pre(): void {
    this.current -= 1;
  }

  next(): void {
    debugger
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
        amount: element.amount,
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
          this.errorsList=res["Errors"];
          this.commonService.showError("found some error..!", "Error");
        }
      },
      (error) => {
        this.stepSaveLoader = false;
        this.isVisible = true;
        this.errorsList = error.Errors;;
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
  getGeneratedList() {
    this.generatedlist = [
      {
        "id": 1,
        "customer": {
          "customerId": 100531,
          "customerName": "شركة الصادق لصناعة المطهرات والاكياس والفلاتر",
          "email": null,
          "mobile": "962790000091",
          "nationalId": null
        },
        "vinId": 99999,
        "createdBy": {
          "userId": 900088,
          "fullName": "test 1"
        },
        "statusObj": [
          {
            "statusId": 10006,
            "statusName": "Pending"
          }
        ],
        "status": 10006,
        "grandAmount": 566.82,
        "orderDate": "2023-05-25T16:36:20.372218",
        "salesNote": "",
        "paymentType": "Cash",
        "pnStartDate": "2023-05-25T13:36:20.263",
        "pnEndDate": "2023-05-25T13:36:20.263",
        "collection": null
      },
      {
        "id": 2,
        "customer": {
          "customerId": 100135,
          "customerName": "شركة كلية القدس",
          "email": null,
          "mobile": "962790000012",
          "nationalId": null
        },
        "vinId": 99999,
        "createdBy": {
          "userId": 900088,
          "fullName": "test 1"
        },
        "statusObj": [
          {
            "statusId": 10002,
            "statusName": "Printed"
          }
        ],
        "status": 10002,
        "grandAmount": 202.814,
        "orderDate": "2023-05-25T15:32:10.1908768",
        "salesNote": "",
        "paymentType": "Cash",
        "pnStartDate": "2023-05-25T12:32:10.14",
        "pnEndDate": "2023-05-25T12:32:10.14",
        "collection": null
      },
      {
        "id": 3,
        "customer": {
          "customerId": 100252,
          "customerName": "شركة الفاهوم وشركاه التعليمية /مدارس اكاديمية عمان",
          "email": null,
          "mobile": "962790000026",
          "nationalId": null
        },
        "vinId": 99999,
        "createdBy": {
          "userId": 900088,
          "fullName": "test 1"
        },
        "statusObj": [
          {
            "statusId": 10004,
            "statusName": "Signed"
          }
        ],
        "status": 10004,
        "grandAmount": 37.676,
        "orderDate": "2023-05-25T15:31:25.5362716",
        "salesNote": "note order 2",
        "paymentType": "Cash",
        "pnStartDate": "2023-05-25T12:31:25.49",
        "pnEndDate": "2023-05-25T12:31:25.49",
        "collection": null
      },
      {
        "id": 4,
        "customer": {
          "customerId": 101009,
          "customerName": "عدنان سعيد سعود ابو ضريس وشركاه",
          "email": null,
          "mobile": "962790000187",
          "nationalId": null
        },
        "vinId": 99999,
        "createdBy": {
          "userId": 900088,
          "fullName": "test 1"
        },
        "statusObj": [
          {
            "statusId": 10006,
            "statusName": "Collected"
          }
        ],
        "status": 10006,
        "grandAmount": 227.198,
        "orderDate": "2023-05-25T15:29:32.6528327",
        "salesNote": "notee",
        "paymentType": "Cash",
        "pnStartDate": "2023-05-25T12:29:32.357",
        "pnEndDate": "2023-05-25T12:29:32.357",
        "collection": null
      }
    ]
  }
  //#endregion

  //#region Printed Tab 3

  getPrintedList() {
    this.printedlist = [
      {
        "id": 1,
        "customer": {
          "customerId": 100531,
          "customerName": "شركة الصادق لصناعة المطهرات والاكياس والفلاتر",
          "email": null,
          "mobile": "962790000091",
          "nationalId": null
        },
        "vinId": 99999,
        "createdBy": {
          "userId": 900088,
          "fullName": "test 1"
        },
        "statusObj": [
          {
            "statusId": 10006,
            "statusName": "Pending"
          }
        ],
        "status": 10006,
        "grandAmount": 566.82,
        "orderDate": "2023-05-25T16:36:20.372218",
        "salesNote": "",
        "paymentType": "Cash",
        "pnStartDate": "2023-05-25T13:36:20.263",
        "pnEndDate": "2023-05-25T13:36:20.263",
        "collection": null
      },
      {
        "id": 2,
        "customer": {
          "customerId": 100135,
          "customerName": "شركة كلية القدس",
          "email": null,
          "mobile": "962790000012",
          "nationalId": null
        },
        "vinId": 99999,
        "createdBy": {
          "userId": 900088,
          "fullName": "test 1"
        },
        "statusObj": [
          {
            "statusId": 10002,
            "statusName": "Printed"
          }
        ],
        "status": 10002,
        "grandAmount": 202.814,
        "orderDate": "2023-05-25T15:32:10.1908768",
        "salesNote": "",
        "paymentType": "Cash",
        "pnStartDate": "2023-05-25T12:32:10.14",
        "pnEndDate": "2023-05-25T12:32:10.14",
        "collection": null
      },
      {
        "id": 3,
        "customer": {
          "customerId": 100252,
          "customerName": "شركة الفاهوم وشركاه التعليمية /مدارس اكاديمية عمان",
          "email": null,
          "mobile": "962790000026",
          "nationalId": null
        },
        "vinId": 99999,
        "createdBy": {
          "userId": 900088,
          "fullName": "test 1"
        },
        "statusObj": [
          {
            "statusId": 10004,
            "statusName": "Signed"
          }
        ],
        "status": 10004,
        "grandAmount": 37.676,
        "orderDate": "2023-05-25T15:31:25.5362716",
        "salesNote": "note order 2",
        "paymentType": "Cash",
        "pnStartDate": "2023-05-25T12:31:25.49",
        "pnEndDate": "2023-05-25T12:31:25.49",
        "collection": null
      },
      {
        "id": 4,
        "customer": {
          "customerId": 101009,
          "customerName": "عدنان سعيد سعود ابو ضريس وشركاه",
          "email": null,
          "mobile": "962790000187",
          "nationalId": null
        },
        "vinId": 99999,
        "createdBy": {
          "userId": 900088,
          "fullName": "test 1"
        },
        "statusObj": [
          {
            "statusId": 10006,
            "statusName": "Collected"
          }
        ],
        "status": 10006,
        "grandAmount": 227.198,
        "orderDate": "2023-05-25T15:29:32.6528327",
        "salesNote": "notee",
        "paymentType": "Cash",
        "pnStartDate": "2023-05-25T12:29:32.357",
        "pnEndDate": "2023-05-25T12:29:32.357",
        "collection": null
      }
    ]
  }
  //#endregion

  createRequest(): void {
    const modal = this.modal.create<CreateRequestComponent>({
      nzWidth: 900,
      // nzTitle: 'Change Control Value',
      nzContent: CreateRequestComponent,
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
  pdfView(file: any): void {
    const modal = this.modal.create<PDFViewComponent>({
      nzWidth: 900,
      nzContent: PDFViewComponent,
      nzComponentParams: {
        data: file,
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
}

