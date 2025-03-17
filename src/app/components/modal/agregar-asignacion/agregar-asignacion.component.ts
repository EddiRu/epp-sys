import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { FiredatabaseService } from 'src/app/services/firebase/firedatabase.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-agregar-asignacion',
  templateUrl: './agregar-asignacion.component.html',
  styleUrls: ['./agregar-asignacion.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AgregarAsignacionComponent  implements OnInit {

  asignacionForm: FormGroup;
  trabajadores: any[] = []; // Lista de trabajadores
  equipos: any[] = []; // Lista de equipos
  usuarioActual: any = {}; // Usuario autenticado

  constructor(
    private fb: FormBuilder,
    private firebaseService: FiredatabaseService,
    private storageService: StorageService,
    private loadController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.asignacionForm = this.fb.group({
      fecha_asignacion: [new Date().toISOString().split('T')[0], Validators.required],
      turno: ['1RA', Validators.required],
      trabajador_id: ['', Validators.required],
      equipo_id: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      motivo: ['Entrega inicial', Validators.required],
      firmado: [false],
      usuario_asigna_id: [this.usuarioActual?.email],
      nombre_usuario_asigna: [this.usuarioActual?.usuario]
    });

    this.obtenerTrabajadores();
    this.obtenerEquipos();
    this.obtenerUsuarioActual();
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

  obtenerTrabajadores() {
    this.firebaseService.getTrabajadores().subscribe({
      next: (data) => {
        this.trabajadores = data;
      },
      error: (error) => {
        console.error('Error al obtener trabajadores:', error);
      }
    });
  }

  obtenerEquipos() {
    this.firebaseService.getEquipos().subscribe({
      next: (data) => {
        this.equipos = data;
      },
      error: (error) => {
        console.error('Error al obtener equipos:', error);
      }
    })
  }

  async obtenerUsuarioActual() {
    const usuario = await this.storageService.get('usuario');
    if (usuario) {
      this.usuarioActual = usuario;
      this.asignacionForm.patchValue({
        usuario_asigna_id: usuario.email,
        nombre_usuario_asigna: usuario.usuario
      });
    }
  }

  async guardarAsignacion() {
    if (this.asignacionForm.valid) {
      try {
        this.firebaseService.addAsignacion(this.asignacionForm.value).then(res => {
          this.presentToast('success', 'Asignación agregada correctamente');
          this.cerrarModal();
        })
      } catch (error) {
        this.presentToast('error', 'Error al agregar la asignaicón de equipo')
      }
    }else{
      this.presentToast('warning', 'Todos los campos son obligatorios')
    }
  }

  async cerrarModal() {
    await this.modalController.dismiss(null);
  }

}
