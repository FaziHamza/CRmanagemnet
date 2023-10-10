import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ApiService } from 'src/app/shared/services/api.service';
import { csvExport } from 'src/app/utility/util';

@Component({
  selector: 'app-promissory-notes-payments-chart',
  templateUrl: './promissory-notes-payments-chart.component.html',
  styleUrls: ['./promissory-notes-payments-chart.component.scss'],
})
export class PromissoryNotesPaymentsChartComponent implements OnInit, AfterViewInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };
  @Input() barChartData: ChartData<'bar'> = {
    labels: [
      'Cash',
      'Credit Card',
      'Cheques',
      // 'E-Fawateercom',
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
  selectedYearValue = 'This Year';
  isYearDropdownOpen = false;
  clickListenerYearValue: (event: MouseEvent) => void;
  selectedMonthValue = 'This Month';
  isMonthDropdownOpen = false;
  clickListenerMonthValue: (event: MouseEvent) => void;
  selectedWeekValue = 'This Week';
  isWeekDropdownOpen = false;
  clickListenerWeekValue: (event: MouseEvent) => void;
  constructor(private apiService: ApiService) {}
  ngOnInit(): void {
    this.clickListenerYearValue = (event: MouseEvent) => {
      const dropdownBtn = document.getElementById(
        'dropdownYearSelectionPaymentsMenuBtn'
      );
      const dropdownMenu = document.getElementById(
        'dropdownYearSelectionPaymentsMenu'
      );
      const isClickInsideDropdown =
        dropdownBtn.contains(event.target as Node) ||
        dropdownMenu.contains(event.target as Node);
      if (!isClickInsideDropdown) {
        this.isYearDropdownOpen = false;
        document.removeEventListener('click', this.clickListenerYearValue);
      }
    };
    this.clickListenerMonthValue = (event: MouseEvent) => {
      const dropdownBtn = document.getElementById(
        'dropdownMonthSelectionPaymentsMenuBtn'
      );
      const dropdownMenu = document.getElementById(
        'dropdownMonthSelectionPaymentsMenu'
      );
      const isClickInsideDropdown =
        dropdownBtn.contains(event.target as Node) ||
        dropdownMenu.contains(event.target as Node);
      if (!isClickInsideDropdown) {
        this.isMonthDropdownOpen = false;
        document.removeEventListener('click', this.clickListenerMonthValue);
      }
    };
    this.clickListenerWeekValue = (event: MouseEvent) => {
      const dropdownBtn = document.getElementById(
        'dropdownWeekSelectionPaymentsMenuBtn'
      );
      const dropdownMenu = document.getElementById(
        'dropdownWeekSelectionPaymentsMenu'
      );
      const isClickInsideDropdown =
        dropdownBtn.contains(event.target as Node) ||
        dropdownMenu.contains(event.target as Node);
      if (!isClickInsideDropdown) {
        this.isWeekDropdownOpen = false;
        document.removeEventListener('click', this.clickListenerWeekValue);
      }
    };
  }
  ngAfterViewInit() {
    this.initChart();
  }

  selectYearItem(value: string) {
    this.selectedYearValue = value;
    this.toggleYearDropdown();
    this.initChart();
  }

  toggleYearDropdown() {
    this.isYearDropdownOpen = !this.isYearDropdownOpen;
    if (this.isYearDropdownOpen) {
      document.addEventListener('click', this.clickListenerYearValue);
    } else {
      document.removeEventListener('click', this.clickListenerYearValue);
    }
  }

  selectMonthItem(value: string) {
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

  selectWeekItem(value: string) {
    this.selectedWeekValue = value;
    this.toggleWeekDropdown();
    this.initChart();
  }

  toggleWeekDropdown() {
    this.isWeekDropdownOpen = !this.isWeekDropdownOpen;
    if (this.isWeekDropdownOpen) {
      document.addEventListener('click', this.clickListenerWeekValue);
    } else {
      document.removeEventListener('click', this.clickListenerWeekValue);
    }
  }

  data = [];
  private initChart() {
    const filter: any = {};
    if (this.selectedYearValue) {
      filter.ThisYear = this.selectedYearValue == 'This Year' ? true : false;;
    }
    if (this.selectedMonthValue) {
      filter.ThisMonth = this.selectedMonthValue == 'This Month' ? true : false;;
    }
    if (this.selectedWeekValue) {
      filter.ThisWeek = this.selectedWeekValue == 'This Week' ? true : false;
    }
    
    this.apiService.getPromissoryNotesPayment(filter).subscribe((result) => {
      if (result?.isSuccess) {
        this.data = [
          result.data.cash,
          result.data.cards,
          result.data.cheques,
          // result.data.eFawateeecom,
          result.data.transfer,
        ];
      }
      this.updateChart();
    });
  }

  private updateChart() {
    if (!this.chart) {
      return;
    }
    this.barChartData.datasets[0].data = this.data || [];
    this.chart.update();
  }

}
