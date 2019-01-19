import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Project } from '../project.model';
import * as moment from 'moment';
import { timer, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {
  @Input() project: Project;
  
  @Output() onUpdate: EventEmitter<Project> = new EventEmitter();

  curTime: moment.Moment = moment();
  timerSubscription: Subscription;
  editing: boolean;

  constructor() { }

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

  dateDiff(from: moment.Moment, to: moment.Moment): number {
    var duration = moment.duration(to.diff(from));
    return duration.asDays();
  }

  until(date: moment.Moment): number {
    return this.dateDiff(this.curTime,date);
  }

  within(from: Date, to: Date): boolean {
    return this.curTime.isBetween(from,to);
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
    console.log(normalized);
    const red = 255*this.clamp(2-2*normalized,0,1);
    const green = 255*this.clamp(2*normalized,0,1);
    return "rgb("+red+","+green+",0)";
  }
}
