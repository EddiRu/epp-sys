import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AgrearUsuarioComponent } from 'src/app/components/modal/agrear-usuario/agrear-usuario.component';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { AlertController } from '@ionic/angular';
import { EditarUsuarioComponent } from 'src/app/components/modal/editar-usuario/editar-usuario.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: false,
})
export class UsersPage implements OnInit {
  usuarios: any[] = []; // Lista de usuarios original
  usuariosFiltrados: any[] = []; // Lista de usuarios filtrados
  searchTerm: string = ''; // Filtro de búsqueda

  // Configuración de la paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  totalPaginas: number = 1;


  rolesDisponibles = [
    { rol: 'Coordinador de Recursos Humanos', value: 'CRH' },
    { rol: 'Auxiliar de Recursos Humanos (Saucito)', value: 'ARHSAU' },
    { rol: 'Auxiliar de Recursos Humanos (Zacatecas)', value: 'ARHZAC' },
    { rol: 'Coordinador de Seguridad', value: 'CS' },
    { rol: 'Supervisor de Seguridad', value: 'SS' },
  ];


  constructor(
    private modalController: ModalController,
    private authservice: AuthService,
    private toastController: ToastController,
    private alertController: AlertController,
  ) {

  }
  ngOnInit() {
    this.obtenerUsuarios();
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

  async obtenerUsuarios() {
    await this.authservice.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.usuariosFiltrados = [...this.usuarios];
        this.calcularTotalPaginas();
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    })
  }

  // Filtrar usuarios en base al término de búsqueda
  filtrarUsuarios() {
    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      usuario.usuario.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.paginaActual = 1;
    this.calcularTotalPaginas();
  }

  // Calcular el número total de páginas
  calcularTotalPaginas() {
    this.totalPaginas = Math.ceil(this.usuariosFiltrados.length / this.itemsPorPagina);
  }

  // Función para ir a la página anterior
  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  // Función para ir a la página siguiente
  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }

  // Función para obtener el nombre del rol en lugar del código
  obtenerNombreRol(rol: string): string {
    const rolesDisponibles = [
      { rol: 'Coordinador de Recursos Humanos', value: 'CRH' },
      { rol: 'Auxiliar de Recursos Humanos (Saucito)', value: 'ARHSAU' },
      { rol: 'Auxiliar de Recursos Humanos (Zacatecas)', value: 'ARHZAC' },
      { rol: 'Coordinador de Seguridad', value: 'CS' },
      { rol: 'Supervisor de Seguridad', value: 'SS' },
    ];
    const rolEncontrado = rolesDisponibles.find(r => r.value === rol);
    return rolEncontrado ? rolEncontrado.rol : 'Desconocido';
  }

  async agregarUsuario() {
    const modalCrearUsuario = await this.modalController.create({
      component: AgrearUsuarioComponent,
      cssClass: 'modal-contenedor-agregar-usuario'
    });

    await modalCrearUsuario.present();
  }

  async editarUsuario(usuario: any) {
    console.log('Editar usuario:', usuario);
    const modalEdicionUsuario = await this.modalController.create({
      component: EditarUsuarioComponent,
      cssClass: 'modal-contenedor-editar-usuario',
      componentProps: {
        usuario: usuario
      }
    });
    await modalEdicionUsuario.present();
  }

  async bloquearUsuario(usuario: any) {
    console.log(usuario)
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que deseas ${usuario.actInact == "false" ? 'Desbloquear' : 'Bloquear'} a ${usuario.usuario}?`,
      cssClass: 'custom-alert', // Agregamos la clase CSS personalizada
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button',
        },
        {
          text: usuario.actInact == "false" ? 'Desbloquear' : 'Bloquear',
          handler: async () => {
            if(usuario.actInact == "false"){
              this.authservice.habilitarUsuario(usuario.id).then((res) => {
                console.log(res);
                this.presentToast('success','Usuario habilitado correctamente');
              })
            }else{
              this.authservice.deshabilitarUsuario(usuario.id).then((res) => {
                console.log(res);
                this.presentToast('success','Usuario deshabilitado correctamente');
              })
            }

            
            
          },
          cssClass: usuario.actInact == "false" ? 'success-button' : 'delete-button'
        }
      ]
    });

    await alert.present();
  }

}
