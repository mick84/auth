import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  loadedFeature = 'recipe';
  constructor(private authService: AuthService) {
    this.authService.autoLogin();
  }
  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
}
