import { Component, OnInit } from '@angular/core';
import { Release } from '../release.model';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ReleaseService } from '../release.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {

  releases: Release[] = [];
  
  justDeleted: Release = null;
  justDeletedIndex: number = 0;

  constructor(
    private releaseService: ReleaseService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.releaseService.getList().subscribe(db => {
      this.releases = db;
    });
  }

  addProject() {
    this.releases.push(new Release({name:"New Release"}));
    this.saveList();

    setTimeout(()=>window.scrollTo({ left: 0, top: 100000, behavior: 'smooth' }),100);
  }

  exportProjects() {
    this.releaseService.getListJson().subscribe(s => {
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
          this.snackBar.open("Invalid data, can't import releases!","OK")
          console.log(e);
          return;
        }

        this.releaseService.saveListJson(result)
        .subscribe(() => this.releaseService.getList()
        .subscribe(releases => this.releases = releases));
      }
    });
  }

  saveList() {
    console.log("saving");
    this.releaseService.saveList(this.releases);
  }

  dropped(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.releases,event.previousIndex, event.currentIndex
    );

    //of(this.cards).pipe(debounceTime(1000*10)).subscribe(p => {
      console.log("save time!");
      this.releaseService.saveList(this.releases);
    //});
  }
  

  onUpdate(release: Release) {
    this.saveList();
  }

  onDelete(release: Release) {
    var index = this.releases.indexOf(release);
    if (index > -1) {
      this.releaseService.archive(release).subscribe(success => {
        if (!success) {
          this.snackBar.open(`Error archiving!`, "OK", {
            duration: 10000,
          }).onAction().subscribe();
          return;
        }

        this.releases.splice(index, 1);
        this.justDeleted = release;
        this.justDeletedIndex = index;
  
        this.saveList();
        this.snackBar.open(`Release "${release.name}" archived`, "Undo", {
          duration: 10000,
        }).onAction().subscribe(() => this.unDelete());
        return;
      });
    }
  }

  unDelete() {
    //TODO: need to be able to remove the project from the archive!
    this.releases.splice(this.justDeletedIndex, 0, this.justDeleted);
    this.justDeleted = null;
    this.justDeletedIndex = 0;
    this.saveList();
    
    this.snackBar.open(`Release "${this.justDeleted.name}" restored`, "OK", {
      duration: 3000,
    }).onAction().subscribe();
  }

}
