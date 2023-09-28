import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { CountryCodeList } from 'src/app/auth/Pages/register/countryCodes';
import countries from 'src/app/shared/common/countryListWithCode';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  breadcrumb: any[] = [];
  private languageChange: BehaviorSubject<string> = new BehaviorSubject<string>('');
  selectedWorkorder = 0;
  loadRequestTab = false;
  followUp = false;
  fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];//'application/pdf'
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private ngxService: NgxUiLoaderService) { }
  // Success
  showSuccess(message: string, title: string) {
    this.toastr.success(message, title);
  }
  // Error
  showError(message: string, title: string) {
    this.toastr.error(message, title);
  }

  // Warning
  showWarning(message: string, title: string) {
    this.toastr.warning(message, title, {
      closeButton: true,
      enableHtml: true,
    });


  }
  fileToBase64 = async (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        if (file.type !== 'application/pdf') {
          resolve({ fileType: file.type, base64: reader.result, file, fileName: file.name })
        }
        else {
          resolve({ fileType: file.type, file, fileName: file.name })
        }
      }
      reader.onerror = (e) => reject(e)
    })
  checkInvalidImageFormat(data, returnObj = false): any {
    let invalidError = '';
    let invalidExtentions = false;
    let files;
    let getFiles = data.map(x => {
      return x.file
    })
    if (getFiles[0] !== undefined) {
      files = getFiles;
    }
    else {
      files = data;
    }
    for (let file of files) {
      if (!this.fileTypes.includes(file.type)) {
        invalidExtentions = true;
        invalidError = 'This file not support, supported formates: JPEG, JPG, PNG, PDF';
        break;
      }
    }
    if (returnObj) {
      return { invalidExtentions, invalidError };
    }
    else {
      return invalidExtentions;
    }
  }

  selectedAvatar = '';

  getUser() {
    return JSON.parse(localStorage.getItem('userDetail'));
  }

  getTimeRemaining(endtime: any) {
    const total = Date.parse(endtime) - Date.parse(this.estDateTime().toString());
    const seconds = Math.floor((total / 1000) % 60) + ' sec';
    const minutes = Math.floor((total / 1000 / 60) % 60) + " min";
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24) + ' hours';
    const days = Math.floor(total / (1000 * 60 * 60 * 24)) + ' days';

    let timeLeft = days + ' , ' + hours + ' : ' + minutes + ' : ' + seconds

    return timeLeft;
  }

  //JSON-Beautify
  // This Method add 4 indentation into json to make readability.
  jsonBeautify(json: any) {
    alert(JSON.stringify(json, null, 4));
  }


  formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }
  getTime(data: any) {
    let hour = new Date(data).getHours();
    let min = new Date(data).getMinutes();
    return hour + ":" + min
  }
  getDate(data: any) {

    let day = new Date(data).getDate();
    let mon = new Date(data).getMonth() + 1;
    let year = new Date(data).getFullYear();
    let month = mon < 10 ? '0' + mon : mon;
    let days = day < 10 ? '0' + day : day;

    return year + '-' + month + '-' + days
  }

  getDayLeft(endtime: any) {
    const total = Date.parse(endtime) - Date.parse(new Date().toString());
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return days;
  }
  getHourLeft(endtime: any) {
    let hours = new Date(endtime).getHours() - new Date().getHours();
    if (hours < 0) {
      hours = 24 - new Date().getHours() + new Date(endtime).getHours();
    }
    let result = hours < 10 ? '0' + hours : hours;
    return result;
  }
  getMinuteLeft(endtime: any) {

    let minutes = new Date(endtime).getMinutes() - new Date().getMinutes();
    if (minutes < 0) {
      minutes = 60 - new Date().getMinutes() + new Date(endtime).getMinutes();
    }
    let result = minutes < 10 ? '0' + minutes : minutes;

    return result
  }
  getTimeEnd(endtime: any) {
    let total = Date.parse(endtime) - Date.parse(new Date().toString());
    let minutes = new Date(endtime).getMinutes() - new Date().getMinutes();
    if (minutes < 0) {
      minutes = 60 - new Date().getMinutes() + new Date(endtime).getMinutes();
    }
    let hours = new Date(endtime).getHours() - new Date().getHours();
    if (hours < 0) {
      hours = 24 - new Date().getHours() + new Date(endtime).getHours();
    }
    let minuResult = minutes < 10 ? '0' + minutes : minutes;
    let resultHour = hours < 10 ? '0' + hours : hours;

    return resultHour + ':' + minuResult
  }

  estDateTime() {
    const date = new Date();
    let datetime = date.toLocaleString('en-US', { timeZone: 'America/New_York', });
    return datetime;
  }
  getPercentage(total: any, amount: any) {
    let data = amount / total * 100
    return data.toFixed(0);
  }
  makeDateFormat(format: any) {
    var date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let days = day < 10 ? '0' + day : day;
    let months = month < 10 ? '0' + month : month;
    return year + format + months + format + days + 'T00:00:00'
  }
  getRemainingMonths(start: any, end: any) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const months = (endDate.getMonth() - startDate.getMonth()) + (12 * (endDate.getFullYear() - startDate.getFullYear()));
    return months
  }
  onlyPositiveNumbers(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 0 && event.key === '-') {
      event.preventDefault();
    } else if (isNaN(Number(input.value + event.key))) {
      event.preventDefault();
    }
  }
  getCountryName(code) {
    let data = countries.filter(a => a.countryCode == code);
    if (data.length > 0)
      return data[0].countryName;
    else
      return code
  }
  startLoader() {
    this.ngxService.start();
  }
  stopLoader() {
    this.ngxService.stop();
  }
  getInitialOfName = (data: any) => {
    let avatar = "";
    if (data) {
      let arrayName = data.split(' ');
      // arrayName.forEach(element => {
      //   avatar += element.charAt(0)
      // });
      if(arrayName[0]){
        avatar +=  arrayName[0].charAt(0);
      }
      if(arrayName.length > 0)
        avatar += " " +  arrayName[arrayName.length -1].charAt(0);
    }
    return avatar;
  };
  getLanguageChange(): Observable<string> {
    return this.languageChange.asObservable();
  }
  setLanguageChange(val: string): void {
    this.languageChange.next(val);
  }
  navigateToRouteWithQueryString(routeName: string, queryParams?: any) {
    if (queryParams == undefined || queryParams == null)
      this.router.navigate([routeName]);
    else
      this.router.navigate([routeName], queryParams);
  }
  navigateToRoute(routeName: string, params?: any) {
    if (params == undefined || params == null)
      this.router.navigate([routeName]);
    else
      this.router.navigate([routeName, params]);
  }
}
