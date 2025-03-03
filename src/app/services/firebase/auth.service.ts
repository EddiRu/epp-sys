import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  deleteUser
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  updateDoc,
  setDoc,
  collection,
  collectionData,
  deleteDoc,
  getDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private firestore: Firestore) { }

  getUsuarios(): Observable<any[]> {
    const registroRef = collection(this.firestore, 'usuarios');
    return collectionData(registroRef, { idField: 'id' }) as Observable<any[]>;
  }

  async deshabilitarUsuario(uid: string) {
    try {
      const userRef = doc(this.firestore, "usuarios", uid);
      await updateDoc(userRef, { actInact: "false" }); // Cambia el estado a inactivo
      console.log("Usuario deshabilitado correctamente.");
    } catch (error) {
      console.error("Error al deshabilitar usuario:", error);
    }
  }

  async habilitarUsuario(uid: string) {
    try {
      const userRef = doc(this.firestore, "usuarios", uid);
      await updateDoc(userRef, { actInact: "true" }); // Cambia el estado a inactivo
      console.log("Usuario deshabilitado correctamente.");
    } catch (error) {
      console.error("Error al deshabilitar usuario:", error);
    }
  }
  // Registro de usuario y almacenamiento en Firestore
  async register({ email, password, usuario, actInact, rol }:
    { email: string; password: string; usuario: string; actInact: string; rol: string }) {

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Guardar datos adicionales del usuario en Firestore
      await setDoc(doc(this.firestore, 'usuarios', user.uid), {
        email: user.email,
        usuario,
        actInact,
        rol,
      });

      return { success: true, user };

    } catch (error: any) {
      let mensajeError = 'Ocurrió un error al registrar el usuario.';

      if (error.code === 'auth/email-already-in-use') {
        mensajeError = 'El correo electrónico ya está registrado. Usa otro correo.';
      } else if (error.code === 'auth/invalid-email') {
        mensajeError = 'El formato del correo es inválido.';
      } else if (error.code === 'auth/weak-password') {
        mensajeError = 'La contraseña debe tener al menos 6 caracteres.';
      }

      return { success: false, message: mensajeError };
    }
  }


  // Login de usuario
  async login({ email, password }: { email: string; password: string }) {
    try {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        const user = userCredential.user; // 📌 Extrae el usuario autenticado correctamente

        // 🔥 Obtiene la referencia del documento en Firestore
        const userDocRef = doc(this.firestore, 'usuarios', user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
            return userSnapshot.data(); // 🔥 Retorna la información del usuario desde Firestore
        } else {
            console.error('El usuario no tiene un documento en Firestore.');
            return null;
        }
    } catch (e) {
        console.error('Error al iniciar sesión:', e);
        return null;
    }
}


  async restartPassword({ email }: { email: string }) {
    try {
      const reset = await sendPasswordResetEmail(this.auth, email);
      return reset
    } catch (e) {
      return null
    }
  }

  // Logout de usuario
  logout() {
    return signOut(this.auth);
  }


  // Actualizar usuario en Firestore
  async updateUser(uid: string, { usuario, rol, actInact }: { usuario: string; rol: string, actInact:string }) {
    try {
      const userDocRef = doc(this.firestore, 'usuarios', uid);

      await updateDoc(userDocRef, {
        usuario,
        actInact,
        rol,
      });

      return true
    } catch (e) {
      console.error('Error al actualizar usuario:', e);
      return null
    }
  }
}
