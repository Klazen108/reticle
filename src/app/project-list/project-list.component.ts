import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Project } from '../project.model';
import { ProjectService } from '../project.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  cards: Project[] = [];

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    this.projectService.getProjects().subscribe(projects => {
      this.cards = projects;
    });
  }

  dropped(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.cards,event.previousIndex, event.currentIndex
    );
  }

}
