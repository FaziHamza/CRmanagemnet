import { JwtService } from 'src/app/shared/services/jwt.service';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/utility/services/common.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/utility/services/storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  getToken: any = '';
  selectedLanguageObj: any | undefined;
  languages = [
    {
      id: 'en',
      title: 'English',
      flag: 'us.png'
    },
    {
      id: 'arabic',
      title: 'Arabic',
      flag: 'arabic.png'
    }
  ];
  constructor(public commonService: CommonService, private jwtService: JwtService, private storageService: StorageService,
    private route: Router, private translate: TranslateService) {
    if (JSON.parse(this.storageService.getString("currentLanguage")))
      this.translate.setDefaultLang(JSON.parse(this.storageService.getString("currentLanguage")));
    else {
      this.translate.setDefaultLang('en');
      this.storageService.storeString(
        'currentLanguage',
        JSON.stringify('en')
      );
    }
  }

  ngOnInit(): void {
    this.selectedLanguageObj = this.languages.find(language => language.id == JSON.parse(this.storageService.getString("currentLanguage")));
    this.getToken = this.jwtService.getToken();
  }
  gotoSpareParts() {
    // const queryParams = { token: this.getToken };
    // const queryString = new URLSearchParams(queryParams).toString();
    // const url = `${environment.routerLink}/?${queryString}`;
    // window.open(url, '_blank');
  }
  setLanguage(lang: string): void {
    debugger
    this.selectedLanguageObj = this.languages.find(
      (record) => record.id === lang
    );
    this.commonService.setLanguageChange(lang);
    this.storageService.storeString(
      'currentLanguage',
      JSON.stringify(lang)
    );
    this.translate.use(lang);
  }
}
