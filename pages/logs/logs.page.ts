import { Component } from '@angular/core';
import { JarvisService } from '../../services/JarvisService'; 
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
  standalone: false
})
export class LogsPage {

  constructor(
    public jarvis: JarvisService,
    private toastController: ToastController
  ) {}

  /**
   * Copia el texto seleccionado al portapapeles del dispositivo
   */
  async copiarTexto(texto: string) {
    try {
      await navigator.clipboard.writeText(texto);
      this.mostrarNotificacion('SYS.LOG // Copiado al portapapeles', 'primary');
    } catch (err) {
      console.error('Error al copiar el texto: ', err);
      this.mostrarNotificacion('Error de lectura/escritura', 'danger');
    }
  }

  /**
   * Abre la imagen en una nueva pestaña/ventana para descargarla
   */
  async descargarImagen(url: string | undefined) {
    if (!url) return;
    
    try {
      this.mostrarNotificacion('SYS.LOG // Extrayendo archivo visual...', 'primary');
      // En navegadores móviles y web, esto permite ver y guardar la imagen
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error al descargar la imagen: ', err);
      this.mostrarNotificacion('Error en la extracción', 'danger');
    }
  }

  /**
   * Muestra un pequeño mensaje holográfico en la parte inferior
   */
  private async mostrarNotificacion(mensaje: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}