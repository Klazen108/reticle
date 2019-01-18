import { Injectable } from '@angular/core';
import { Project } from './project.model';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  projects: Project[] =[
    new Project({name:"Example Project", 
      phases:[
        {
          name: "Detail Design", 
          range: {
            start: moment("2019-01-09"),
            end: moment("2019-01-09")
          }
        },
        {
          name: "Story Planning", 
          range: {
            start: moment("2019-01-09"),
            end: moment("2019-01-09")
          }
        },
        {
          name: "Development", 
          range: {
            start: moment("2019-01-09"),
            end: moment("2019-01-11")
          }
        },
        {
          name: "Testing", 
          range: {
            start: moment("2019-01-11"),
            end: moment("2019-01-11")
          }
        },
        {
          name: "QAT", 
          range: {
            start: moment("2019-01-11"),
            end: moment("2019-01-11")
          }
        },
        {
          name: "Deploy", 
          range: {
            start: moment("2019-01-14"),
            end: moment("2019-01-14")
          }
        },
      ]
    }),
    new Project({name:"Example Project, Phase 2", 
    phases:[
      {
        name: "Detail Design", 
        range: {
          start: moment("2019-01-09"),
          end: moment("2019-01-09")
        }
      },
      {
        name: "Story Planning", 
        range: {
          start: moment("2019-01-09"),
          end: moment("2019-01-09")
        }
      },
      {
        name: "Development", 
        range: {
          start: moment("2018-12-20"),
          end: moment("2019-01-01")
        }
      },
      {
        name: "Testing", 
        range: {
          start: moment("2019-01-02"),
          end: moment("2019-01-08")
        }
      },
      {
        name: "QAT", 
        range: {
          start: moment("2019-01-09"),
          end: moment("2019-01-22")
        }
      },
      {
        name: "Deploy", 
        range: {
          start: moment("2019-01-22"),
          end: moment("2019-01-23")
        }
      },
    ]}),
    new Project({name:"Potential Project"})
  ];

  constructor(protected localStorage: LocalStorage) {}

  private getOrDefault<T>(key: string, defaultVal: T, encoder: (val: T)=>string, decoder: (val: string)=>T): Observable<T> {
    return this.localStorage.has(key).pipe(mergeMap(r => {
      if (r) return this.localStorage.getItem<string>(key).pipe(mergeMap(x => of(decoder(x as string))));
      else {
        return this.localStorage.setItem(key,encoder(defaultVal))
          .pipe(mergeMap(r => this.localStorage.getItem<string>(key).pipe(mergeMap(x => of(decoder(x as string))))));
      };
    })) as Observable<T>;
  }

  getProjects(): Observable<Project[]> {
    return this.getOrDefault("projects",this.projects,
    (prj)=>JSON.stringify(prj),
    (json)=>{ //TODO: standard decoder?
      const jsonData = JSON.parse(json);
      let projects: Project[] = [];
      for (var i = 0; i < jsonData.length; i++) {
        //console.log(jsonData[i]);
        if (jsonData[i].phases) {
          for (var j = 0; j < jsonData[i].phases.length; j++) {
            jsonData[i].phases[j].range.start = moment(jsonData[i].phases[j].range.start);
            jsonData[i].phases[j].range.end = moment(jsonData[i].phases[j].range.end);
          }
        }
        projects.push(new Project(jsonData[i]));
      }
      return projects;
      //new Project[](JSON.parse(json))
    });
  }

  saveProjects(projects: Project[]) {
    this.localStorage.setItemSubscribe("projects",JSON.stringify(projects));
  }
}
