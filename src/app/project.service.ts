import { Injectable } from '@angular/core';
import { Project } from './project.model';
import * as moment from 'moment';
import { Observable, of, throwError } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { catchError } from 'rxjs/operators';
import { Phase } from './phase.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Profile } from './profile.model';
import { Dashboard } from './dashboard.model';
import { AbstractListService } from './abstract-list.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends AbstractListService<Project> {

  token: string = "";

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
            start: "2019-01-09",
            end: "2019-01-09"
          }
        },
        {
          name: "Story Planning", 
          range: {
            start: "2019-01-09",
            end: "2019-01-09"
          }
        },
        {
          name: "Development", 
          range: {
            start: "2019-01-09",
            end: "2019-01-11"
          }
        },
        {
          name: "Testing", 
          range: {
            start: "2019-01-11",
            end: "2019-01-11"
          }
        },
        {
          name: "QAT", 
          range: {
            start: "2019-01-11",
            end: "2019-01-11"
          }
        },
        {
          name: "Deploy", 
          range: {
            start: "2019-01-14",
            end: "2019-01-14"
          }
        },
      ]
    }),
    new Project({name:"Example Project, Phase 2", 
    phases:[
      {
        name: "Detail Design", 
        range: {
          start: "2019-01-09",
          end: "2019-01-09"
        }
      },
      {
        name: "Story Planning", 
        range: {
          start: "2019-01-09",
          end: "2019-01-09"
        }
      },
      {
        name: "Development", 
        range: {
          start: "2018-12-20",
          end: "2019-01-01"
        }
      },
      {
        name: "Testing", 
        range: {
          start: "2019-01-02",
          end: "2019-01-08"
        }
      },
      {
        name: "QAT", 
        range: {
          start: "2019-01-09",
          end: "2019-01-22"
        }
      },
      {
        name: "Deploy", 
        range: {
          start: "2019-01-22",
          end: "2019-01-23"
        }
      },
    ]}),
    new Project({name:"Potential Project"})
  ];

  constructor(
    protected localStorage: LocalStorage,
    protected http: HttpClient
  ) {
    super(localStorage,http,'/api/project');
  }
  
  getDefault(): Project[] {
    return this.projects;
  }
  decode(json: string): Project[] {
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
  }
  storageKey(): string {
    return "projects";
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    ///Enumerate any global error handlers here based on the http status code
    const globalErrorHandlers: {[key:number]:(err:HttpErrorResponse)=>Observable<any>} = {
      500: error => {
        console.error(
          `Server error: Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
        return throwError('Something bad happened; please try again later.');},
      401: _ => {
        this.token = ""; //user is unauthorized, token is bad
        return throwError('Something bad happened; please try again later.')
      },
      404: _ => of(null)
    };

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      console.log(error);
      const handler 
        = globalErrorHandlers[error.status] 
        || (_ => throwError('Something bad happened; please try again later.'));
      return handler(error);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  };

  login(username, password: string): Observable<Profile|any> {
    return this.http.post<Profile>(
      "/api/profile/login",
      {username,password}
    ).pipe(
      catchError(this.handleError)
    );
  }

  register(username,password): Observable<Profile|any>{
    return this.http.post<Profile>(
      "/api/profile/register",
      {username,password}
    ).pipe(
      catchError(this.handleError)
    );
  }

  getDashboard(dashboardId: string): Observable<Dashboard> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.token
      })
    };

    return this.http.get<Dashboard>(`/api/dashboard/${dashboardId}`, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  patchDashboard(dashboard: Dashboard): Observable<Dashboard> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.token
      })
    };

    return this.http.patch<Dashboard>(`/api/dashboard/${dashboard.id}`, dashboard, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
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

  getChartPreferences(): Observable<any> {
    return this.getOrDefault("chartPrefs",
      {minDate:"2018-12-1",maxDate:"2019-03-01"},
      JSON.stringify,JSON.parse
    );
  }

  setChartPreferences(prefs: any): Observable<boolean> {
    return this.localStorage.setItem("chartPrefs",JSON.stringify(prefs));
  }
}
