import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Project } from '../project.model';
import { ProjectService } from '../project.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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

    //of(this.cards).pipe(debounceTime(1000*10)).subscribe(p => {
      console.log("save time!");
      this.projectService.saveProjects(this.cards);
    //});
  }

  addProject() {
    this.cards.push(new Project({name:"New Project"}));
    this.saveList();
  }

  onUpdate(project: Project) {
    this.saveList();
  }

  saveList() {
    console.log("saving");
    this.projectService.saveProjects(this.cards);
  }
}
