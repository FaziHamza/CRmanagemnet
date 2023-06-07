import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-promissory-notes-aging-chart',
  templateUrl: './promissory-notes-aging-chart.component.html',
  styleUrls: ['./promissory-notes-aging-chart.component.scss'],
})
export class PromissoryNotesAgingChartComponent implements OnChanges {
  @Input() data = [];
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.raw} JD`;
          },
        },
      },
    },
    scales: {
      y: {
        grid: {
          display: false,
        },
        ticks: {
          callback: (v: number) => (v >= 1000 ? `${v / 1000}k` : v),
        },
        beginAtZero: false,
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };
  barChartData: ChartData<'bar'> = {
    labels: [
      'Over Due',
      '0-30',
      '31-60',
      '61-90',
      '91-120',
      '121-180',
      '180+',
      'Not Due',
    ],
    datasets: [{ data: [], backgroundColor: '#DC3545' }],
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChart();
  }

  getTotalBy(prop: string): number {
    let total = 0;
    if (this.data?.length) {
      this.data.forEach((entry) => (total += entry[prop] || 0));
    }
    return total;
  }

  private updateChart() {
    if (!this.chart) {
      return;
    }
    if (this.data) {
      this.barChartData.datasets[0].data = [
        this.getTotalBy('overDuePnsTotal'),
        this.getTotalBy('lookup25001'),
        this.getTotalBy('lookup25002'),
        this.getTotalBy('lookup25003'),
        this.getTotalBy('lookup25004'),
        this.getTotalBy('lookup25005'),
        this.getTotalBy('lookup25006'),
        this.getTotalBy('uncollectd'),
      ];
    } else {
      this.barChartData.datasets[0].data = [];
    }
    this.chart.update();
  }
}
