import { Component, OnInit, Input, ViewChildren } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList } from '@angular/cdk/drag-drop';
import { transition } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../task.service';

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
  lists: any[] = [];

  constructor(
    public snackBar: MatSnackBar,
    protected taskService: TaskService
  ) { }

  ngOnInit() {
    this.taskService.getList().subscribe(lists => this.lists = lists);
  }

  dropped(event: CdkDragDrop<any>, i: number) {
    if (event.previousContainer === event.container) {
      //Re-sorting cards in list
      moveItemInArray(this.lists[i].tickets, event.previousIndex, event.currentIndex);
    } else {
      //Transitioning card to other list
      if (event.container.data.onTransition !== undefined) {
        const transFunc = this.transitionFunctions.find(f => f.id === event.container.data.onTransition);
        if (transFunc === undefined) {
          this.snackBar.open(`Unsupported transition function ${event.container.data.onTransition}! Please contact the developer.`, "OK", {
            duration: 10000,
          }).onAction().subscribe();
          return;
        }
        try {
          const ticket = event.previousContainer.data[event.previousIndex];
          const err = transFunc.func(ticket);
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
