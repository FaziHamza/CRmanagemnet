import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonService } from 'src/app/utility/services/common.service';
import { CreateRequestComponent } from '../create-request/create-request.component';
declare var $: any; // Use this line to tell TypeScript that $ is defined elsewhere (by jQuery)

@Component({
  selector: 'app-promissory-note',
  templateUrl: './promissory-note.component.html',
  styleUrls: ['./promissory-note.component.scss']
})
export class PromissoryNoteComponent implements OnInit ,AfterViewInit  {

  constructor(private commonService: CommonService,
    private modal: NzModalService) { }
  current = 0;
  isGenerate = false;
  promissoryist = [];
  generatedlist = [];
  printedlist = [];
  editCache: { [key: number]: { edit: boolean; data: any } } = {};
  ngOnInit(): void {
    this.commonService.breadcrumb = [
      { title: ' Generating Promissory Notes Orders', routeLink: 'home/promissory-note' }
    ]
    this.getListofPromissoryNote();
    this.getGeneratedList();
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
    this.promissoryist = [
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
    const newData = this.promissoryist.map((item, index) => {
      return {
        ...item,
        edit: false
      };
    });
    this.promissoryist = newData;
    this.updateEditCache();
  }
  updateEditCache(): void {
    this.promissoryist.forEach((item, index) => {
      this.editCache[index + 1] = {
        edit: false,
        data: { ...item }
      };
    });
  }
 
  resetFirstList(){
    const newData = this.promissoryist.map((item, index) => {
      return {
        ...item,
        edit: false
      };
    });
    this.promissoryist = newData
  }
  checkReset(){
    return this.promissoryist.find(item => item.edit === true);
  }
  //#endregion
  
  //#region  generated tab 2
  getGeneratedList(){
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

  getPrintedList(){
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
      nzWidth:900,
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
  ngAfterViewInit() {
    $(document).ready(function () {
      debugger
      // hidden things
      $(".form-business").hide();
      $("#successMessage").hide();
      // next button
      $(".next").on({
          click: function () {
              debugger
              // select any card
              var getValue = $(this)
                  .parents(".row")
                  .find(".card")
                  .hasClass("active-card");
              if (getValue) {
                  $("#progressBar").find(".active").next().addClass("active");
                  $("#alertBox").addClass("d-none");
                  $(this)
                      .parents(".row")
                      .fadeOut("slow", function () {
                          $(this).next(".row").fadeIn("slow");
                      });
              } else {
                  $("#alertBox").removeClass("d-none");
              }
          }
      });
      // back button
      $(".back").on({
          click: function () {
              $("#progressBar .active").last().removeClass("active");
              $(this)
                  .parents(".row")
                  .fadeOut("slow", function () {
                      $(this).prev(".row").fadeIn("slow");
                  });
          }
      });
      //finish button
      $(".submit-button").on({
          click: function () {
              $("#wizardRow").fadeOut(300);
              $(this).parents(".row").children("#successForm").fadeOut(300);
              $(this).parents(".row").children("#successMessage").fadeIn(3000);
          }
      });
      //Active card on click function
      $(".card").on({
          click: function () {
              $(this).toggleClass("active-card");
              $(this)
                  .parent(".col")
                  .siblings()
                  .children(".card")
                  .removeClass("active-card");
          }
      });
      //back to wizard
      $(".back-to-wizard").on({
          click: function () {
              location.reload();
          }
      });
  });

  }
}
