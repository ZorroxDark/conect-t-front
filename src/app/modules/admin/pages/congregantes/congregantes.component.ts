import { ChangeDetectionStrategy,Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-congregantes',
  templateUrl: './congregantes.component.html',
  styleUrls: ['./congregantes.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class CongregantesComponent {

  constructor() { }

  ngOnInit(): void {
  }

}

