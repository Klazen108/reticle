import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent implements OnInit {

  projectJson: string;

  constructor(
    public dialogRef: MatDialogRef<ImportDialogComponent>) {}

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
