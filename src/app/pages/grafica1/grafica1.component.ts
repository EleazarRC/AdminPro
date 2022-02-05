import { Component } from '@angular/core';


@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  public labels1: string[] = ['Ejemplo1', 'Ejemplo2', 'Ejemplo3'];
  public datasets1: any = [
    {
      data: [200, 500, 100],
      backgroundColor: ['#AB7FDB', '#A691F9', '#DB7FD7']
    }
  ]


}
