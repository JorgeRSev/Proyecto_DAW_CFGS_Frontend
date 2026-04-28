import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.html',
})
export class Card {
  @Input() title: string = '';
  @Input() price: string = '';
  @Input() features: string[] = [];
  @Input() buttonText: string = '';
  @Input() popular: boolean = false; // <-- nuevo input
  @Input() action!: () => void;
}
