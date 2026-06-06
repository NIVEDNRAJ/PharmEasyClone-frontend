import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// 1. Notice the paths end in '/header' and '/footer', NOT '/header.component'
import { HeaderComponent } from './shared/components/header/header';
import { FooterComponent } from './shared/components/footer/footer';
import {AuthDrawerComponent} from './shared/components/auth-drawer/auth-drawer';

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. The components MUST be in this array for the HTML to recognize the tags
  imports: [RouterOutlet, HeaderComponent, FooterComponent,AuthDrawerComponent],
  templateUrl: './app.html'
})
export class App {
  title = 'pharm-easy-clone-ui';
}