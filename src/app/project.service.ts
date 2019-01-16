import { Injectable } from '@angular/core';
import { Project } from './project.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor() { }

  getProjects(): Project[] {
    return [
      {name:"project a", 
        phases:[
          {
            name: "Detail Design", 
            range: {
              start: moment("2019-01-09").toDate(),
              end: moment("2019-01-09").toDate()
            }
          },
          {
            name: "Story Planning", 
            range: {
              start: moment("2019-01-09").toDate(),
              end: moment("2019-01-09").toDate()
            }
          },
          {
            name: "Development", 
            range: {
              start: moment("2019-01-09").toDate(),
              end: moment("2019-01-11").toDate()
            }
          },
          {
            name: "Testing", 
            range: {
              start: moment("2019-01-11").toDate(),
              end: moment("2019-01-11").toDate()
            }
          },
          {
            name: "QAT", 
            range: {
              start: moment("2019-01-11").toDate(),
              end: moment("2019-01-11").toDate()
            }
          },
          {
            name: "Deploy", 
            range: {
              start: moment("2019-01-14").toDate(),
              end: moment("2019-01-14").toDate()
            }
          },
        ]
      },
      {name:"project b"},
      {name:"project c"}
    ];
  }
}
