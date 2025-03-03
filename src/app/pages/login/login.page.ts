import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { RecuperarContraComponent } from 'src/app/components/modal/recuperar-contra/recuperar-contra.component';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  // Forms para obtener el usuario y contraseña formgroup
  loginForm:FormGroup;

  // Modal para recuperar la contraseña
  mostrarModal = false; // Controla si el modal se muestra


  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private modalController: ModalController,
    private laodingController: LoadingController,
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    // Crear formulario de login
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: ['']
    });
  }

  async abrirModal() {
    const recuperarContraModal = await this.modalController.create({
      component: RecuperarContraComponent,
      cssClass:'neu-modal'
    });

    recuperarContraModal.present();
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

  async login(){
    const loading = await this.laodingController.create({
      message: 'Verificando la información...',
      mode: 'ios'
    });

    loading.present();

    if(this.loginForm.valid){
      try {
        this.authService.login(this.loginForm.value).then((res:any) => {
          if(res){
            this.presentToast('success', 'Has iniciado sesión correctamente');
            this.storageService.set('usuario', res); // Guarda el token en el storage
            this.router.navigateByUrl('/dashboard', {replaceUrl: true})
          }else{
            this.presentToast('warning', 'El correo o contraseña no son válidos');
          }
        })
      } catch (error) {
        this.presentToast('error', 'Error al iniciar sesión');
      }
      loading.dismiss();
    }else{
      this.presentToast('warning', 'Todos los campos son obligatorios');
      loading.dismiss();
    }
  }

}
