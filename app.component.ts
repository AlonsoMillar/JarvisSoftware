import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  // Guardamos la ruta actual para que los botones brillen cuando estemos en ellos
  get rutaActual() {
    return this.router.url;
  }

  // El constructor DEBE ir aquí dentro
  constructor(private router: Router) {}

  // La función de navegación ahora es parte de la clase
  navegar(ruta: string) {
    console.log("Cambiando a protocolo:", ruta);
    this.router.navigate([ruta]);
  }
}