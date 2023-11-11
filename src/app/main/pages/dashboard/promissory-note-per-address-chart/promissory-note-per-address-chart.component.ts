import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

import { ApiService } from 'src/app/shared/services/api.service';


@Component({
  selector: 'app-promissory-note-per-address-chart',
  templateUrl: './promissory-note-per-address-chart.component.html',
  styleUrls: ['./promissory-note-per-address-chart.component.scss']
})
export class PromissoryNotePerAddressChartComponent
  implements OnInit, AfterViewInit {
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
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#C4CDD5', '#253951', '#DC3545'],
      },
    ],
  };
  selectedNotesValue: any={};
  isNotesDropdownOpen = false;
  clickListenerNotesValue: (event: MouseEvent) => void;
  notesList = [
    {
      name: 'All',
      value: 'All',
    },
    {
      name: 'Due PNs',
      value: 'Due',
    },
    {
      name: 'Over Due PNs',
      value: 'Over Due',
    },
    {
      name: 'Both ( Due & Over Due ) PNS',
      value: 'Both',
    },
    {
      name: 'All ( Due - Over Due - Not Due ) PNS',
      value: 'All',
    }
  ];
  data = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.clickListenerNotesValue = (event: MouseEvent) => {
      const dropdownBtn = document.getElementById(
        'dropdownNotesSelectionOrdersMenuBtn'
      );
      const dropdownMenu = document.getElementById(
        'dropdownNotesSelectionOrdersMenu'
      );
      const isClickInsideDropdown =
        dropdownBtn.contains(event.target as Node) ||
        dropdownMenu.contains(event.target as Node);
      if (!isClickInsideDropdown) {
        this.isNotesDropdownOpen = false;
        document.removeEventListener('click', this.clickListenerNotesValue);
      }
    };
  }

  ngAfterViewInit() {
    this.selectedNotesValue['value'] = "All"
    this.selectedNotesValue['name'] = "All"
    this.initChart();
  }

  selectNotesItem(value: any) {
    this.selectedNotesValue = value;
    this.toggleNotesDropdown();
    this.initChart();
  }

  toggleNotesDropdown() {
    this.isNotesDropdownOpen = !this.isNotesDropdownOpen;
    if (this.isNotesDropdownOpen) {
      document.addEventListener('click', this.clickListenerNotesValue);
    } else {
      document.removeEventListener('click', this.clickListenerNotesValue);
    }
  }

  private initChart() {
    this.pieChartData.labels  = [];
    this.data = [];
    this.updateChart();
    this.apiService.getPromissoryNotesPerAddress(this.selectedNotesValue.value).subscribe((result) => {
      if (result?.isSuccess) {
        if (Array.isArray(result.data)) {
          this.data = [];
          const getCusAddress = result.data.map(a => a.custAddress);
          this.pieChartData.labels = getCusAddress;
          result.data.forEach(res => {
            this.data.push(parseFloat(res.amount.toFixed(3)));
          })
        }
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
