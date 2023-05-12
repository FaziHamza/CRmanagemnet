import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }
  userVerificationDetail: any;
  myfun() {
    alert("sss")
  }
  generateVerificationCode(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }
}
