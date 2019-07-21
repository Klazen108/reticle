import { Component, OnInit, Inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Phase } from '../phase.model';
import { ProjectService } from '../project.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-default-phase-dialog',
  templateUrl: './default-phase-dialog.component.html',
  styleUrls: ['./default-phase-dialog.component.scss']
})
export class DefaultPhaseDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DefaultPhaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Phase[]
    ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  dropped(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.data,event.previousIndex, event.currentIndex
    );
  }

  addPhase() {
    this.data.push(new Phase({name:"New Phase"}));
  }
}
