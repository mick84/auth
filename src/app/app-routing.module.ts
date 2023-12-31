import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  // next line is added here for lazy loading
  {
    path: 'recipes',
    loadChildren: () =>
      import('./recipes/recipes.module').then((res) => res.RecipesModule),
  },
  {
    path: 'shopping-list',
    loadChildren: () =>
      import('./shopping-list/shopping.module').then(
        (result) => result.ShoppingModule
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((res) => res.AuthModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
