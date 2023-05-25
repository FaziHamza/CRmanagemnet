import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/utility/services/common.service';

@Component({
  selector: 'app-promissory-note',
  templateUrl: './promissory-note.component.html',
  styleUrls: ['./promissory-note.component.scss']
})
export class PromissoryNoteComponent implements OnInit {

  constructor(private commonService: CommonService) { }
  current = 0;
  isGenerate = false;
  ngOnInit(): void {
    this.commonService.breadcrumb = [
      { title: ' Generating Promissory Notes Orders', routeLink: 'home/promissory-note' }
    ]
  }
  pre(): void {
    this.current -= 1;
  }

  next(): void {
    this.current += 1;
  }

  done(): void {
    console.log('done');
  }
  handleIndexChange(event: any) {
    console.log("step click");
  }
}
