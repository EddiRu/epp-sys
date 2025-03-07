import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { FiredatabaseService } from 'src/app/services/firebase/firedatabase.service';

@Component({
  selector: 'app-editar-equipo',
  templateUrl: './editar-equipo.component.html',
  styleUrls: ['./editar-equipo.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditarEquipoComponent  implements OnInit {

  @Input() equipo: any; // Recibe el equipo desde el componente padre
  equipoForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private firebaseService: FiredatabaseService,
    private laodController: LoadingController,
    private modalController: ModalController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.equipoForm = this.fb.group({
      id:[this.equipo.id],
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      cantidad_disponible: [1, [Validators.required, Validators.min(1)]],
      fecha_ingreso: ['', Validators.required],
      descripcion: ['', Validators.required],
      estado: ['Activo', Validators.required]
    });

    if (this.equipo) {
      this.cargarDatosEquipo(); // Cargar datos al abrir el formulario
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

  cargarDatosEquipo() {
    const equipoData = { ...this.equipo };
  
    // 📌 Verifica si la fecha es un timestamp y conviértela al formato YYYY-MM-DD
    if (equipoData.fecha_ingreso) {
      const fecha = new Date(equipoData.fecha_ingreso);
      equipoData.fecha_ingreso = fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    }
  
    this.equipoForm.patchValue(equipoData);
  }
  

  async guardarCambios() {

    const loadEquipo = await this.laodController.create({
      message: 'Guardando cambios...',
      translucent: true,
      spinner: 'dots',
      mode: 'ios'
    })

    await loadEquipo.present();

    if (this.equipoForm.valid) {
      try {
        this.firebaseService.updateEquipo(this.equipoForm.value).then((res) => {
          this.presentToast('success', 'Cambios guardados correctamente');
          this.cerrarModal();
          loadEquipo.dismiss();
        })
      } catch (error) {
        this.presentToast('error', 'Error al guardar los cambios');
        loadEquipo.dismiss();
      }
    }else{
      this.presentToast('warning', 'Todos los campos son obligatorios');
      loadEquipo.dismiss();
    }
  }

  async cerrarModal() {
    await this.modalController.dismiss(null);
  }

}
