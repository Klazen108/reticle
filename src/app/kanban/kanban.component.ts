import { Component, OnInit, Input, ViewChildren } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList } from '@angular/cdk/drag-drop';
import { transition } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

type TransitionFunction = (any) => boolean;
interface TransitionFunctionEntry {
  id: string,
  name: string,
  func: TransitionFunction,
}
interface FunctionMap { [id: string]: TransitionFunctionEntry };

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit {

  transitionFunctions: TransitionFunctionEntry[] = [
    {
      id: "c2c8f9ab-6012-4364-ae32-22e701ab3630",
      name: "None",
      func: (card) => null
    },
    {
      id: "ba13d6df-4268-4838-ba8a-32778ad9fbb0",
      name: "Always Deny",
      func: (card) => "Always Deny Transitions Here"
    }
  ]

  @Input()
  lists: any[] = [
    {
      name: 'Open',
      tickets: [
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0},
        {artifactId:"artf12345",title:'woogedy woogedy woogedy woogedy woogedy woogedy ',est:1,rem:1,act:0}
      ],
      onTransition: this.transitionFunctions.find(a => a.id === "ba13d6df-4268-4838-ba8a-32778ad9fbb0")
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

  constructor(
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  dropped(event: CdkDragDrop<any>, i: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.lists[i].tickets, event.previousIndex, event.currentIndex);
    } else {
      if (event.container.data.onTransition !== undefined) {
        try {
          const ticket = event.previousContainer.data[event.previousIndex];
          const err = event.container.data.onTransition.func(ticket);
          if (err) {
            this.snackBar.open(`State transition to ${event.container.data.name} denied: ${err}`, "OK", {
              duration: 10000,
            }).onAction().subscribe();
            return;
          }
        } catch (transitionFailure) {
          this.snackBar.open(`State transition failed! Please contact the developer.`, "OK", {
            duration: 10000,
          }).onAction().subscribe();
          console.log(transitionFailure);
          return;
        }
      }

      transferArrayItem(event.previousContainer.data.tickets,
                        event.container.data.tickets,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

}
