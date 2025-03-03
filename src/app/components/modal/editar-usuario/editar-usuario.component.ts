import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditarUsuarioComponent implements OnInit {

  @Input() usuario: any;

  usuarioForm: FormGroup

  public rolesDisponibles = [
    { rol: 'Coordinador de Recursos Humanos', value: 'CRH' },
    { rol: 'Auxiliar de Recursos Humanos (Saucito)', value: 'ARHSAU' },
    { rol: 'Auxiliar de Recursos Humanos (Zacatecas)', value: 'ARHZAC' },
    { rol: 'Coordinador de Seguridad', value: 'CS' },
    { rol: 'Supervisor de Seguridad', value: 'SS' },
  ]

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.usuarioForm = this.formBuilder.group({
      email: [{value: this.usuario.email, disabled: true}],
      usuario: [this.usuario.usuario],
      actInact: [this.usuario.actInact],
      rol: [this.usuario.rol]
    });
  }

  async presentToast(type: 'success' | 'warning' | 'error', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
      cssClass: `toast-${type}`
    });
  
    await toast.present();
  }

  async cerrarModal() {
    await this.modalController.dismiss(null)
  }

  async editarUsuario() {
    const loadUsuario = await this.loadingController.create({
      message: 'Creando Usuario...',
      translucent: true,
      spinner: 'dots',
      mode: 'ios'
    });
    
    await loadUsuario.present();
  
    if (this.usuarioForm.valid) {
      try {
        const res = await this.authService.updateUser(this.usuario.id,this.usuarioForm.value);
        
        if (res) {
          this.presentToast('success', 'Usuario actuailizado correctamente');
          this.cerrarModal();
        } else {
          this.presentToast('error', 'Error al actualizar el usuario');
        }
  
      } catch (error) {
        this.presentToast('error', 'Ocurrió un error inesperado al guardar el usuario');
      }
  
    } else {
      this.presentToast('warning', 'Todos los campos son obligatorios');
    }
  
    loadUsuario.dismiss();
  }

}
