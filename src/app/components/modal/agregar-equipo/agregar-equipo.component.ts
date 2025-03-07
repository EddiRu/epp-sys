import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { FiredatabaseService } from 'src/app/services/firebase/firedatabase.service';

@Component({
  selector: 'app-agregar-equipo',
  templateUrl: './agregar-equipo.component.html',
  styleUrls: ['./agregar-equipo.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AgregarEquipoComponent  implements OnInit {

  equipoForm: FormGroup;

  constructor(
    private firedatabase: FiredatabaseService,
    private fb: FormBuilder,
    private modalController: ModalController,
    private toastController: ToastController,
    private laodController: LoadingController
  ) { }

  ngOnInit() {
    this.equipoForm = this.fb.group({
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      cantidad_disponible: [1, [Validators.required, Validators.min(1)]],
      fecha_ingreso: ['', Validators.required],
      descripcion: ['', Validators.required],
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

  async cerrarModal() {
    await this.modalController.dismiss(null)
  }

  async guardarEquipo() {

    const loadEquipo = await this.laodController.create({
      message: 'Guardando cambios...',
      translucent: true,
      spinner: 'dots',
      mode: 'ios'
    })

    await loadEquipo.present();


    if (this.equipoForm.valid) {
      this.firedatabase.addEquipo(this.equipoForm.value)
       .then(() => {
          this.presentToast('success', 'El equipo ha sido agregado correctamente');
          this.cerrarModal();
          loadEquipo.dismiss();
        })
       .catch((error) => {
          console.error(error);
          this.presentToast('error', 'Hubo un error al agregar el equipo');
          loadEquipo.dismiss();
        });

      this.equipoForm.reset();
    }else{
      this.presentToast('warning', 'Por favor, complete todos los campos');
      loadEquipo.dismiss();
    }
  }

}
