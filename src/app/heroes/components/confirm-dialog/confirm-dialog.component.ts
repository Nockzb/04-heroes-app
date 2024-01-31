import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styles: [
  ]
})
export class ConfirmDialogComponent {
  
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    public heroesService: HeroesService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Hero
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

}