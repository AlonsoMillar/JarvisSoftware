import { Injectable } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';

export interface LogMessage {
  emisor: 'usuario' | 'jarvis';
  mensaje: string;
  hora: string;
  tipo: 'user' | 'jarvis'; 
  imagenUrl?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class JarvisService {

  // URL CON IP DE DE CASA
  //private readonly N8N_URL = 'http://192.168.1.104:5678/webhook/jarvis-voice';
  //d URL CON IP MOVIL
  private readonly N8N_URL = 'http://10.182.235.67:5678/webhook/jarvis-voice';
  public historial: LogMessage[] = [];

  constructor() { }

  /**
   * Registra los eventos en el historial del Dashboard
   */
  private agregarAlHistorial(emisor: 'usuario' | 'jarvis', mensaje: string, imgUrl?: string) {
    const nuevoLog: LogMessage = {
      emisor: emisor,
      mensaje: mensaje,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tipo: emisor === 'usuario' ? 'user' : 'jarvis',
      imagenUrl: imgUrl 
    };
    this.historial.unshift(nuevoLog);
  }

  async verificarPermisos() {
    const status = await SpeechRecognition.checkPermissions();
    const permisoVoz = (status as any).speech; 

    if (permisoVoz !== 'granted') {
      await SpeechRecognition.requestPermissions();
    }
  }

  /**
   * Activa el micrófono y gestiona el flujo de respuesta
   */
  async hablarConJarvis() {
    await this.verificarPermisos();

    return new Promise((resolve, reject) => {
      SpeechRecognition.start({
        language: "es-ES",
        partialResults: false,
      }).then(async (result) => {
        if (result.matches && result.matches.length > 0) {
          const texto = result.matches[0];
          
          // Registro de lo que dijo el usuario
          this.agregarAlHistorial('usuario', texto);
          
          // Enviamos a n8n y esperamos respuesta
          const respuesta = await this.enviarAn8n(texto);
          
          // Sintetizamos la voz sin importar la longitud
          await this.sintetizarVoz(respuesta);
          resolve(respuesta);
        }
      }).catch(err => {
        this.agregarAlHistorial('jarvis', "Error en sensores de audio.");
        reject(err);
      });
    });
  }

  /**
   * Comunicación principal con el cerebro n8n
   */
  private async enviarAn8n(mensaje: string): Promise<string> {
    try {
      const options = {
        url: this.N8N_URL,
        headers: { 'Content-Type': 'application/json' },
        data: { chatInput: mensaje } 
      };

      const response: HttpResponse = await CapacitorHttp.post(options);
      
      // Intentamos extraer la URL de la imagen si en el futuro n8n la envía
      const urlRecibida = response.data.imagenUrl || (response.data[0] && response.data[0].imagenUrl);
      
      // Extraemos el texto priorizando las llaves más comunes
      const respuestaIA = 
        response.data.response || 
        response.data.output || 
        (response.data[0] && response.data[0].output) || 
        response.data.text || 
        (typeof response.data === 'string' ? response.data : null) ||
        "Señor, la tarea ha sido procesada.";

      // Registramos la salida de Jarvis
      this.agregarAlHistorial('jarvis', respuestaIA, urlRecibida);

      return respuestaIA;
      
    } catch (error) {
      const msgError = "Error de enlace con n8n.";
      this.agregarAlHistorial('jarvis', msgError);
      return msgError;
    }
  }

  /**
   * Motor de síntesis de voz (Audio Output)
   */
  async sintetizarVoz(texto: string) {
    // Limpiamos el texto de asteriscos y numerales (formato Markdown) 
    // para que la lectura suene completamente natural y fluida.
    const textoParaVoz = texto.replace(/[*#]/g, '');

    await TextToSpeech.speak({
      text: textoParaVoz,
      lang: 'es-ES',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      category: 'ambient'
    });
  }
}