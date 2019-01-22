import { Injectable } from '@angular/core';
import { Project } from './project.model';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { mergeMap, map } from 'rxjs/operators';
import { Phase } from './phase.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  defaultPhases: Phase[] = [
    {
      name: "Detail Design", 
      range: {}
    },
    {
      name: "Story Planning", 
      range: {}
    },
    {
      name: "Development", 
      range: {}
    },
    {
      name: "Testing", 
      range: {}
    },
    {
      name: "QAT", 
      range: {}
    },
    {
      name: "Deploy", 
      range: {}
    },
  ];

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

  getProjectsJson(): Observable<string> {
    return this.getProjects().pipe(map(p => JSON.stringify(p)));
  }

  saveProjectsJson(projects: string): Observable<any> {
    return this.localStorage.setItem("projects",projects);
  }

  getDefaultPhases(): Observable<Phase[]> {
  return this.getOrDefault("defaultPhases",this.defaultPhases,
      (phases)=>JSON.stringify(phases),
      (json)=>JSON.parse(json)
    );
  }

  saveDefaultPhases(phases: Phase[]): Observable<any> {
    return this.localStorage.setItem("defaultPhases",JSON.stringify(phases));
  }
}
