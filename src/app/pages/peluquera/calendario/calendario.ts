import { Component, OnInit, signal, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { CitasService, Cita, MascotaConDueno } from '../../../services/citas/citas.service';
import { MascotasService, Peluquera } from '../../../services/mascotas/mascotas.service';
import { AuthService } from '../../../services/auth/auth.service';
import { environment } from '../../../../environment/environment';

const COLORES: Record<string, string> = {
  pendiente: '#f59e0b',
  confirmada: '#22c55e',
  cancelada: '#ef4444',
  completada: '#3b82f6',
};

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './calendario.html',
})
export class Calendario implements OnInit {
  @ViewChild('calendario') calendarRef!: FullCalendarComponent;

  vistaActual: 'dayGridMonth' | 'timeGridWeek' = 'dayGridMonth';

  calendarOptions = signal<CalendarOptions>({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: { left: 'prev,next today', center: 'title', right: '' },
    selectable: true,
    selectMirror: true,
    editable: false,
    events: [],
    select: (arg) => {
      this.abrirModalNuevaCita(arg);
      this.cdr.detectChanges();
    },
    eventClick: (arg) => {
      this.onEventoClick(arg);
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

  citaDetalle: Cita | null = null;

  mascotas: MascotaConDueno[] = [];
  peluqueras: Peluquera[] = [];

  private apiUrl = `${environment.apiUrl}/citas`;

  constructor(
    private citasService: CitasService,
    private mascotasService: MascotasService,
    private authService: AuthService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarCitas();
    this.cargarFormularioDatos();
  }

  cargarCitas(): void {
    this.citasService.getAllCitas().subscribe({
      next: (res) => {
        const eventos = res.data.map((cita) => ({
          id: String(cita.id),
          title: `${cita.mascota} · ${cita.dueno ?? ''}`,
          start: `${cita.fecha}T${cita.hora}`,
          backgroundColor: COLORES[cita.estado] ?? '#6b7280',
          borderColor: COLORES[cita.estado] ?? '#6b7280',
          textColor: '#ffffff',
          extendedProps: { cita },
        }));
        this.calendarOptions.update((opts) => ({ ...opts, events: eventos }));
        this.cdr.detectChanges();
      },
    });
  }

  cargarFormularioDatos(): void {
    this.citasService.getAllMascotasActivas().subscribe({
      next: (res) => {
        this.mascotas = res.data;
        this.cdr.detectChanges();
      },
    });

    this.mascotasService.getPeluqueras().subscribe({
      next: (res) => {
        this.peluqueras = res.data;
        const user = this.authService.getUser();
        const miPeluquera = res.data.find((p) => p.id === user?.id);
        this.peluqueraSeleccionada = miPeluquera ? miPeluquera.id : (res.data[0]?.id ?? null);
        this.cdr.detectChanges();
      },
    });
  }

  cambiarVista(vista: 'dayGridMonth' | 'timeGridWeek'): void {
    this.vistaActual = vista;
    if (this.calendarRef) {
      this.calendarRef.getApi().changeView(vista);
    }
    this.cdr.detectChanges();
  }

  abrirModalNuevaCita(arg: DateSelectArg): void {
    this.fechaSeleccionada = arg.startStr.split('T')[0];
    this.horaSeleccionada = arg.startStr.includes('T')
      ? arg.startStr.split('T')[1].substring(0, 5)
      : '10:00';
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

  guardarCita(): void {
    if (!this.mascotaSeleccionada || !this.peluqueraSeleccionada) {
      this.errorModal = 'Selecciona una mascota para continuar.';
      return;
    }

    this.guardando = true;
    this.errorModal = '';

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
          this.cargarCitas();
        } else {
          this.errorModal = res.message ?? 'Error al guardar la cita.';
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

  onEventoClick(arg: EventClickArg): void {
    this.citaDetalle = arg.event.extendedProps['cita'] as Cita;
  }

  cerrarDetalle(): void {
    this.citaDetalle = null;
    this.cdr.detectChanges();
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
