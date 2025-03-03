import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-recuperar-contra',
  templateUrl: './recuperar-contra.component.html',
  styleUrls: ['./recuperar-contra.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class RecuperarContraComponent  implements OnInit {

  // Formulario para obtener su correo
  formulario: FormGroup

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private toastController: ToastController,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
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

  async enviarCorreo(){
    if(this.formulario.valid){
      try {
        this.authService.restartPassword(this.formulario.value).then((res:any) => {
          this.presentToast('success', 'Se ha enviado un correo para reiniciar su contraseña');
          this.cerrarModal(); // Cierra el modal cuando se envía el correo correctamente
        })
      } catch (error) {
        await this.presentToast('error', 'Ha ocurrido un error al enviar el correo');
      }
    }else{
      await this.presentToast('warning', 'Por favor, ingrese un correo válido');
    }
  }

  async cerrarModal(){
    await this.modalController.dismiss();
  }

}
