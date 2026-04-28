import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  standalone: true,
  templateUrl: './faq.html',
})
export class Faq {
  faqs = [
    {
      question: '¿Cuánto dura el servicio?',
      answer: 'Entre 1 y 2 horas',
    },
    {
      question: '¿Puedo cancelar una cita?',
      answer: 'Sí, con 24h de antelación',
    },
    {
      question: '¿Qué incluye el servicio?',
      answer: 'Depende del paquete seleccionado',
    },
  ];
}
