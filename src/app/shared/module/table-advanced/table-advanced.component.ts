import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table-advanced',
  templateUrl: './table-advanced.component.html',
  styleUrls: ['./table-advanced.component.scss']
})
export class TableAdvancedComponent implements OnInit {
  pageSize = 6;
  pageIndex: number = 1;
  start = 1;
  end = 6;
  @Input() checkboxShow: boolean = false;
  @Input() headerList: any[] = [];
  @Input() dataList: any[] = [];
  @Input() total: number = 0;
  @Input() checkboxList: any[] = [];
  displayData: any[] = [];
  checked = false;
  listOfCurrentPageData: readonly any[] = [];
  setOfCheckedId = new Set<number>();
  @Output() getCheckValues = new EventEmitter();
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.getCheckValues.emit(this.setOfCheckedId);

  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.pnBookNoteId, value));
    this.getCheckValues.emit(this.setOfCheckedId);
  }

  onCurrentPageDataChange($event: readonly any[]): void {
    this.listOfCurrentPageData = $event;
  }

  ngOnInit(): void {
    this.displayData = this.dataList.slice(0, this.pageSize);
  }
  onPageIndexChange(index: number): void {
    
    this.pageIndex = index;
    this.updateDisplayData();
    let checkRecords = [...this.setOfCheckedId]
    const allExist = this.displayData.every(record => checkRecords.includes(record.pnBookNoteId));
    if(allExist){
      this.checked = true;
    }else
    this.checked = false;
  }
  updateDisplayData() {
    const start = (this.pageIndex - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.start = start == 0 ? 1 : ((this.pageIndex * this.pageSize) - this.pageSize) + 1;
    this.displayData = this.dataList.slice(start, end);
    this.end = this.displayData.length != 6 ? this.total : this.pageIndex * this.pageSize;
  }
}
