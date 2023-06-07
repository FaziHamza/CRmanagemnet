import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ApiService } from 'src/app/shared/services/api.service';
import { csvExport } from 'src/app/utility/util';

@Component({
  selector: 'app-promissory-notes-aging-report',
  templateUrl: './promissory-notes-aging-report.component.html',
  styleUrls: ['./promissory-notes-aging-report.component.scss'],
})
export class PromissoryNotesAgingReportComponent implements OnInit, OnDestroy {
  @Output() dataUpdated = new EventEmitter<any>();
  searchByCustomerName$ = new Subject<any>();
  searchByCustomer = '';
  loading = false;
  list = [];
  lookups = [];
  totalRemainging = 0;
  totalOverDue = 0;
  totalRecords = 0;
  selectedLookupId = '';
  unsubscribe = new Subject<void>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getStatusLookup(25).subscribe((result) => {
      if (result?.isSuccess) {
        this.lookups = result.data.map((entry) => ({
          id: entry.id,
          name: entry.name[0]?.lookupName,
        }));
      }
    });
    this.searchByCustomerName$
      .pipe(debounceTime(500), takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.fetchList();
      });
    this.fetchList();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  customerChange() {
    if (this.searchByCustomer.length >= 0) {
      this.searchByCustomerName$.next(this.searchByCustomer);
    }
  }

  clearInput() {
    this.searchByCustomer = '';
    this.fetchList();
  }

  lookupChange() {
    this.fetchList();
  }

  clearLookup() {
    this.selectedLookupId = '';
    this.fetchList();
  }

  fetchList() {
    this.loading = true;
    const filter: any = {};
    if (this.searchByCustomer?.length) {
      filter.Customer = this.searchByCustomer;
    }
    if (this.selectedLookupId) {
      filter.AgeingId = this.selectedLookupId;
    }
    this.apiService
      .getPromissoryNotesAgingReport(filter)
      .subscribe((result: any) => {
        this.totalRecords =
          (result?.totalPageCount || 1) * (result?.totalRecordCount || 0);
        this.totalRemainging = result?.totalRemainging || 0;
        this.totalOverDue = result?.totalOverDue || 0;
        this.list = (result?.data || []).map((entry) => ({
          customerId: entry.customerId,
          customerName: entry.customerName,
          uncollectd: entry.uncollectd,
          overDuePnsTotal: entry.overDuePnsTotal,
          lookup25001:
            entry.ageing.find((age) => age.lookupId === 25001)?.amount || 0,
          lookup25002:
            entry.ageing.find((age) => age.lookupId === 25002)?.amount || 0,
          lookup25003:
            entry.ageing.find((age) => age.lookupId === 25003)?.amount || 0,
          lookup25004:
            entry.ageing.find((age) => age.lookupId === 25004)?.amount || 0,
          lookup25005:
            entry.ageing.find((age) => age.lookupId === 25005)?.amount || 0,
          lookup25006:
            entry.ageing.find((age) => age.lookupId === 25006)?.amount || 0,
        }));
        this.dataUpdated.emit(this.list);
      })
      .add(() => (this.loading = false));
  }

  exportToExcel() {
    const header = [
      'No',
      'Customer Name',
      'Uncollected PNs Amount',
      'Over Due PNs Amount',
      '0-30 PNs Amount',
      '31-60 PNs Amount',
      '61-90 PNs Amount',
      '91-120 PNs Amount',
      '121-180 PNs Amount',
      '180+ PNs Amount',
    ];
    const data = (this.list || []).reduce(
      (acc, item) => {
        acc.push([
          item.customerId,
          item.customerName,
          `${item.uncollectd} JD`,
          `${item.overDuePnsTotal} JD`,
          `${item.lookup25001} JD`,
          `${item.lookup25002} JD`,
          `${item.lookup25003} JD`,
          `${item.lookup25004} JD`,
          `${item.lookup25005} JD`,
          `${item.lookup25006} JD`,
        ]);
        return acc;
      },
      [header]
    );
    if (data?.length > 1) {
      data.push([
        '',
        'Total',
        `${this.getTotalBy('uncollectd')} JD`,
        `${this.getTotalBy('overDuePnsTotal')} JD`,
        `${this.getTotalBy('lookup25001')} JD`,
        `${this.getTotalBy('lookup25002')} JD`,
        `${this.getTotalBy('lookup25003')} JD`,
        `${this.getTotalBy('lookup25004')} JD`,
        `${this.getTotalBy('lookup25005')} JD`,
        `${this.getTotalBy('lookup25006')} JD`,
      ]);
    }
    csvExport('Promissory Notes Aging Report', data);
  }

  getTotalBy(prop: string): number {
    let total = 0;
    if (this.list?.length) {
      this.list.forEach((entry) => (total += entry[prop] || 0));
    }
    return total;
  }
}
