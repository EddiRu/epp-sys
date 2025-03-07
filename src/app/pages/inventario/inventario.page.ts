import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AgregarEquipoComponent } from 'src/app/components/modal/agregar-equipo/agregar-equipo.component';
import { EditarEquipoComponent } from 'src/app/components/modal/editar-equipo/editar-equipo.component';
import { FiredatabaseService } from 'src/app/services/firebase/firedatabase.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
  standalone: false,
})
export class InventarioPage implements OnInit {

  equipos: any[] = []; // Lista original de equipos (desde Firebase)
  equiposFiltrados: any[] = []; // Lista filtrada para la vista
  searchTerm: string = ''; // Término de búsqueda
  paginaActual: number = 1; // Página actual
  itemsPorPagina: number = 10; // Equipos por página
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

  // Obtener la información de la base de datos
  async getInformacion() {
    this.firebaseService.getEquipos().subscribe({
      next: (data) => {
        this.equipos = data
        this.actualizarLista(); // Cargar los equipos en la vista inicial
      },
      error: (error) => {
        console.error(error);
      }
    })
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

  // 🔍 Filtrar Equipos por Nombre o Tipo
  filtrarEquipos() {
    const filtro = this.searchTerm.toLowerCase();

    this.equiposFiltrados = this.equipos.filter(equipo =>
      equipo.nombre.toLowerCase().includes(filtro) ||
      equipo.tipo.toLowerCase().includes(filtro)
    );

    this.paginaActual = 1; // Reiniciar a la primera página después de filtrar
    this.calcularTotalPaginas();
  }

  // 📌 Actualizar Lista de Equipos con Paginación
  actualizarLista() {
    this.calcularTotalPaginas();
    this.equiposFiltrados = this.equipos.slice(0, this.itemsPorPagina);
  }

  // 📄 Calcular Total de Páginas
  calcularTotalPaginas() {
    this.totalPaginas = Math.ceil(this.equiposFiltrados.length / this.itemsPorPagina);
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

  // 🔄 Actualizar la lista de equipos según la página actual
  actualizarPagina() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.equiposFiltrados = this.equipos.slice(inicio, fin);
  }


  async agregarEquipo(){
    const modalAgregarEquipo = await this.modalController.create({
      component: AgregarEquipoComponent,
      cssClass:'modal-contenedor-agregar-equipo'
    });

    modalAgregarEquipo.present()
  }

  async editarEquipo(equipo: any) {
    const modalAgregarEquipo = await this.modalController.create({
      component: EditarEquipoComponent,
      cssClass:'modal-contenedor-editar-equipo',
      componentProps: {
        equipo: equipo
      }
    })

    modalAgregarEquipo.present();
  }

  async eliminarEquipo(equipo: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que deseas eliminar el equipo ${equipo.nombre}?`,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            this.firebaseService.deleteEquipo(equipo.id).then((res) => {
              console.log(res);
              this.presentToast('success','Equipo eliminado correctamente');
            })
          },
          cssClass: 'delete-button'
        }
      ]
    });
    await alert.present();
  }

}
