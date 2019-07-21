import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FormsModule } from '@angular/forms';
import { ProjectListHeaderComponent } from './project-list-header/project-list-header.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { ImportDialogComponent } from './import-dialog/import-dialog.component';
import { DefaultPhaseDialogComponent } from './default-phase-dialog/default-phase-dialog.component';
import { RouterModule, Routes } from '@angular/router';
import { ProjectChartComponent } from './project-chart/project-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { ChecklistComponent } from './checklist/checklist.component';
import { ChecklistCardComponent } from './checklist-card/checklist-card.component';
import { ReleaseComponentComponent } from './release-component/release-component.component';
import { KanbanComponent } from './kanban/kanban.component';

const appRoutes: Routes = [
  { path: 'projects', component: ProjectListComponent },
  { path: 'chart',  component: ProjectChartComponent },
  { path: 'checklist',  component: ChecklistComponent },
  { path: 'kanban',  component: KanbanComponent },
  { path: '**',
    redirectTo: '/projects',
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    AppComponent,
    ProjectListComponent,
    ProjectCardComponent,
    ProjectListHeaderComponent,
    DeleteDialogComponent,
    ImportDialogComponent,
    DefaultPhaseDialogComponent,
    ProjectChartComponent,
    ChecklistComponent,
    ChecklistCardComponent,
    ReleaseComponentComponent,
    KanbanComponent  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    DragDropModule,
    MatDatepickerModule,
    MatMomentDateModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    DeleteDialogComponent, 
    ImportDialogComponent, 
    DefaultPhaseDialogComponent
  ]
})
export class AppModule { }
