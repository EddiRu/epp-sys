import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { FiredatabaseService } from 'src/app/services/firebase/firedatabase.service';

@Component({
  selector: 'app-agregar-trabajador',
  templateUrl: './agregar-trabajador.component.html',
  styleUrls: ['./agregar-trabajador.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AgregarTrabajadorComponent  implements OnInit {

  trabajadorForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private firedatabase: FiredatabaseService,
    private loadcontroller: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.trabajadorForm = this.fb.group({
      nombre: ['', Validators.required],
      puesto: ['', Validators.required],
      departamento: ['', Validators.required],
      fecha_registro: ['', Validators.required],
      estado: ['Activo', Validators.required]
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

  async guardarTrabajador() {
    const loadCarga = await this.loadcontroller.create({
      message: 'Guardando Trabajador...',
      translucent: true,
      spinner: 'dots',
      mode: 'ios'
    })

    loadCarga.present();

    if (this.trabajadorForm.valid) {
      try {
        this.firedatabase.addTrabajador(this.trabajadorForm.value).then((res) => {
          console.log(res)
          this.presentToast('success', 'Trabajador agregado correctamente');
          this.cerrarModal();
        })
        
      } catch (error) {
        this.presentToast('error', 'Error al agregar el trabajador');
      } finally {
        loadCarga.dismiss();
      }
    }else{
      this.presentToast('error', 'Todos los campos son obligatorios');
      loadCarga.dismiss();
    }
  }

  async cerrarModal() {
    await this.modalController.dismiss(null)
  }

}
