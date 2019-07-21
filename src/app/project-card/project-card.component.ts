import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Project } from '../project.model';
import * as moment from 'moment';
import { timer, Subscription, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { Phase } from '../phase.model';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {
  @Input() project: Project;

  @Input() expanded: boolean = true;
  
  @Output() onUpdate: EventEmitter<Project> = new EventEmitter();
  @Output() onDelete: EventEmitter<Project> = new EventEmitter();

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  curTime: moment.Moment = moment();
  timerSubscription: Subscription;
  editing: boolean;
  
  justDeleted: Phase = null;
  justDeletedIndex: number = 0;

  public phaseNameChange = new Subject<string>();

  phases(): Phase[] {
    if (this.expanded) return this.project.phases;
    else {
      return this.project.phases.filter(p => !p.range || !p.range.end || moment(p.range.end).isAfter(this.curTime));
    }
  }

  displayedColumns: string[] = [
    "name","start","days","end","daysend","duration","remove"
  ]

  constructor(public dialog: MatDialog,
    public snackBar: MatSnackBar) {
    const observable = this.phaseNameChange
    .pipe(
      debounceTime(1000),
      distinctUntilChanged())
    .subscribe(_ => this.onUpdate.emit(this.project));
  }

  ngOnInit() {
    //every 10 minutes, update the timer
    this.timerSubscription = timer(600000, 600000).subscribe(val => {
      //console.log("retiming");
      this.curTime = moment();
    });
  }

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
  }

  dateDiff(from: string, to: string): number {
    return this.dateDiff2(moment(from),to);
  }

  dateDiff2(from: moment.Moment, to: string): number {
    if (from == null || to == null) return 0;
    var duration = moment.duration(moment(to).diff(moment(from)));
    return Math.ceil(duration.asDays());
  }

  until(date: string): number {
    return this.dateDiff2(this.curTime,date);
  }

  within(from: Date, to: Date): boolean {
    return this.curTime.isBetween(moment(from).startOf('day'),moment(to).endOf('day'));
  }

  openProject(folder: string) {
    window.open("google.com", '_blank');
  }

  toggleEditHeader() {
    this.editing = !this.editing;
    if (!this.editing) {
      this.onUpdate.emit(this.project);
    }
  }

  clamp(val, min, max: number): number {
    return Math.max(Math.min(val,max),min);
  }

  rangeColor(val: number): string {
    const minRange = 0;
    const maxRange = 14;

    let normalized = this.clamp(val,minRange,maxRange)/(maxRange-minRange);
    const red = 150*this.clamp(2-2*normalized,0,1);
    const green = 150*this.clamp(2*normalized,0,1);
    return "rgb("+red+","+green+",0)";
  }

  delete() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      data: this.project
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.onDelete.emit(this.project);
    });
  }

  update(event: any) {
    this.onUpdate.emit(this.project);
  }

  addPhase() {
    this.project.phases.push(new Phase({name:"Phase"}));
    this.table.renderRows();
    this.onUpdate.emit(this.project);
  }

  removePhase(phase: Phase) {
    console.log("deleting");
    var index = this.project.phases.indexOf(phase);
    if (index > -1) {
      this.project.phases.splice(index, 1);
      this.justDeleted = phase;
      this.justDeletedIndex = index;

      this.table.renderRows();
      this.onUpdate.emit(this.project);
      
      this.snackBar.open(`Phase "${phase.name}" on project "${this.project.name}" deleted`, "Undo", {
        duration: 10000,
      }).onAction().subscribe(() => this.unDelete());
    }
  }

  unDelete() {
    this.project.phases.splice(this.justDeletedIndex, 0, this.justDeleted);
    this.justDeleted = null;
    this.justDeletedIndex = 0;
    
    this.table.renderRows();
    this.onUpdate.emit(this.project);
    
    this.snackBar.open(`Phase "${this.justDeleted.name}" on project "${this.project.name}" restored`, "OK", {
      duration: 3000,
    }).onAction().subscribe();
  }

  toggleExpand() {
    this.expanded = !this.expanded;
  }
}
