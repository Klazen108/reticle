import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { mergeMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractListService<T> {

  constructor(
    protected localStorage: LocalStorage,
  ) {}

  /**
   * Get the default list of objects when uninitialized
   */
  abstract getDefault(): T[];

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
    return this.getOrDefault(this.storageKey(),this.getDefault(),
    (prj)=>JSON.stringify(prj),
    this.decode
    );
  }

  /**
   * Persists a list of objects to storage
   * 
   * @param list The list of objects to save
   */
  saveList(list: T[]) {
    this.localStorage.setItemSubscribe(this.storageKey(),JSON.stringify(list));
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
