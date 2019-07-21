import { Component, OnInit, Input, ViewChildren } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList } from '@angular/cdk/drag-drop';

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

  dropped(event: CdkDragDrop<string[]>, i: number) {

    if (event.previousContainer === event.container) {
      console.log(this.cards[i])
      moveItemInArray(this.cards[i], event.previousIndex, event.currentIndex);
      console.log(this.cards[i])
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

}
