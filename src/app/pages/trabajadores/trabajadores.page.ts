import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AgregarTrabajadorComponent } from 'src/app/components/modal/agregar-trabajador/agregar-trabajador.component';
import { EditarTrabajadorComponent } from 'src/app/components/modal/editar-trabajador/editar-trabajador.component';
import { FiredatabaseService } from 'src/app/services/firebase/firedatabase.service';

@Component({
  selector: 'app-trabajadores',
  templateUrl: './trabajadores.page.html',
  styleUrls: ['./trabajadores.page.scss'],
  standalone: false,
 
})
export class TrabajadoresPage implements OnInit {

  trabajadores: any[] = []; // Lista original de trabajadores (desde Firebase)
  trabajadoresFiltrados: any[] = []; // Lista filtrada para la vista
  searchTerm: string = ''; // Término de búsqueda
  paginaActual: number = 1; // Página actual
  itemsPorPagina: number = 10; // Cantidad de trabajadores por página
  totalPaginas: number = 1; // Total de páginas


  constructor(
    private firebaseService: FiredatabaseService,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.getInformacion();
  }

  async getInformacion() {
    this.firebaseService.getTrabajadores().subscribe({
      next: (data) => {
        this.trabajadores = data
        this.actualizarLista(); // Cargar los equipos en la vista inicial
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  // 🔍 Filtrar Trabajadores por Nombre, Puesto o Departamento
  filtrarTrabajadores() {
    const filtro = this.searchTerm.toLowerCase();

    this.trabajadoresFiltrados = this.trabajadores.filter(trabajador =>
      trabajador.nombre.toLowerCase().includes(filtro) ||
      trabajador.puesto.toLowerCase().includes(filtro) ||
      trabajador.departamento.toLowerCase().includes(filtro)
    );

    this.paginaActual = 1; // Reiniciar a la primera página después de filtrar
    this.calcularTotalPaginas();
  }

  // 📌 Actualizar Lista de Trabajadores con Paginación
  actualizarLista() {
    this.calcularTotalPaginas();
    this.trabajadoresFiltrados = this.trabajadores.slice(0, this.itemsPorPagina);
  }

  // 📄 Calcular Total de Páginas
  calcularTotalPaginas() {
    this.totalPaginas = Math.ceil(this.trabajadoresFiltrados.length / this.itemsPorPagina);
  }

  // ⬅️ Página Anterior
  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPagina();
    }
  }

  // ➡️ Página Siguiente
  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPagina();
    }
  }

  // 🔄 Actualizar la lista de trabajadores según la página actual
  actualizarPagina() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.trabajadoresFiltrados = this.trabajadores.slice(inicio, fin);
  }

  async presentToast(type: 'success' | 'warning' | 'error', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      cssClass: `toast-${type}` // Usa el tipo de toast correcto
    });
  
    await toast.present();
  }


  async agregarTrabajador(){
    const modalAgregarTrabajador = await this.modalController.create({
      component: AgregarTrabajadorComponent,
      cssClass:'modal-contenedor-agregar-trabajador'
    });

    modalAgregarTrabajador.present();
  }

  async editarTrabajador(trabajador: any) {
    const modalEditarTrabajador = await this.modalController.create({
      component: EditarTrabajadorComponent,
      cssClass:'modal-contenedor-editar-trabajador',
      componentProps: {
        trabajador: trabajador
      }
    })

    modalEditarTrabajador.present();
  }

  async cambiarEstado(trabajador: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que deseas ${trabajador.estado == "Activo" ? 'Desactivar' : 'Activar'} a ${trabajador.nombre}?`,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button',
        },
        {
          text: trabajador.estado == "Activo" ? 'Desactivar' : 'Activar',
          handler: async () => {
            trabajador.estado = trabajador.estado === "Activo" ? "Inactivo" : "Activo";

            this.firebaseService.updateTrabajador(trabajador).then((res) => {
              this.presentToast('success','Usuario ' + trabajador.estado === "Activo" ? "Activado" : "Desactivado");
            })
          },
          cssClass: trabajador.estado == "Activo" ? 'delete-button' : 'success-button'
        }
      ]
    });
    await alert.present();
  }

}
