import { Component, VERSION } from '@angular/core';
import { NgxUiLoaderConfig } from 'ngx-ui-loader';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular ' + VERSION.major;
  config : NgxUiLoaderConfig;
  constructor(){
    
  }
  ngOnInit(): void {
    this.config={
      "bgsColor": "#c39c52",
      "bgsOpacity": 0.5,
      "bgsPosition": "bottom-right",
      "bgsSize": 60,
      "bgsType": "ball-spin-clockwise",
      "blur": 5,
      "delay": 0,
      "fastFadeOut": true,
      "fgsColor": "#c39c52",
      "fgsPosition": "center-center",
      "fgsSize": 60,
      "fgsType": "ball-spin-clockwise",
      "gap": 24,
      "logoPosition": "center-center",
      "logoSize": 120,
      "logoUrl": "",
      "masterLoaderId": "master",
      "overlayBorderRadius": "0",
      "overlayColor": "rgba(40, 40, 40, 0.8)",
      "pbColor": "#c39c52",
      "pbDirection": "ltr",
      "pbThickness": 3,
      "hasProgressBar": true,
      "text": "Pleas wait...",
      "textColor": "#FFFFFF",
      "textPosition": "center-center",
      "maxTime": -1,
      "minTime": 300
    };
  }
}
