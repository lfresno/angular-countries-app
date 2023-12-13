import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: ``
})
export class SearchBoxComponent implements OnInit, OnDestroy {

  //subject es un tipo especial de observable, usa los mismos métodos que este
  private debouncer: Subject<string> = new Subject<string>();
  private debouncerSubscription?: Subscription;

  @Input()
  public initialValue:string = '';

  @Input()
  public placeholder:string = '';

  @Output()
  public onValue = new EventEmitter<string>();

  @Output()
  public onDebounce = new EventEmitter<string>();


  ngOnInit(): void {
    //hay que hacer esto al implementar una suscripción en el onInit
    this.debouncerSubscription = this.debouncer
      .pipe(
        debounceTime(300)  //primer arg: cuanto tiempo esperar para hacer la siguiente emisión, 2arg: cuándo hacerla
          //cuando el observable deja de emitir valores por X seg (para de escribir), este pasa a la siguiente tarea (subscribe)
      )
      .subscribe(value => {
        this.onDebounce.emit(value);
      });
  }

  //hay que destruir el componente para limpiar las suscripciones
  //cada vez que se salga de una página que use este componente, se va a destruir
  ngOnDestroy(): void {
    this.debouncerSubscription?.unsubscribe();
  }

  emitValue(value:string):void {
    this.onValue.emit(value);
  }

  onKeyPressed(searchTerm:string ) {
    this.debouncer.next(searchTerm);
  }
}
