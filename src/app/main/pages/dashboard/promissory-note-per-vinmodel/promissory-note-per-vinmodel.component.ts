import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

import { ApiService } from 'src/app/shared/services/api.service';


@Component({
  selector: 'app-promissory-note-per-vinmodel',
  templateUrl: './promissory-note-per-vinmodel.component.html',
  styleUrls: ['./promissory-note-per-vinmodel.component.scss']
})
export class PromissoryNotePerVINModelComponent
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
    labels: [
      'Due Amount',
      'Over Due Amount',
      'Not Due Amount',
    ],
    datasets: [
      {
        data: [],
        backgroundColor: ['#C4CDD5', '#253951', '#DC3545'],
      },
    ],
  };
  selectedBrandValue: any = null;
  selectedModelValue: any = null;
  isBrandDropdownOpen = false;
  isModelDropdownOpen = false;
  clickListenerBrandValue: (event: MouseEvent) => void;
  clickListenerModelValue: (event: MouseEvent) => void;
  brandList: any[] = [];
  modelList: any[] = [];
  data = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.clickListenerBrandValue = (event: MouseEvent) => {
      const dropdownBtn = document.getElementById(
        'dropdownBrandSelectionOrdersMenuBtn'
      );
      const dropdownMenu = document.getElementById(
        'dropdownBrandSelectionOrdersMenu'
      );
      const isClickInsideDropdown =
        dropdownBtn.contains(event.target as Node) ||
        dropdownMenu.contains(event.target as Node);
      if (!isClickInsideDropdown) {
        this.isBrandDropdownOpen = false;
        document.removeEventListener('click', this.clickListenerBrandValue);
      }
    };
    this.clickListenerModelValue = (event: MouseEvent) => {
      const dropdownBtn = document.getElementById(
        'dropdownModelSelectionOrdersMenuBtn'
      );
      const dropdownMenu = document.getElementById(
        'dropdownModelSelectionOrdersMenu'
      );
      const isClickInsideDropdown =
        dropdownBtn.contains(event.target as Node) ||
        dropdownMenu.contains(event.target as Node);
      if (!isClickInsideDropdown) {
        this.isModelDropdownOpen = false;
        document.removeEventListener('click', this.clickListenerModelValue);
      }
    };
    this.loadBrand();
  }

  ngAfterViewInit() {
    // this.initChart();
  }


  selectBrandItem(value: any) {
    this.selectedBrandValue = value;
    this.modelList = [];
    this.data = [];
    this.updateChart();
    this.toggleBrandDropdown();
    this.loadModel();
    // this.initChart();
  }
  selectModelItem(value: any) {
    this.selectedModelValue = value;
    this.toggleModelDropdown();
    this.initChart();
  }
  loadBrand() {
    this.apiService.getBrandList().subscribe(res => {
      if (res)
        this.brandList = res;
    })
  }
  loadModel() {
    const brandId = this.selectedBrandValue.brandID
    this.apiService.getModelList(brandId).subscribe(res => {
      if (res)
        this.modelList = res;
    })
  }
  toggleBrandDropdown() {
    this.isBrandDropdownOpen = !this.isBrandDropdownOpen;
    if (this.isBrandDropdownOpen) {
      document.addEventListener('click', this.clickListenerBrandValue);
    } else {
      document.removeEventListener('click', this.clickListenerBrandValue);
    }
  }
  toggleModelDropdown() {
    this.isModelDropdownOpen = !this.isModelDropdownOpen;
    if (this.isModelDropdownOpen) {
      document.addEventListener('click', this.clickListenerModelValue);
    } else {
      document.removeEventListener('click', this.clickListenerModelValue);
    }
  }

  private initChart() {
    const filter: any = {};
    if (this.selectedModelValue) {
      filter.CarModelid = this.selectedModelValue.modelID;
    }
    this.apiService.getPromissoryNotesPerCarModel(filter).subscribe((result) => {
      if (result?.isSuccess) {
        this.data = [
          result.data.dueAmount,
          result.data.overDueAmount,
          result.data.notDueAmount,
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
