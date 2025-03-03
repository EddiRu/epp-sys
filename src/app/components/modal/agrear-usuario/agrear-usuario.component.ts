import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-agrear-usuario',
  templateUrl: './agrear-usuario.component.html',
  styleUrls: ['./agrear-usuario.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class AgrearUsuarioComponent implements OnInit {

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
      email: [''],
      usuario: [''],
      actInact: [''],
      rol: [''],
      password: ['']
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

  async guardarUsuario() {
    const loadUsuario = await this.loadingController.create({
      message: 'Creando Usuario...',
      translucent: true,
      spinner: 'dots',
      mode: 'ios'
    });
    
    await loadUsuario.present();
  
    if (this.usuarioForm.valid) {
      try {
        const res = await this.authService.register(this.usuarioForm.value);
        
        if (res.success) {
          this.presentToast('success', 'Usuario creado correctamente');
          this.cerrarModal();
        } else {
          this.presentToast('error', res.message || 'Error al crear usuario');
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
