import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectCardComponent } from './project-card/project-card.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectListComponent,
    ProjectCardComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
