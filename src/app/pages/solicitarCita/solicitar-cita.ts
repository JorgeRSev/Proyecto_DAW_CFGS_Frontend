import { Component, OnInit, signal, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { MascotasService, Mascota, Peluquera } from '../../services/mascotas/mascotas.service';
import { CitasService, Cita } from '../../services/citas/citas.service';
import { environment } from '../../../environment/environment';

const HORAS_DISPONIBLES = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
];

const COLORES: Record<string, string> = {
  pendiente: '#f59e0b',
  confirmada: '#22c55e',
  cancelada: '#ef4444',
  completada: '#3b82f6',
};

@Component({
  selector: 'app-solicitar-cita',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './solicitar-cita.html',
})
export class SolicitarCita implements OnInit {
  @ViewChild('calendario') calendarRef!: FullCalendarComponent;

  calendarOptions = signal<CalendarOptions>({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: { left: 'prev,next today', center: 'title', right: '' },
    selectable: true,
    selectMirror: true,
    editable: false,
    validRange: { start: new Date().toISOString().split('T')[0] },
    events: [],
    select: (arg) => {
      this.seleccionarDia(arg);
      this.cdr.detectChanges();
    },
    eventClick: (arg) => {
      this.verDetalle(arg);
      this.cdr.detectChanges();
    },
    height: 'auto',
  });

  modalAbierto: boolean = false;
  fechaSeleccionada: string = '';
  horaSeleccionada: string = '';
  mascotaSeleccionada: number | null = null;
  peluqueraSeleccionada: number | null = null;
  notas: string = '';
  guardando: boolean = false;
  errorModal: string = '';

  horasDisponibles = HORAS_DISPONIBLES;

  citaDetalle: Cita | null = null;

  mascotas: Mascota[] = [];
  peluqueras: Peluquera[] = [];

  cargando: boolean = true;
  error: string = '';

  private apiUrl = `${environment.apiUrl}/citas`;

  constructor(
    private citasService: CitasService,
    private mascotasService: MascotasService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;

    this.citasService.getMisCitas().subscribe({
      next: (res) => {
        const eventos = res.data.map((cita) => ({
          id: String(cita.id),
          title: cita.mascota,
          start: `${cita.fecha}T${cita.hora}`,
          backgroundColor: COLORES[cita.estado] ?? '#6b7280',
          borderColor: COLORES[cita.estado] ?? '#6b7280',
          textColor: '#ffffff',
          extendedProps: { cita },
        }));
        this.calendarOptions.update((opts) => ({ ...opts, events: eventos }));
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar tus citas.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });

    this.mascotasService.getMisMascotas().subscribe({
      next: (res) => {
        this.mascotas = res.data;
        this.cdr.detectChanges();
      },
    });

    this.mascotasService.getPeluqueras().subscribe({
      next: (res) => {
        this.peluqueras = res.data;
        if (res.data.length === 1) {
          this.peluqueraSeleccionada = res.data[0].id;
        }
        this.cdr.detectChanges();
      },
    });
  }

  seleccionarDia(arg: DateSelectArg): void {
    this.fechaSeleccionada = arg.startStr;
    this.horaSeleccionada = '';
    this.mascotaSeleccionada = null;
    this.notas = '';
    this.errorModal = '';
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.errorModal = '';
    this.cdr.detectChanges();
  }

  solicitarCita(): void {
    this.errorModal = '';

    if (!this.mascotaSeleccionada) {
      this.errorModal = 'Selecciona qué mascota quieres traer.';
      return;
    }
    if (!this.horaSeleccionada) {
      this.errorModal = 'Selecciona una hora.';
      return;
    }
    if (!this.peluqueraSeleccionada) {
      this.errorModal = 'No hay peluqueras disponibles. Contacta con el negocio.';
      return;
    }

    this.guardando = true;

    const body = {
      fecha: this.fechaSeleccionada,
      hora: `${this.horaSeleccionada}:00`,
      id_mascota: this.mascotaSeleccionada,
      id_peluquera: this.peluqueraSeleccionada,
      notas: this.notas || null,
    };

    this.http.post<any>(this.apiUrl, body).subscribe({
      next: (res) => {
        this.guardando = false;
        if (res.success) {
          this.cerrarModal();
          this.cargarDatos();
        } else {
          this.errorModal = res.message ?? 'Error al solicitar la cita.';
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.guardando = false;
        this.errorModal = 'Error de conexión con el servidor.';
        this.cdr.detectChanges();
      },
    });
  }

  verDetalle(arg: EventClickArg): void {
    this.citaDetalle = arg.event.extendedProps['cita'] as Cita;
  }

  cerrarDetalle(): void {
    this.citaDetalle = null;
    this.cdr.detectChanges();
  }

  get fechaFormateada(): string {
    if (!this.fechaSeleccionada) return '';
    const [y, m, d] = this.fechaSeleccionada.split('-');
    return `${d}/${m}/${y}`;
  }

  getBadgeClasses(estado: string): string {
    const base = 'px-2 py-0.5 rounded-full text-xs font-medium';
    switch (estado) {
      case 'confirmada':
        return `${base} bg-green-100 text-green-700`;
      case 'pendiente':
        return `${base} bg-yellow-100 text-yellow-700`;
      case 'cancelada':
        return `${base} bg-red-100 text-red-700`;
      case 'completada':
        return `${base} bg-blue-100 text-blue-700`;
      default:
        return `${base} bg-gray-100 text-gray-600`;
    }
  }
}
