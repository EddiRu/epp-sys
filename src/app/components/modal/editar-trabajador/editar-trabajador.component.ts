import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { FiredatabaseService } from 'src/app/services/firebase/firedatabase.service';

@Component({
  selector: 'app-editar-trabajador',
  templateUrl: './editar-trabajador.component.html',
  styleUrls: ['./editar-trabajador.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditarTrabajadorComponent  implements OnInit {
  @Input() trabajador: any; // Recibe el trabajador desde el componente padre
  trabajadorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FiredatabaseService,
    private modalController: ModalController,
    private loadController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    console.log(this.trabajador)
    this.trabajadorForm = this.fb.group({
      id: [this.trabajador.id],
      nombre: ['', Validators.required],
      puesto: ['', Validators.required],
      departamento: ['', Validators.required],
      fecha_registro: ['', Validators.required],
      estado: ['Activo', Validators.required]
    });

    if (this.trabajador) {
      this.cargarDatosTrabajador(); // Cargar datos al abrir el modal
    }
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

  cargarDatosTrabajador() {
    const trabajadorData = { ...this.trabajador };

    // 📌 Convertir la fecha a formato YYYY-MM-DD si es necesario
    if (trabajadorData.fecha_registro) {
      const fecha = new Date(trabajadorData.fecha_registro);
      trabajadorData.fecha_registro = fecha.toISOString().split('T')[0];
    }

    this.trabajadorForm.patchValue(trabajadorData);
  }

  async guardarCambios() {
    const loadTrabajador = await this.loadController.create({
      message: 'Actualizando Trabajador...',
      translucent: true,
      spinner: 'dots',
      mode: 'ios'
    })

    await loadTrabajador.present();

    if (this.trabajadorForm.valid) {
      try {
        await this.firebaseService.updateTrabajador(this.trabajadorForm.value);
        console.log('Trabajador actualizado correctamente');
        this.presentToast('success', 'Cambios guardados correctamente');
        this.cerrarModal();
        loadTrabajador.dismiss();
      } catch (error) {
        this.presentToast('error', 'Algo ha salido mal, por favor vuelvalo a intentar')
        loadTrabajador.dismiss();
      }
    }else{
      this.presentToast('warning', 'Todos los campos son obligatorios')
      loadTrabajador.dismiss();
    }
  }

  async cerrarModal() {
    await this.modalController.dismiss(null);
  }

}
