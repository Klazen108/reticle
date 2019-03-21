import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Release } from '../release.model';
import { ReleaseComponent } from '../release-component.model';

@Component({
  selector: 'app-checklist-card',
  templateUrl: './checklist-card.component.html',
  styleUrls: ['./checklist-card.component.scss']
})
export class ChecklistCardComponent implements OnInit {
  @Input() release: Release;
  @Output() onUpdate: EventEmitter<Release> = new EventEmitter();
  @Output() onDelete: EventEmitter<Release> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  addComponent() {
    this.release.components.push(new ReleaseComponent({name:"New Release Component"}));
    this.onUpdate.emit(this.release);
  }

}
