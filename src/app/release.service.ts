import { Injectable } from '@angular/core';
import { AbstractListService } from './abstract-list.service';
import { Release } from './release.model';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class ReleaseService extends AbstractListService<Release> {

  releases: Release[] = [];
  
  constructor(
    protected localStorage: LocalStorage,
  ) {
    super(localStorage,null,null);
  }

  getDefault(): Release[] {
    return this.releases;
  }

  decode(json: string): Release[] {
    const jsonData = JSON.parse(json);
    let releases: Release[] = [];
    for (var i = 0; i < jsonData.length; i++) {
      releases.push(new Release(jsonData[i]));
    }
    return releases;
  }

  storageKey(): string {
    return "releases";
  }
}
