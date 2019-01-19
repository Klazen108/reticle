import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Project } from '../project.model';
import { ProjectService } from '../project.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  cards: Project[] = [];
  justDeleted: Project = null;
  justDeletedIndex: number = 0;

  constructor(
    private projectService: ProjectService,
    public snackBar: MatSnackBar
  ) { }

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

  onDelete(project: Project) {
    console.log("deleting");
    var index = this.cards.indexOf(project);
    if (index > -1) {
      this.cards.splice(index, 1);
      this.justDeleted = project;
      this.justDeletedIndex = index;
    }
    this.saveList();

    this.snackBar.open(`Project "${project.name}" deleted`, "Undo", {
      duration: 10000,
    }).onAction().subscribe(() => this.unDelete());
  }

  unDelete() {
    this.cards.splice(this.justDeletedIndex, 0, this.justDeleted);
    this.justDeleted = null;
    this.justDeletedIndex = 0;
    this.saveList();
  }

  saveList() {
    console.log("saving");
    this.projectService.saveProjects(this.cards);
  }
}
