import { Component, OnInit, Input } from '@angular/core';
import { ReleaseComponent } from '../release-component.model';

@Component({
  selector: 'app-release-component',
  templateUrl: './release-component.component.html',
  styleUrls: ['./release-component.component.scss']
})
export class ReleaseComponentComponent implements OnInit {
  @Input() component: ReleaseComponent;

  constructor() { }

  ngOnInit() {
  }

}
