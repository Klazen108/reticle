import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../project.model';
import * as moment from 'moment';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {
  @Input() project: Project;

  curTime: moment.Moment = moment();

  constructor() { }

  ngOnInit() {
  }

  dateDiff(from: Date, to: Date): number {
    var duration = moment.duration(moment(to).diff(from));
    return duration.asDays();
  }

  until(date: Date): number {
    return this.dateDiff(this.curTime.toDate(),date);
  }

  within(from: Date, to: Date): boolean {
    return this.curTime.isBetween(from,to);
  }
}
