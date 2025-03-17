import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexLegend,
} from "ng-apexcharts";
import { AgregarAsignacionComponent } from 'src/app/components/modal/agregar-asignacion/agregar-asignacion.component';
import { FiredatabaseService } from 'src/app/services/firebase/firedatabase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit, AfterViewInit {

  asignacionesDelDia: any[] = [];
  trabajadores: any = {};
  equipos: any = {};
  fechaHoraActual: string = "";
  datosCargados: boolean = false;
  graficasCargadas: boolean = false;

  // 📉 Stock Crítico (Top 3 Equipos con más asignaciones)
  stockCriticoSeries: ApexNonAxisChartSeries = [];
  stockCriticoChart: ApexChart = { type: "donut" };
  stockCriticoLabels: string[] = [];

  // 📦 Asignaciones Más Solicitadas (Top 3 Equipos más entregados)
  asignacionesSeries: ApexNonAxisChartSeries = []; // Corregido: formato correcto para un donut
  asignacionesChart: ApexChart = { type: "donut" };
  asignacionesLabels: string[] = []; // Corregido: los labels son necesarios

  // 🔄 Reposición vs. Entrega (Top 3 Motivos)
  reposicionSeries = [{ name: "Cantidad", data: [] }];
  reposicionChart: ApexChart = { type: "bar" };
  reposicionXAxis: ApexXAxis = { categories: ["Entrega Inicial", "Cambio", "Pérdida"] };
  reposicionLegend: ApexLegend = { position: "top" };

  constructor(
    private firebaseService: FiredatabaseService,
    private modalController: ModalController,
    private loadingCtrl: LoadingController,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    console.log("🕒 Iniciando Dashboard...");

    const loading = await this.loadingCtrl.create({
      message: 'Cargando datos...',
      spinner: 'crescent',
      translucent: true,
      mode: 'ios',
      duration: 3000
    });

    await loading.present();

    await Promise.all([
      this.obtenerTrabajadores(),
      this.obtenerEquipos(),
      this.obtenerAsignacionesDelDia()
    ]);

    this.datosCargados = true;


    // ⏰ Iniciar el reloj después de que todo cargue
    this.actualizarReloj();
    setInterval(() => this.actualizarReloj(), 1000);

    this.ngAfterViewInit();
  }

  ngAfterViewInit() {
    // 📌 Asegurar que los gráficos solo se generen cuando todo el DOM esté listo
    setTimeout(() => {
      if (this.datosCargados) {
        this.actualizarGraficas();
        this.graficasCargadas = true;
        this.cdr.detectChanges();
      }
    }, 2000);
  }

  actualizarReloj() {
    const fecha = new Date();
    const opcionesFecha: Intl.DateTimeFormatOptions = {
      day: '2-digit', month: 'long', year: 'numeric'
    };
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);

    const opcionesHora: Intl.DateTimeFormatOptions = {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    };
    const horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora);

    this.fechaHoraActual = `${fechaFormateada} - ${horaFormateada}`;
    this.cdr.detectChanges(); // 🔥 Forzar la actualización en la vista
  }

  async obtenerTrabajadores() {
    return new Promise<void>((resolve) => {
      this.firebaseService.getTrabajadores().subscribe({
        next: (data) => {
          this.trabajadores = data.reduce((acc, trabajador) => {
            acc[trabajador.id] = trabajador.nombre;
            return acc;
          }, {});
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  async obtenerEquipos() {
    return new Promise<void>((resolve) => {
      this.firebaseService.getEquipos().subscribe({
        next: (data) => {
          this.equipos = data.reduce((acc, equipo) => {
            acc[equipo.id] = equipo.nombre;
            return acc;
          }, {});
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  async obtenerAsignacionesDelDia() {
    return new Promise<void>((resolve) => {
      this.firebaseService.getAsignaciones().subscribe({
        next: (asignaciones) => {
          if (!asignaciones || asignaciones.length === 0) {
            console.warn("No hay asignaciones del día aún.");
            this.asignacionesDelDia = [];
            resolve();
            return;
          }

          this.asignacionesDelDia = asignaciones.map(asignacion => ({
            ...asignacion,
            nombre_trabajador: this.trabajadores[asignacion.trabajador_id] || "Desconocido",
            nombre_equipo: this.equipos[asignacion.equipo_id] || "Desconocido"
          }));

          resolve();
        },
        error: () => resolve()
      });
    });
  }

  actualizarGraficas() {
    if (!this.datosCargados || this.asignacionesDelDia.length === 0) {
      console.warn("📊 No hay datos para generar las gráficas.");
      return;
    }

    console.log("📊 Generando gráficos con datos:", this.asignacionesDelDia);

    let stockDisponible = this.agruparYOrdenar(this.asignacionesDelDia, "nombre_equipo");
    this.stockCriticoLabels = stockDisponible.labels;
    this.stockCriticoSeries = stockDisponible.series;

    let asignacionesFrecuentes = this.agruparYOrdenar(this.asignacionesDelDia, "nombre_equipo");

    if (asignacionesFrecuentes.labels.length === 0 || asignacionesFrecuentes.series.length === 0) {
      console.warn("⚠ No hay datos suficientes para 'Asignaciones más solicitadas'.");
    }

    this.asignacionesLabels = asignacionesFrecuentes.labels;
    this.asignacionesSeries = asignacionesFrecuentes.series;


    let motivosFrecuentes = this.agruparYOrdenar(this.asignacionesDelDia, "motivo");
    this.reposicionXAxis.categories = motivosFrecuentes.labels;
    this.reposicionSeries[0].data = motivosFrecuentes.series;

    this.cdr.detectChanges();
    console.log("📊 Gráficas actualizadas correctamente");

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  }

  agruparYOrdenar(datos: any[], propiedad: string) {
    const conteo = datos.reduce((acc, item) => {
      acc[item[propiedad]] = (acc[item[propiedad]] || 0) + item.cantidad;
      return acc;
    }, {} as Record<string, number>);

    const ordenado = Object.entries(conteo)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 3);

    return {
      labels: ordenado.map((x) => x[0]),
      series: ordenado.map((x) => Number(x[1])) as ApexNonAxisChartSeries
    };
  }

  async abrirModalAsignacion() {
    const modalAsignacion = await this.modalController.create({
      component: AgregarAsignacionComponent,
      cssClass: 'modal-contenedor-agregar-asignacion'
    });

    modalAsignacion.present();
  }
}
