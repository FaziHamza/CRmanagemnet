import {
    Directive,
    HostListener,
    EventEmitter,
    Output,
    HostBinding,
  } from '@angular/core';
  
  import { DomSanitizer } from '@angular/platform-browser';
  
  @Directive({
    selector: '[appImageDrag]',
  })
  export class DragAndDropDirective {
    @Output('files') files: EventEmitter<any[]> = new EventEmitter();
    @Output('enter') enter: EventEmitter<any[]> = new EventEmitter();
    @Output('leave') leave: EventEmitter<any[]> = new EventEmitter();
    @HostBinding('style.background') public background = '';
    @HostBinding('style.border') public border = '';
    constructor(private sanitizer: DomSanitizer) {}
  
    @HostListener('dragenter', ['$event']) public onDragEnter(evt: DragEvent) {
      evt.preventDefault();
      evt.stopPropagation();
      this.enter.emit();
    }
    @HostListener('dragover', ['$event']) public onDragOver(evt: DragEvent) {
      evt.preventDefault();
      evt.stopPropagation();
      this.background = '#d9e4f0';
      this.border = '2px dashed #226BC0';
    }
    @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
      evt.preventDefault();
      evt.stopPropagation();
      this.leave.emit();
      this.background = '';
      this.border = '';
    }
    @HostListener('drop', ['$event']) public onDrop(evt: any) {
      evt.preventDefault();
      evt.stopPropagation();
      this.background = '';
      this.border = '';
      let files: any[] = [];
      for (let i = 0; i < evt.dataTransfer.files.length; i++) {
        const file = evt.dataTransfer.files[i];
        const url = this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        );
        files.push({
          file,
          url,
        });
      }
      if (files.length > 0) {
        this.files.emit(files);
      }
    }
  }
  