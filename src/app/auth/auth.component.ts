import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { User } from './user.model';
import { Router } from '@angular/router';
//!3 next imports are fore dynamic rendering!
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import { Subscription } from 'rxjs';
//!----------------------
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnDestroy {
  //! 3 next lines are for dynamic rendering!
  //@ViewChild(PlaceholderDirective, { static: false })
  //alertHost: PlaceholderDirective;
  subscription: Subscription;
  //!-------------------------------
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router /*!for dynamic rendering : private componentFactoryResolver: ComponentFactoryResolver*/
  ) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  resetError() {
    this.error = '';
  }
  onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    this.authService[this.isLoginMode ? 'login' : 'signup'](
      form.value
    ).subscribe({
      next: (value: AuthResponseData) => {
        console.log(value);
        this.isLoading = false;
        this.router.navigate(['/recipes'], {});
      },
      //! here will be thrown error from authService
      error: (errorRes) => {
        console.error(errorRes);
        this.isLoading = false;
        this.error = errorRes;
        //!for dynamic rendering
        //this.showErrorAlert(errorRes);
      },
    });

    form.reset();
  }
  /*
  //! for dynamic rendering
  private showErrorAlert(message: string) {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(componentFactory);
    componentRef.instance.message = message;
    this.subscription = componentRef.instance.close.subscribe(() => {
      this.subscription.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
  */
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
