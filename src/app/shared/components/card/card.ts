import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.html',
  styleUrls: ['./card.css']
})
export class Card {

  @Input() title: string = '';
  @Input() price: string = '';
  @Input() features: string[] = [];
  @Input() buttonText: string = '';
  @Input() action!: () => void;

}