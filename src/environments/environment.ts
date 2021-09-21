// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apis: {
    api: 'https://jsonplaceholder.typicode.com',
  },
  firebaseConfig: {
    apiKey: 'AIzaSyAjk0dHuqrMraRaBcNrffwTowr61FUEEaU',
    authDomain: 'posts-df862.firebaseapp.com',
    projectId: 'posts-df862',
    storageBucket: 'posts-df862.appspot.com',
    messagingSenderId: '387517074600',
    appId: '1:387517074600:web:d751fd05559ad87798069d',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
