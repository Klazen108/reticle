import { Component, OnInit } from '@angular/core';
import { Project } from '../project.model';
import * as moment from 'moment';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  cards: Project[] = [];

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    this.cards = this.projectService.getProjects();
  }

}
