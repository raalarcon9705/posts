import {
  APP_INITIALIZER,
  NgModule,
  Optional,
  Provider,
  SkipSelf,
} from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '@environments';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AuthService } from '../services/auth.service';
import { skip } from 'rxjs/operators';
import { CacheInterceptor } from './interceptors/cache.interceptor';

const appInitializerFactory = (auth: AuthService) => () =>
  new Promise<void>((resolve) => {
    auth.user$.pipe(skip(1)).subscribe(() => resolve());
  });

const APP_INITIALIZER_PROVIDERS: Provider[] = [
  {
    provide: APP_INITIALIZER,
    useFactory: appInitializerFactory,
    deps: [AuthService],
    multi: true,
  },
];

const HTTP_INTERCEPTORS_PROVIDERS: Provider[] = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: CacheInterceptor,
    multi: true,
  },
];

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  exports: [HttpClientModule],
  providers: [...APP_INITIALIZER_PROVIDERS, ...HTTP_INTERCEPTORS_PROVIDERS],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'Core Module is already loaded. Import only in AppModule'
      );
    }
  }
}
