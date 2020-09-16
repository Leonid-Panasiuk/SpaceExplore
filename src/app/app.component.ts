import { Component } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ]
})

export class AppComponent {
  title = 'SpaceExplore';

  isMenuOpen = false;


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  showView = {
    previous: false,
    current: false,
    next: false
  }
}
