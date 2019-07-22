import { Injectable } from '@angular/core';
import { AbstractListService } from './abstract-list.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends AbstractListService<any> {
  decode(json: string): any[] {
    throw new Error("Method not implemented.");
  }
  storageKey(): string {
    throw new Error("Method not implemented.");
  }

  constructor(
    protected http: HttpClient
  ) {
    super(null,http,'/api/task');
  }
}
