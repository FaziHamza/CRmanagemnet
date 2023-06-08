import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-promissory-note-card',
  templateUrl: './promissory-note-card.component.html',
  styleUrls: ['./promissory-note-card.component.scss'],
})
export class PromissoryNoteCardComponent {
  @Input() icon = '';
  @Input() label = '';
  @Input() amount = '';
  @Input() currency = '';
  @Input() isCurrency = true;
}
