import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {
      titulo: 'DashBoard',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Main', url: '/' },
        { titulo: 'ProgressBar', url: 'progress' },
        { titulo: 'Gráfica', url: 'grafica1' }
      ]
    }
  ]

  constructor() { }
}
