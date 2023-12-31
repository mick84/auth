import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  isAuthenticated: boolean = false;
  title: string = environment.title;
  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe({
      next: (user) => {
        this.isAuthenticated = !!user;
      },
    });
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }
  onLogout() {
    this.authService.logout();
  }
}
