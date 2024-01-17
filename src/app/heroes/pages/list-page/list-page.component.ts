import { Component, Input, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: [
  ]
})
export class ListPageComponent implements OnInit {
  @Input()
  public listaHeroes: Hero[] = [];

  constructor(private servicioHeroes: HeroesService) { }

  ngOnInit(): void {   
    this.servicioHeroes.getHeroes().subscribe((heroes: Hero[]) => {this.listaHeroes = heroes;});
  }
}
