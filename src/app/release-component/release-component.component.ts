import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReleaseComponent } from '../release-component.model';

@Component({
  selector: 'app-release-component',
  templateUrl: './release-component.component.html',
  styleUrls: ['./release-component.component.scss']
})
export class ReleaseComponentComponent implements OnInit {
  @Input() component: ReleaseComponent;
  @Output() onUpdate: EventEmitter<ReleaseComponent> = new EventEmitter();
  @Output() onDelete: EventEmitter<ReleaseComponent> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  delete() {
    this.onDelete.emit(this.component);
  }
}
