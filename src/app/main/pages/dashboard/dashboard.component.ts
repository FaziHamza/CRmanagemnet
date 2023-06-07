import { Component, OnInit } from '@angular/core';
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
  agingReportData: any;
  pnMonthData: any;

  constructor(
    private commonService: CommonService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.commonService.breadcrumb = [{ title: 'PNs Dashboard', routeLink: '' }];
    this.apiService.getDashboardCards().subscribe((result) => {
      if (result?.isSuccess) {
        this.cardsData = result.data;
      }
    });
  }

  onAgingReportData(data: any) {
    this.agingReportData = data;
  }

  onPnMonthData(data: any) {
    this.pnMonthData = data;
  }

  exportToExcelPnMonth() {
    const data = [
      [
        'Month',
        'Total of Collected PNs',
        'Total of Uncollected PNs',
        'Total of PNs',
      ],
      [
        'Jan',
        this.pnMonthData?.january?.collected || 0,
        this.pnMonthData?.january?.uncollected || 0,
        this.pnMonthData?.january?.total || 0,
      ],
      [
        'Feb',
        this.pnMonthData?.february?.collected || 0,
        this.pnMonthData?.february?.uncollected || 0,
        this.pnMonthData?.february?.total || 0,
      ],
      [
        'Mar',
        this.pnMonthData?.march?.collected || 0,
        this.pnMonthData?.march?.uncollected || 0,
        this.pnMonthData?.march?.total || 0,
      ],
      [
        'Apr',
        this.pnMonthData?.april?.collected || 0,
        this.pnMonthData?.april?.uncollected || 0,
        this.pnMonthData?.april?.total || 0,
      ],
      [
        'May',
        this.pnMonthData?.may?.collected || 0,
        this.pnMonthData?.may?.uncollected || 0,
        this.pnMonthData?.may?.total || 0,
      ],
      [
        'Jun',
        this.pnMonthData?.june?.collected || 0,
        this.pnMonthData?.june?.uncollected || 0,
        this.pnMonthData?.june?.total || 0,
      ],
      [
        'Jul',
        this.pnMonthData?.july?.collected || 0,
        this.pnMonthData?.july?.uncollected || 0,
        this.pnMonthData?.july?.total || 0,
      ],
      [
        'Aug',
        this.pnMonthData?.august?.collected || 0,
        this.pnMonthData?.august?.uncollected || 0,
        this.pnMonthData?.august?.total || 0,
      ],
      [
        'Sep',
        this.pnMonthData?.september?.collected || 0,
        this.pnMonthData?.september?.uncollected || 0,
        this.pnMonthData?.september?.total || 0,
      ],
      [
        'Oct',
        this.pnMonthData?.october?.collected || 0,
        this.pnMonthData?.october?.uncollected || 0,
        this.pnMonthData?.october?.total || 0,
      ],
      [
        'Nov',
        this.pnMonthData?.november?.collected || 0,
        this.pnMonthData?.november?.uncollected || 0,
        this.pnMonthData?.november?.total || 0,
      ],
      [
        'Dec',
        this.pnMonthData?.december?.collected || 0,
        this.pnMonthData?.december?.uncollected || 0,
        this.pnMonthData?.december?.total || 0,
      ],
    ];
    csvExport('Promissory Notes Per Month', data);
  }
}
