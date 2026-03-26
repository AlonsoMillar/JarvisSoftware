import { Injectable } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class JarvisService {

  private readonly N8N_URL = 'http://192.168.1.100:5678/webhook-test/jarvis-voice';

  constructor() { }

  async verificarPermisos() {
    const status = await SpeechRecognition.checkPermissions();
    const permisoVoz = (status as any).speech; 

    if (permisoVoz !== 'granted') {
      await SpeechRecognition.requestPermissions();
    }
  }

  async hablarConJarvis() {
    await this.verificarPermisos();

    return new Promise((resolve, reject) => {
      SpeechRecognition.start({
        language: "es-ES",
        partialResults: false,
      }).then(async (result) => {
        if (result.matches && result.matches.length > 0) {
          const texto = result.matches[0];
          console.log('Escuchado:', texto);
          const respuesta = await this.enviarAn8n(texto);
          await this.sintetizarVoz(respuesta);
          resolve(respuesta);
        }
      }).catch(err => {
        console.error('Error en SpeechRecognition:', err);
        reject(err);
      });
    });
  }

  private async enviarAn8n(mensaje: string): Promise<string> {
    try {
      const options = {
        url: this.N8N_URL,
        headers: { 'Content-Type': 'application/json' },
        data: { chatInput: mensaje } 
      };

      const response: HttpResponse = await CapacitorHttp.post(options);
      console.log('Datos brutos de n8n:', response.data);

      // Buscamos el mensaje en todas las ubicaciones posibles
      const respuestaIA = 
        response.data.output || 
        (response.data[0] && response.data[0].output) || 
        response.data.text || 
        (typeof response.data === 'string' ? response.data : null);

      return respuestaIA || "Señor, la conexión fue exitosa, pero el mensaje del servidor está vacío.";
      
    } catch (error) {
      console.error('Error de conexión con n8n:', error);
      return "Lo siento Señor, no puedo conectar con el servidor central. Verifique si su PC y el móvil están en la misma red.";
    }
  }

  private async sintetizarVoz(texto: string) {
    console.log('Hablando:', texto);
    await TextToSpeech.speak({
      text: texto,
      lang: 'es-ES',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      category: 'ambient'
    });
  }
}