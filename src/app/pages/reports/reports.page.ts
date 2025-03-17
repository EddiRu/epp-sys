import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { FiredatabaseService } from 'src/app/services/firebase/firedatabase.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: false,
})
export class ReportsPage implements OnInit {
  filtroForm: FormGroup;
  asignaciones: any[] = [];
  asignacionesOriginales:any[] = [];
  asignacionesFiltradas: any[] = [];
  trabajadores: any[] = [];
  equipos: any[] = [];
  usuarios: any[] = [];
  searchTerm: string = '';

  // 📄 Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  totalPaginas: number = 1;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FiredatabaseService,
    private loadingCtrl: LoadingController
  ) {

  }
  async ngOnInit() {
    this.filtroForm = this.fb.group({
      fechaInicio: [''],
      fechaFin: [''],
      trabajador: [''],
      equipo: [''],
      usuarioAsignador: [''],
    });

    const loading = await this.loadingCtrl.create({
      message: 'Cargando reportes...',
      spinner: 'crescent',
      mode: 'ios'
    });

    await loading.present();

    await Promise.all([
      this.obtenerTrabajadores(),
      this.obtenerEquipos(),
      this.obtenerUsuarios(),
      this.obtenerAsignaciones()
    ]);

    this.actualizarPaginacion();
    loading.dismiss();
  }

  async obtenerAsignaciones() {
    this.firebaseService.getAsignaciones().subscribe({
      next: (asignaciones) => {
        this.asignaciones = asignaciones.map(asignacion => ({
          ...asignacion,
          nombre_trabajador: this.obtenerNombreTrabajador(asignacion.trabajador_id),
          nombre_equipo: this.obtenerNombreEquipo(asignacion.equipo_id),
          nombre_usuario_asigna: this.obtenerNombreUsuario(asignacion.usuario_asigna_id)
        }));
        this.asignacionesFiltradas = [...this.asignaciones];
        this.asignacionesOriginales = [...this.asignaciones];
        this.actualizarPaginacion();
      }
    });
  }

  async obtenerTrabajadores() {
    this.firebaseService.getTrabajadores().subscribe({
      next: (data) => {
        this.trabajadores = data;
      }
    });
  }

  async obtenerEquipos() {
    this.firebaseService.getEquipos().subscribe({
      next: (data) => {
        this.equipos = data;
      }
    });
  }

  async obtenerUsuarios() {
    this.firebaseService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      }
    });
  }

  aplicarFiltros() {
    const { fechaInicio, fechaFin, trabajador, equipo, usuarioAsignador } = this.filtroForm.value;

    this.asignacionesFiltradas = this.asignaciones.filter(asignacion => {
      const fechaAsignacion = new Date(asignacion.fecha_asignacion);

      return (
        (!fechaInicio || new Date(fechaInicio) <= fechaAsignacion) &&
        (!fechaFin || new Date(fechaFin) >= fechaAsignacion) &&
        (!trabajador || asignacion.trabajador_id === trabajador) &&
        (!equipo || asignacion.equipo_id === equipo) &&
        (!usuarioAsignador || asignacion.usuario_asigna_id === usuarioAsignador)
      );
    });

    this.actualizarPaginacion();
  }

  filtrarResultados(event: any) {
    const valorBusqueda = event.target.value.toLowerCase().trim();
    
    if (!valorBusqueda) {
      this.asignacionesFiltradas = [...this.asignacionesOriginales]; // Restaurar datos originales si no hay búsqueda
      return;
    }
  
    this.asignacionesFiltradas = this.asignacionesOriginales.filter(asignacion =>
      asignacion.nombre_trabajador.toLowerCase().includes(valorBusqueda) ||
      asignacion.nombre_equipo.toLowerCase().includes(valorBusqueda)
    );
  }
  
  

  // 📄 Paginación
  actualizarPaginacion() {
    this.totalPaginas = Math.ceil(this.asignacionesFiltradas.length / this.itemsPorPagina);
  }

  paginaAnterior() {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }

  // 🔍 Obtener nombres de Firebase
  obtenerNombreTrabajador(id: string): string {
    const trabajador = this.trabajadores.find(t => t.id === id);
    return trabajador ? trabajador.nombre : 'Desconocido';
  }

  obtenerNombreEquipo(id: string): string {
    const equipo = this.equipos.find(e => e.id === id);
    return equipo ? equipo.nombre : 'Desconocido';
  }

  obtenerNombreUsuario(id: string): string {
    const usuario = this.usuarios.find(u => u.email === id);
    return usuario ? usuario.usuario : 'Desconocido';
  }

  async editarAsignacion(asignacion:any){

  }

  exportarAExcel() {
    if (!this.asignacionesFiltradas.length) {
      console.warn("No hay datos para exportar.");
      return;
    }
  
    // 🔹 Mapear los datos correctamente
    const datosExportar = this.asignacionesFiltradas.map(asignacion => ({
      "Fecha de Entrega": asignacion.fecha_asignacion,
      "Turno": asignacion.turno || "N/A",
      "Nombre del Colaborador": asignacion.nombre_trabajador,
      "Artículo Entregado": asignacion.nombre_equipo,
      "Cantidad": asignacion.cantidad,
      "Motivo de Entrega": asignacion.motivo,
      "Entrega / Cambio": asignacion.motivo === "Cambio" ? "✔" : "-", 
      "Quién Entrega": this.obtenerNombreUsuario(asignacion.usuario_asigna_id),
      "Firma de Recibido": asignacion.firmado ? "✔" : "Pendiente"
    }));
  
    const hojaDeTrabajo = XLSX.utils.json_to_sheet(datosExportar);
    const libroDeTrabajo = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libroDeTrabajo, hojaDeTrabajo, "Reporte EPP");
  
    // 🔹 Guardar el archivo
    const excelBuffer = XLSX.write(libroDeTrabajo, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Reporte_EPP_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }
  
  



}
