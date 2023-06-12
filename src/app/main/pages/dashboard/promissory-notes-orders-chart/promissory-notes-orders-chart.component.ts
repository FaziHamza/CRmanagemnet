import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-promissory-notes-orders-chart',
  templateUrl: './promissory-notes-orders-chart.component.html',
  styleUrls: ['./promissory-notes-orders-chart.component.scss'],
})
export class PromissoryNotesOrdersChartComponent
  implements OnInit, AfterViewInit
{
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  pieChartPlugins = [DataLabelsPlugin];
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        align: 'center',
        labels: {
          usePointStyle: true,
          color: '#2D3047',
          padding: 16,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        formatter: (value, ctx) => {
          let sum = 0;
          ctx.chart.data.datasets[0].data.map((data) => {
            if (typeof data === 'number') {
              sum += data;
            }
          });
          return `${value}\n${((value * 100) / sum).toFixed(2)}%`;
        },
        color: '#fff',
      },
    },
  };
  pieChartData: ChartData<'pie'> = {
    labels: [
      'No. Of Generating Order',
      'No. Of Reschedule Order',
      'No. Of Transferring Order',
    ],
    datasets: [
      {
        data: [],
        backgroundColor: ['#C4CDD5', '#253951', '#DC3545'],
      },
    ],
  };
  selectedYearValue = new Date();
  selectedMonthValue: any = null;
  isMonthDropdownOpen = false;
  clickListenerMonthValue: (event: MouseEvent) => void;
  months = [
    {
      name: 'January',
      value: 1,
    },
    {
      name: 'February',
      value: 2,
    },
    {
      name: 'March',
      value: 3,
    },
    {
      name: 'April',
      value: 4,
    },
    {
      name: 'May',
      value: 5,
    },
    {
      name: 'June',
      value: 6,
    },
    {
      name: 'July',
      value: 7,
    },
    {
      name: 'August',
      value: 8,
    },
    {
      name: 'September',
      value: 9,
    },
    {
      name: 'October',
      value: 10,
    },
    {
      name: 'November',
      value: 11,
    },
    {
      name: 'December',
      value: 12,
    },
  ];
  data = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.clickListenerMonthValue = (event: MouseEvent) => {
      const dropdownBtn = document.getElementById(
        'dropdownMonthSelectionOrdersMenuBtn'
      );
      const dropdownMenu = document.getElementById(
        'dropdownMonthSelectionOrdersMenu'
      );
      const isClickInsideDropdown =
        dropdownBtn.contains(event.target as Node) ||
        dropdownMenu.contains(event.target as Node);
      if (!isClickInsideDropdown) {
        this.isMonthDropdownOpen = false;
        document.removeEventListener('click', this.clickListenerMonthValue);
      }
    };
    const currentMonth = new Date().getMonth() + 1;
    this.selectedMonthValue = this.months.find(
      (month) => month.value === currentMonth
    );
  }

  ngAfterViewInit() {
    this.initChart();
  }

  onViewAll() {
    this.selectedYearValue = null;
    this.selectedMonthValue = null;
    this.initChart();
  }

  selectYearItem() {
    this.initChart();
  }

  selectMonthItem(value: any) {
    this.selectedMonthValue = value;
    this.toggleMonthDropdown();
    this.initChart();
  }

  toggleMonthDropdown() {
    this.isMonthDropdownOpen = !this.isMonthDropdownOpen;
    if (this.isMonthDropdownOpen) {
      document.addEventListener('click', this.clickListenerMonthValue);
    } else {
      document.removeEventListener('click', this.clickListenerMonthValue);
    }
  }

  private initChart() {
    const filter: any = {};
    if (this.selectedYearValue) {
      filter.year = this.selectedYearValue.getFullYear();
    }
    if (this.selectedMonthValue) {
      filter.Month = this.selectedMonthValue.value;
    }
    this.apiService.getPromissoryNotesOrders(filter).subscribe((result) => {
      if (result?.isSuccess) {
        this.data = [
          result.data.pnOrders,
          result.data.resheduledOder,
          result.data.transfereOder,
        ];
      }
      this.updateChart();
    });
  }

  private updateChart() {
    if (!this.chart) {
      return;
    }
    this.pieChartData.datasets[0].data = this.data || [];
    this.chart.update();
  }
}
