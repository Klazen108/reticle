import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Release } from '../release.model';
import { ReleaseComponent } from '../release-component.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-checklist-card',
  templateUrl: './checklist-card.component.html',
  styleUrls: ['./checklist-card.component.scss']
})
export class ChecklistCardComponent implements OnInit {
  @Input() release: Release;
  @Output() onUpdate: EventEmitter<Release> = new EventEmitter();
  @Output() onDelete: EventEmitter<Release> = new EventEmitter();
  
  justDeleted: ReleaseComponent = null;
  justDeletedIndex: number = 0;

  constructor(
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  addComponent() {
    this.release.components.push(new ReleaseComponent({name:"New Release Component"}));
    this.onUpdate.emit(this.release);
  }
  
  onCompUpdate(comp: ReleaseComponent) {
    this.onUpdate.emit(this.release);
  }

  onCompDelete(comp: ReleaseComponent) {
    var index = this.release.components.indexOf(comp);
    if (index > -1) {

      this.release.components.splice(index, 1);
      this.justDeleted = comp;
      this.justDeletedIndex = index;

      this.onUpdate.emit(this.release);
      this.snackBar.open(`Release Component "${comp.name}" deleted`, "Undo", {
        duration: 10000,
      }).onAction().subscribe(() => this.unDelete());
      
    }
  }

  delete() {
    this.onDelete.emit(this.release);
  }

  unDelete() {
    //TODO: need to be able to remove the project from the archive!
    this.release.components.splice(this.justDeletedIndex, 0, this.justDeleted);
    this.justDeleted = null;
    this.justDeletedIndex = 0;
    this.onUpdate.emit(this.release);
    
    this.snackBar.open(`Release Component "${this.justDeleted.name}" restored`, "OK", {
      duration: 3000,
    }).onAction().subscribe();
  }
}