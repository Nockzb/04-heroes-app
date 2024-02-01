import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [],
})
export class NewPageComponent implements OnInit {
  //public hero?: Hero;

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  constructor(
    private heroesService: HeroesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.heroesService.getHeroesById(id)) // Desesctructuramos params para obtener el 'id'
      )
      .subscribe((hero) => {
        if (!hero) return this.router.navigate(['/heroes/list']);
        // Se rellena el formulario con los datos del heroe a editar
        this.heroForm.reset(hero);
        return;
      });
  }

  public get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  onSubmit(): void {
    if (this.heroForm.invalid) return;

    // Si tenemos un id, es actualizacion
    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero).subscribe((hero) => {
        this.showSnackbar(`${hero.superhero} actualizado correctamente.`);
      });
      return;
    }

    // Si no hay id, se añade uno nuevo
    this.heroesService.addHero(this.currentHero).subscribe((hero) => {
      this.showSnackbar(`${hero.superhero} creado correctamente.`);
    });
  }

  // Toast
  private showSnackbar(msj: string): void {
    this.snackBar.open(msj, 'OK', {
      duration: 5000,
    });
  }

  public onDeleteHero() {
    if (!this.currentHero.id) {
      throw Error('Hero id is required');
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) { // si confirma
        this.heroesService.deleteHeroById(this.currentHero.id).subscribe(
          () => {
            // Intentar navegar solo si la eliminación fue exitosa
            this.router.navigate(['heroes/list']);
            this.showSnackbar(`${this.currentHero.superhero} eliminado correctamente.`);
          },
          (error) => {
            // Verificar el tipo de error (404 Not Found)
            if (error.status === 404) {
              this.showSnackbar(`Error: El héroe no existe.`);
            } else {
              this.showSnackbar(`Error al eliminar el héroe.`);
            }
          }
        );
      } else if (result === false) {
        this.showSnackbar(`Error al eliminar el héroe.`);
      } else {
        this.showSnackbar(`NO se ha eliminado el héroe.`);
      }
    });
  }


  // public onDeleteHero() {
  //   if (!this.currentHero.id) {
  //     throw Error('Hero id is required');
  //   }

  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     data: this.heroForm.value,
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {

  //     if (result === true) {
  //       // si confirma
  //       this.heroesService.deleteHeroById(this.currentHero.id).subscribe(
  //         () => {
  //           // Intentar navegar solo si la eliminación fue exitosa
  //           this.router.navigate(['heroes/list']);
  //           this.showSnackbar(
  //             `${this.currentHero.superhero} eliminado correctamente.`
  //           );
  //         },
  //         (error) => {
  //           // Verificar el tipo de error (404 Not Found)
  //           if (error.status === 404) {
  //             this.showSnackbar(`Error: El héroe no existe.`);
  //           } else {
  //             this.showSnackbar(`Error al eliminar el héroe.`);
  //           }
  //         }
  //       );
  //     } else if (result === false || result === undefined) {
  //       this.showSnackbar(`NO se ha eliminado el héroe.`);
  //     }
  //   });
  // }
}
