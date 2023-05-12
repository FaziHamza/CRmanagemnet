import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  constructor() {
    
    console.log("fazi")
   }
  form = new FormGroup({});
  textEditorData: any = [];
  selectedCar: any;

    cars = [
        { id: 1, name: 'Volvo' },
        { id: 2, name: 'Saab' },
        { id: 3, name: 'Opel' },
        { id: 4, name: 'Audi' },
    ];

  config = {
    placeholder: '',
    tabsize: 2,
    height: '200px',
    uploadImagePath: '/api/upload',
    toolbar: [
        ['misc', ['codeview', 'undo', 'redo']],
        ['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
        // ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
        // ['fontsize', ['fontname', 'fontsize', 'color']],
        ['para', ['style']],
        // ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
        // ['insert', ['table', 'picture', 'link', 'video', 'hr']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  }
  ngOnInit() {
  }
  addTag(event) {
    this.cars.push({id:1,name: event});
    this.selectedCar = event;
  }
  selectedOption;
  public options = [
    {label: 'Option 1'},
    {label: 'Option 2'},
    {label: 'Option 3'},
  ];

  addTag1(event) {
    this.options.push({label: event});
    this.selectedOption = event;
  }
  public optionsEmail = [    {email: 'email1@example.com'},    {email: 'email2@example.com'},    {email: 'email3@example.com'},  ];

  addEmail = (term) => {
    
    console.log(term)
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegex.test(term)) {
      this.optionsEmail.push({email: term});
      return {email: term};
    } else {
      return null;
    }
  }

}