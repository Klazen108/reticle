import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { mergeMap, map } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';

export interface MongooseModel {
  _id: string
}

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractListService<T extends MongooseModel> {

  constructor(
    protected localStorage: LocalStorage,
    protected http: HttpClient,
    protected url: string
  ) {}

  /**
   * Decode a raw json array of objects into a typed list of objects
   * 
   * @param json The raw json array of objects
   */
  abstract decode(json: string): T[];

  /**
   * Get the key to use as the name for this list in storage
   */
  abstract storageKey(): string;

  getList(): Observable<T[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'//,
        //'Authorization': this.token
      })
    };
    return this.http.get<T[]>(this.url, httpOptions);
  }

  /**
   * Persists a list of objects to storage
   * 
   * @param list The list of objects to save
   */
  saveList(list: T[]): Observable<T[]> {
    return forkJoin(list.map(t => this.saveSingle(t)))
  }

  /**
   * Persists an object to storage
   * 
   * @param item The object to save
   */
  saveSingle(item: T): Observable<T> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'//,
        //'Authorization': this.token
      })
    };
    if (item._id) return this.http.patch<T>(`${this.url}/${item._id}`, item, httpOptions)
    else return this.http.put<T>(`${this.url}`, item, httpOptions)
  }

  /**
   * Get a list of objects from storage
   */
  getListJson(): Observable<string> {
    return this.getList().pipe(map(p => JSON.stringify(p)));
  }

  /**
   * Persists a list of objects in raw json form to storage. Used for import.
   * 
   * @param list The list of objects to save
   */
  saveListJson(list: string): Observable<any> {
    return this.localStorage.setItem(this.storageKey(),list);
  }

  /**
   * Adds an item to the archive list. The archived items do not return in the normal
   * list, but you will need to remove it from the normal list first.
   * 
   * @param item The object to add to the archive
   */
  archive(item: T): Observable<boolean> {
    return this.getArchive().pipe(mergeMap(archive => {
      archive.push(item);

      //I was a dingus and used camelcase so lets keep it going
      let key = this.storageKey();
      key = "archived"+key.charAt(0).toUpperCase() + key.slice(1);

      return this.localStorage.setItem(key,JSON.stringify(archive));
    }));
  }

  /**
   * Gets an "archive" list of objects
   */
  getArchive(): Observable<T[]> {
    //I was a dingus and used camelcase so lets keep it going
    let key = this.storageKey();
    key = "archived"+key.charAt(0).toUpperCase() + key.slice(1);

    return this.getOrDefault(key,[],
      (archive)=>JSON.stringify(archive),
      this.decode
    )
  }
  
  protected getOrDefault<T>(key: string, defaultVal: T, encoder: (val: T)=>string, decoder: (val: string)=>T): Observable<T> {
    return this.localStorage.has(key).pipe(mergeMap(r => {
      if (r) return this.localStorage.getItem<string>(key).pipe(mergeMap(x => of(decoder(x as string))));
      else {
        return this.localStorage.setItem(key,encoder(defaultVal))
          .pipe(mergeMap(r => this.localStorage.getItem<string>(key).pipe(mergeMap(x => of(decoder(x as string))))));
      };
    })) as Observable<T>;
  }
}
