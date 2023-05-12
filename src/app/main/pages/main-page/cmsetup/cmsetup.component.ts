import { Component, OnInit } from '@angular/core';
import { CmsSetupDto } from 'src/app/main/models/cmsSetupDto';
import { ApiService } from 'src/app/shared/services/api.service';
import { CommonService } from 'src/app/utility/services/common.service';

@Component({
  selector: 'app-cmsetup',
  templateUrl: './cmsetup.component.html',
  styleUrls: ['./cmsetup.component.scss']
})
export class CMSetupComponent implements OnInit {
  cmsSetup:any = new CmsSetupDto('');
  constructor(private _apiService:ApiService,private commonService:CommonService) { }

  ngOnInit(): void {
    this.commonService.breadcrumb = [
      { title: 'Credit Management Setup', routeLink: '' },
      { title: 'Edit Setup ', routeLink: '' },
    ]
    this.getCmsSetup();

  }
  getCmsSetup(){
    this._apiService.getCMSSetup().subscribe(res=>{
      if(res.isSuccess){
        this.cmsSetup = res.data[0];
      }
    })
  }
  saveCmdSetup(){
    this._apiService.saveCmsSetup(this.cmsSetup).subscribe(res=>{
      if(res.isSuccess){
        this.commonService.showSuccess(res.message,"Success");
      }else{
        this.commonService.showSuccess(res.message,"Error");
      }
    })
  }
}
