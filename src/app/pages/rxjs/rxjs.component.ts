import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, retry, interval, take, map, filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnInit, OnDestroy {

  public intervalSub!: Subscription;

  // https://reactivex.io/documentation/operators.html
  constructor() {

    /*     this.retornaObservable().pipe(
          retry()
        ).subscribe({
          next: (v) => console.log(v),
          error: (e) => console.error(e),
          complete: () => console.info('complete')
      }); */


    this.intervalSub = this.retornaInterval().pipe(
      retry()
    ).subscribe(console.log);



  }
  ngOnDestroy(): void {
    this.intervalSub.unsubscribe();
  }

  ngOnInit(): void {
  }


  retornaInterval(): Observable<number> {
    return interval(500)
      .pipe(
        map(valor => valor + 1),
        filter(valor => (valor % 2 === 0) ? true : false),
        /* take(10), */
      );
  }



  retornaObservable(): Observable<number> {
    let i = -1;

    return new Observable<number>(observer => {


      const intervalo = setInterval(() => {

        i++;
        observer.next(i);

        if (i === 4) {
          clearInterval(intervalo);
          observer.complete();
        }

        if (i === 2) {
          clearInterval(intervalo);
          observer.error('Se llegó a 2')
        }

      }, 1000)

    });


  }

}
