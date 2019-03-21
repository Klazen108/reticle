import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule, MatButtonModule, MatInputModule, MatTableModule, MatDialogModule, MatSnackBarModule, MatIconModule, MatListModule } from '@angular/material';
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

const appRoutes: Routes = [
  { path: 'projects', component: ProjectListComponent },
  { path: 'chart',  component: ProjectChartComponent },
  { path: 'checklist',  component: ChecklistComponent },
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
    ReleaseComponentComponent  ],
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
