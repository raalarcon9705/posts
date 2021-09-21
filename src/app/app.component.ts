import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'posts';
  user$ = this.auth.user$;
  showMenu = false;
  constructor(private auth: AuthService) {}

  signOut() {
    this.showMenu = false;
    this.auth.signOut();
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  onCloseMenu(ev: any, el: HTMLElement) {
    if (!el.contains(ev.target)) {
      this.showMenu = false;
    }
  }
}
