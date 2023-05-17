import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/utility/services/common.service';

@Component({
  selector: 'app-work-order-create',
  templateUrl: './work-order-create.component.html',
  styleUrls: ['./work-order-create.component.scss']
})
export class WorkOrderCreateComponent implements OnInit {

  constructor(private commonService:CommonService) { }
  pageSize = 6;
  ngOnInit() {
    this.commonService.breadcrumb = [
      { title: ' Spare Parts', routeLink: '' },
      { title: ' Create Order ', routeLink: 'order' },
    ]
    const data = [];
    for (let i = 0; i < 2; i++) {
      data.push({
        id: `${i}`,
        partNo: `P00 ${i}`,
        qty: i,
        description: `Oil filter ${i}`,
        unitPrice:(i*3),
        discount:i,
        netAmount:0,
        tax:0,
        totalPrice:0
      });
    }
    this.listOfData = data;
    this.updateEditCache();
  }
  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  listOfData: any[] = [];

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }
  deleteRow(id: string): void {
    this.listOfData = this.listOfData.filter(d => d.id !== id);
  }
  cancelEdit(id: string): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listOfData[index] },
      edit: false
    };
  }
  partNoList :any[] = [];
  onInput(e: Event): void {
    debugger
    const value = (e.target as HTMLInputElement).value;
    if(value.length >=3){
      this.partNoList =[
        {
          id:1,
          name:'abc'
        },
        {
          id:2,
          name:'abc 1'
        },
        {
          id:3,
          name:'abc 3'
        },
      ]
    }
    // if (!value || value.indexOf('@') >= 0) {
    //   this.options = [];
    // } else {
    //   this.options = ['gmail.com', '163.com', 'qq.com'].map(domain => `${value}@${domain}`);
    // }
  }
  addRow(): void {
    this.listOfData = [
      ...this.listOfData,
      {
        id: this.listOfData.length + 1,
        partNo: '',
        qty: 1,
        description: '',
        unitPrice:0,
        discount:0,
        netAmount:0,
        tax:0,
        totalPrice:0
      }
    ];
    this.enableEditCache();
  }
  saveEdit(id: string): void {
    debugger
    const index = this.listOfData.findIndex(item => item.id === id);
    Object.assign(this.listOfData[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }
  enableEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
    let item = this.listOfData[this.listOfData.length -1];
    this.editCache[item.id] = {
      edit: true,
      data: { ...item }
    };
  }

}
