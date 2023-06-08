import {
  AfterViewInit,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';

import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-promissory-notes-month-chart',
  templateUrl: './promissory-notes-month-chart.component.html',
  styleUrls: ['./promissory-notes-month-chart.component.scss'],
})
export class PromissoryNotesMonthChartComponent implements AfterViewInit {
  @Output() dataUpdated = new EventEmitter<any>();
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  barChartPlugins = [DataLabelsPlugin];
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 30,
        },
      },
      datalabels: {
        font: {
          size: 8,
        },
        formatter: (value) => {
          return value || '';
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.raw} JOD`;
          },
        },
      },
    },
    scales: {
      y: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          callback: (v: number) => (v >= 1000 ? `${v / 1000}k` : v),
        },
        border: {
          display: false,
        },
      },
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          padding: 20,
        },
      },
      x1: {
        grid: {
          display: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };
  barChartData: ChartData<'bar'> = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        data: [],
        label: 'Total of Collected PNs',
        datalabels: {
          color: '#FFFFFF',
        },
        backgroundColor: '#DC3545',
        borderColor: '#DC3545',
        borderSkipped: false,
        borderRadius: {
          topLeft: 32,
          topRight: 32,
          bottomLeft: 32,
          bottomRight: 32,
        },
        barThickness: this.getBarThickness(),
      },
      {
        data: [],
        label: 'Total of Uncollected PNs',
        datalabels: {
          color: '#FFFFFF',
        },
        backgroundColor: '#253951',
        borderColor: '#253951',
        borderSkipped: false,
        borderRadius: {
          topLeft: 32,
          topRight: 32,
          bottomLeft: 32,
          bottomRight: 32,
        },
        barThickness: this.getBarThickness(),
      },
      {
        data: [],
        xAxisID: 'x1',
        label: 'Total of PNs',
        datalabels: {
          anchor: 'end',
          align: 'top',
          offset: -20,
        },
        backgroundColor: '#D9D9D9',
        borderColor: '#D9D9D9',
        borderSkipped: false,
        borderRadius: {
          topLeft: 32,
          topRight: 32,
          bottomLeft: 32,
          bottomRight: 32,
        },
        barThickness: this.getBarThickness(),
      },
    ],
  };
  selectedYearValue = new Date();
  data: any = {};

  constructor(private apiService: ApiService) {}

  ngAfterViewInit() {
    this.initChart();
  }

  onResize() {
    const barThickness = this.getBarThickness();
    this.barChartData.datasets[0].barThickness = barThickness;
    this.barChartData.datasets[1].barThickness = barThickness;
    this.barChartData.datasets[2].barThickness = barThickness;
    this.chart.update();
  }

  getBarThickness() {
    return window.innerWidth < 620 ? 14 : 32;
  }

  selectYearItem() {
    this.initChart();
  }

  private initChart() {
    const filter: any = {};
    if (this.selectedYearValue) {
      filter.year = this.selectedYearValue.getFullYear();
    } else {
      filter.year = new Date().getFullYear();
    }
    this.apiService.getPromissoryNotesPerYear(filter).subscribe((result) => {
      if (result?.isSuccess) {
        this.data = result.data || {};
        this.dataUpdated.emit(this.data);
      }
      this.updateChart();
    });
  }

  private updateChart() {
    if (!this.chart) {
      return;
    }
    this.barChartData.datasets[0].data = [
      this.data?.january?.collected || 0,
      this.data?.february?.collected || 0,
      this.data?.march?.collected || 0,
      this.data?.april?.collected || 0,
      this.data?.may?.collected || 0,
      this.data?.june?.collected || 0,
      this.data?.july?.collected || 0,
      this.data?.august?.collected || 0,
      this.data?.september?.collected || 0,
      this.data?.october?.collected || 0,
      this.data?.november?.collected || 0,
      this.data?.december?.collected || 0,
    ];
    this.barChartData.datasets[1].data = [
      this.data?.january?.uncollected || 0,
      this.data?.february?.uncollected || 0,
      this.data?.march?.uncollected || 0,
      this.data?.april?.uncollected || 0,
      this.data?.may?.uncollected || 0,
      this.data?.june?.uncollected || 0,
      this.data?.july?.uncollected || 0,
      this.data?.august?.uncollected || 0,
      this.data?.september?.uncollected || 0,
      this.data?.october?.uncollected || 0,
      this.data?.november?.uncollected || 0,
      this.data?.december?.uncollected || 0,
    ];
    this.barChartData.datasets[2].data = [
      this.data?.january?.total || 0,
      this.data?.february?.total || 0,
      this.data?.march?.total || 0,
      this.data?.april?.total || 0,
      this.data?.may?.total || 0,
      this.data?.june?.total || 0,
      this.data?.july?.total || 0,
      this.data?.august?.total || 0,
      this.data?.september?.total || 0,
      this.data?.october?.total || 0,
      this.data?.november?.total || 0,
      this.data?.december?.total || 0,
    ];
    this.chart.update();
  }
}
