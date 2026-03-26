import { Component } from '@angular/core';
// Importe aquí su servicio de Jarvis si ya lo tiene creado
// import { JarvisService } from '../services/jarvis.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage {

  // --- Propiedades del Sistema ---
  estaEscuchando: boolean = false;
  capacidadMemoria: number = 85; // Valor estático por ahora
  ultimaRespuestaIA: string = 'Sistemas listos. Esperando órdenes, Sr. Millar.';

  constructor(
    // private jarvis: JarvisService // Inyecte su servicio aquí
  ) {}

  /**
   * Activa el protocolo de escucha del Reactor ARC
   */
  async activarEscucha() {
    this.estaEscuchando = true;
    console.log("Protocolo de escucha iniciado...");

    try {
      // Aquí irá la llamada a su servicio de reconocimiento de voz
      // const texto = await this.jarvis.escucharVoz();
      
      // Simulación de respuesta para pruebas:
      setTimeout(() => {
        this.estaEscuchando = false;
        this.ultimaRespuestaIA = "He procesado su comando, señor.";
      }, 3000);

    } catch (error) {
      this.estaEscuchando = false;
      this.ultimaRespuestaIA = "Error en los sensores de audio, señor.";
    }
  }

}