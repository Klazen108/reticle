import { Component, OnInit } from '@angular/core';
import { Project } from '../project.model';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  cards: Project[] = [
    {name:"project a"},
    {name:"project b"},
    {name:"project c"}
  ];

  constructor() { }

  ngOnInit() {
  }

}
