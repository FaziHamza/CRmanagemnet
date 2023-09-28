import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartData } from 'chart.js';
import { ApiService } from 'src/app/shared/services/api.service';

import { CommonService } from 'src/app/utility/services/common.service';
import { csvExport } from 'src/app/utility/util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  cardsData = {
    notOverDuePnsTotal: 0,
    overDuePnsTotal: 0,
    pnBooksCount: 0,
    pnBooksNotesCount: 0,
    underCollectingPNBooksNotesCount: 0,
  };
  barChartData: ChartData<'bar'> = {
    labels: [
      'Cash',
      'Credit Card',
      'Cheques',
      'E-Fawateercom',
      'Bank Transfer',
    ],
    datasets: [
      {
        data: [],
        backgroundColor: '#DC3545',
        borderRadius: 32,
        borderSkipped: false,
        barThickness: 32,
      },
    ],
  };
  agingReportData: any;
  pnMonthData: any;
  customerList = [];
  reportTemplates = [];
  templateDetail;
  formGroup: FormGroup;
  dateObj = { fromDate: '', toDate: '' };
  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private _modalService: NgbModal,
    private fb: FormBuilder,
    private _datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.commonService.breadcrumb = [{ title: 'PNs Dashboard', routeLink: '' }];
    this.apiService.getDashboardCards().subscribe((result) => {
      if (result?.isSuccess) {
        this.cardsData = result.data;
      }
    });
    this.initForm();
  }
  initForm() {
    this.formGroup = this.fb.group({
      reportTemplateId: [null],
      date: ['',[Validators.required]],
      customerId: [null,[Validators.required]],
    })
  }
  onDateChange(event) {
    if (event) {
      this.dateObj['fromDate'] = event.length > 0 && this._datePipe.transform(event[0], 'yyyy-MM-dd') || '';
      this.dateObj['toDate'] = event.length > 0 && this._datePipe.transform(event[1], 'yyyy-MM-dd') || '';
    }
  }
  handleTemplateChange(event) {
    let value = +event.target.value
    this.templateDetail = this.reportTemplates.find(x => x.reportTemplateID == value);
    if (value != 4) {
      this.formGroup.get('customerId').clearValidators();
      this.formGroup.get('customerId').updateValueAndValidity();
    }
    else {
      this.formGroup.get('customerId').setValidators([Validators.required]);
      this.formGroup.get('customerId').updateValueAndValidity();
    }
  }
  handleGenerateReport() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    let value = this.formGroup.value;
    let formData = new FormData();
    formData.append("ReportTemplateId", value?.reportTemplateId)
    formData.append("FromDate", this.dateObj['fromDate'])
    formData.append("ToDate", this.dateObj['toDate'])
    formData.append("CustomerId", value?.customerId || '')
    this.apiService.generateReport(formData).subscribe(response => {
      if (response.isSuccess) {
        this.downloadURI(response.data);
      }
    })
  }
  exportToExcelPnMonth(content) {
    this.apiService.getReportTemplate().subscribe(response => {
      this.reportTemplates = response.data;
      this.getCustomerList();
      const options = { windowClass: 'dgr-ngb-modal-window', backdropClass: 'dgr-ngb-modal-backdrop', size: 'lg' };
      const modalRef = this._modalService.open(content, options);
      modalRef.closed.subscribe(x => {
        if (x == 'close') this.formGroup.reset();
      })
    })
  }
  onAgingReportData(data: any) {
    this.agingReportData = data;
  }

  onPnMonthData(data: any) {
    this.pnMonthData = data;
  }

  getCustomerList() {
    this.apiService.getCustomerList().subscribe(response => {
      if (response.data.length > 0) {
        this.customerList = response.data;
      }
    })
  }
  downloadURI(uri: string) {
    var link = document.createElement("a");
    link.setAttribute('target', '_blank');
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  exportToExcel() {
    const header = [
      'Cash',
      'Credit Card',
      'Cheques',
      'E-Fawateercom',
      'Bank Transfer',
    ];
    const data = [header]; 
    const dataRow = this.barChartData.datasets[0].data.map(value => value.toString());
    data.push(dataRow);
    csvExport('Promissory Notes Aging Report', data);
  }
}
