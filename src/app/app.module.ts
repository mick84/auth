import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    // FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    //!imported lazily from app-routing.module!
    // RecipesModule
    //ShoppingModule,
    //AuthModule,
    SharedModule,
    // CoreModule will give providers, so we can omit providers array!
    CoreModule,
  ],
  /*
  providers: [
    ShoppingListService,
    RecipeService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  */
  bootstrap: [AppComponent],
})
export class AppModule {}
