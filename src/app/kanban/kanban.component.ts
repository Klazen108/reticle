import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit {

  @Input()
  cards: any[] = [
    {
      name: 'Open',
      tickets: [
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0},
        {artifactId:"artf12345",title:'woogedy woogedy woogedy woogedy woogedy woogedy ',est:1,rem:1,act:0}
      ]
    },
    {
      name: 'Acknowledged',
      tickets: [
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0},
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0}
      ]
    },
    {
      name: 'In Development',
      tickets: [
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0},
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0}
      ]
    },
    {
      name: 'Ready For Test',
      tickets: [
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0},
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0}
      ]
    },
    {
      name: 'Ready For QA',
      tickets: [
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0},
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0}
      ]
    },
    {
      name: 'QA Passed',
      tickets: [
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0},
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0}
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
