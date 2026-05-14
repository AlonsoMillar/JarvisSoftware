import { Component } from '@angular/core';
// Importamos el servicio con la ruta relativa correcta
import { JarvisService } from '../../services/JarvisService';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage {

  // --- Propiedades del Sistema ---
  estaEscuchando: boolean = false;
  capacidadMemoria: number = 85; 
  ultimaRespuestaIA: string = 'Sistemas listos. Esperando órdenes, Sr. Millar.';

  constructor(
    // Inyectamos el servicio de forma activa (ya no está comentado)
    private jarvis: JarvisService 
  ) {}

  /**
   * Activa el protocolo de escucha del Reactor ARC
   */
  async activarEscucha() {
    // 1. Encendemos la animación y actualizamos el texto de la UI
    this.estaEscuchando = true;
    this.ultimaRespuestaIA = "Escuchando, señor...";
    console.log("Protocolo de escucha iniciado...");

    try {
      // 2. Llamamos al servicio real que conecta con el micrófono y n8n
      const respuesta: any = await this.jarvis.hablarConJarvis();
      
      // 3. Apagamos la animación y mostramos la respuesta de Gemini
      this.estaEscuchando = false;
      this.ultimaRespuestaIA = respuesta;

    } catch (error) {
      // Manejo de errores si fallan los sensores o el servidor
      this.estaEscuchando = false;
      this.ultimaRespuestaIA = "Error en los sensores de audio o conexión, señor.";
      console.error("Fallo en la comunicación:", error);
    }
  }
}