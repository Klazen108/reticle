import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Release } from '../release.model';

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

}
