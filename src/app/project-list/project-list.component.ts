import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Project } from '../project.model';
import { ProjectService } from '../project.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';
import { DefaultPhaseDialogComponent } from '../default-phase-dialog/default-phase-dialog.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  cards: Project[] = [];
  justDeleted: Project = null;
  justDeletedIndex: number = 0;
  expanded = true;

  constructor(
    private projectService: ProjectService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    /*this.projectService.getProjects().subscribe(projects => {
      this.cards = projects;
    });*/
    this.projectService.getDashboard(193).subscribe(db => {
      this.cards = (db && db.projects) || [];
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
    this.projectService.getDefaultPhases().subscribe(phases => {
      this.cards.push(new Project({name:"New Project",phases}));
      this.saveList();
  
      setTimeout(()=>window.scrollTo({ left: 0, top: 100000, behavior: 'smooth' }),100);
    });
  }

  onUpdate(project: Project) {
    this.saveList();
  }

  onDelete(project: Project) {
    var index = this.cards.indexOf(project);
    if (index > -1) {
      this.projectService.archiveProject(project).subscribe(success => {
        if (!success) {
          this.snackBar.open(`Error archiving!`, "OK", {
            duration: 10000,
          }).onAction().subscribe();
          return;
        }

        this.cards.splice(index, 1);
        this.justDeleted = project;
        this.justDeletedIndex = index;
  
        this.saveList();
        this.snackBar.open(`Project "${project.name}" archived`, "Undo", {
          duration: 10000,
        }).onAction().subscribe(() => this.unDelete());
        return;
      });
    }
  }

  unDelete() {
    //TODO: need to be able to remove the project from the archive!
    this.cards.splice(this.justDeletedIndex, 0, this.justDeleted);
    this.justDeleted = null;
    this.justDeletedIndex = 0;
    this.saveList();
    
    this.snackBar.open(`Project "${this.justDeleted.name}" restored`, "OK", {
      duration: 3000,
    }).onAction().subscribe();
  }

  saveList() {
    console.log("saving");
    this.projectService.saveProjects(this.cards);
  }

  exportProjects() {
    this.projectService.getProjectsJson().subscribe(s => {
      let uri = (webkitURL).createObjectURL(new Blob([s],{type:"application/octet-stream"}))
      console.log(uri);
      console.log(s);
      window.open(uri,"_blank");
      setTimeout(() => (webkitURL).revokeObjectURL(uri));
    });
  }

  importProjects() {
    const dialogRef = this.dialog.open(ImportDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        try {
          JSON.parse(result)
        } catch (e) {
          this.snackBar.open("Invalid data, can't import projects!","OK")
          console.log(e);
          return;
        }

        this.projectService.saveProjectsJson(result)
        .subscribe(() => this.projectService.getProjects()
        .subscribe(projects => this.cards = projects));
      }
    });
  }
  
  setDefaultPhases() {
    this.projectService.getDefaultPhases().subscribe(p => {
      const dialogRef = this.dialog.open(DefaultPhaseDialogComponent, {
        width: '300px',
        data: p
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result)
          this.projectService.saveDefaultPhases(result);
      });
    });
  }

  toggleExpand() {
    this.expanded = !this.expanded;
  }
}
