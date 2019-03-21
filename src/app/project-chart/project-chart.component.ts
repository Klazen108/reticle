import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Project } from '../project.model';
import { ProjectService } from '../project.service';
import * as moment from 'moment';
import { Phase } from '../phase.model';

@Component({
  selector: 'app-project-chart',
  templateUrl: './project-chart.component.html',
  styleUrls: ['./project-chart.component.scss']
})
export class ProjectChartComponent implements OnInit {
  @ViewChild('graphBlock') private graphBlock: ElementRef;

  projects: Project[] = [];
  minDate: moment.Moment;
  maxDate: moment.Moment;

  graphWidth: number = 500;

  constructor(
    private projectService: ProjectService
  ) { }

  ngAfterViewInit() {
    this.graphWidth = this.graphBlock.nativeElement.offsetWidth;
    console.log(this.graphWidth);

    this.projectService.getChartPreferences().subscribe(prefs => {
      this.minDate = moment(prefs.minDate);
      this.maxDate = moment(prefs.maxDate);
    });

    this.projectService.getList().subscribe(projects => {
      this.projects = projects;
    });
  }

  ngOnInit() {

  }

  autosize(projects: Project[]) {
    let dateStream = projects
      .map(p => p.phases) //stream of phase[]
      .reduce((x,y) => x.concat(y), []) //stream of phase
      .map(p => p.range) //stream of ranges
      .filter(r => r != null) //exclude unspecified ranges
      .map(r => [r.end,r.start]) //extract start, end
      .reduce((x,y) => x.concat(y), []) //stream of dates
      .filter(m => m != null) //exclude unspecified dates
      .filter(m => m.isValid());
      
    this.minDate = dateStream
      .reduce((min,cur) => moment.min([min,cur]), moment())
      .startOf('day');
    this.maxDate = dateStream
      .reduce((max,cur) => moment.max([max,cur]), moment())
      .endOf('day');

    console.log(this.minDate);
    console.log(this.maxDate);

    this.updatePrefs();
  }

  updatePrefs() {
    console.log("updating preferences")
    this.projectService.setChartPreferences({
      minDate:this.minDate,
      maxDate:this.maxDate
    }).subscribe();
  }

  width(phase: Phase): string {
    if (
      phase.range.end   == null || !phase.range.end  .isValid() ||
      phase.range.start == null || !phase.range.start.isValid()
    ) return "0px";

    if (phase.range.end.endOf('day') < this.minDate) return '0px';
    
    const fullWidth = this.maxDate.diff(this.minDate)
    const phaseWidth = phase.range.end.endOf('day').diff(phase.range.start.startOf('day'));

    let adj = this.marginLeftVal(phase);
    if (adj > 0) adj = 0;
    return (this.graphWidth * (phaseWidth/fullWidth) + adj) + 'px'
  }

  marginLeft(phase: Phase): string {
    let adj = this.marginLeftVal(phase);
    if (adj < 0) adj = 0;
    return adj + 'px'
  }

  marginLeftVal(phase: Phase): number {
    const fullWidth = this.maxDate.diff(this.minDate)
    const phaseStart = phase.range.start.startOf('day').diff(this.minDate);

    return (this.graphWidth * (phaseStart/fullWidth));
  }

  marginLeftToday(): string {
    if (this.minDate == null) return "0";

    const fullWidth = this.maxDate.diff(this.minDate)
    const phaseStart = moment().startOf('day').diff(this.minDate);
    
    return (this.graphWidth * (phaseStart/fullWidth)) + 'px'
  }

  /*marginRight(phase: Phase) {
    const fullWidth = this.maxDate.diff(this.minDate)
    const phaseStart = phase.range.start.startOf('day').diff(this.minDate);

    //500px is max-min
    return 500 * (phaseStart/fullWidth)
  }*/
}
