import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { default as firebase } from 'firebase/compat/app';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData?: firebase.User;
  user$ = new BehaviorSubject<IUser | null>(null);

  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private router: Router
  ) {
    this.afAuth.authState.subscribe((user) => {
      this.setCurrentUser(user);
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    });
  }

  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user) {
          this.setUserData(result.user);
        }
      })
      .catch((err) => console.error(err));
  }

  signUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user) {
          this.sendVerificationEmail();
          this.setUserData(result.user);
        }
      });
  }

  sendVerificationEmail() {
    return this.afAuth.currentUser.then((current) => {
      if (current) {
        current.sendEmailVerification().then(() => {
          console.log('Verification email has been sent');
        });
      }
    });
  }

  forgotPassword(email: string) {
    return this.afAuth
      .sendPasswordResetEmail(email)
      .then(() => {
        console.log('Password reset email sent, check your inbox.');
      })
      .catch((error) => console.error(error));
  }

  authLogin(provider: firebase.auth.AuthProvider) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        if (result.user) {
          this.setUserData(result.user);
          this.router.navigateByUrl('/');
        }
      })
      .catch((error) => console.error(error));
  }

  googleAuth() {
    return this.authLogin(new firebase.auth.GoogleAuthProvider());
  }

  signOut() {
    return this.afAuth.signOut().then(() => {
      this.user$.next(null);
      this.router.navigateByUrl('/auth');
      localStorage.removeItem('user');
    });
  }

  setUserData(user: firebase.User) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${user.uid}`
    );
    const userData: IUser = {
      id: user.uid as any,
      email: user.email ?? '',
      name: user.displayName ?? '',
    };
    this.user$.next(userData);
    return userRef.set(userData, {
      merge: true,
    });
  }

  setCurrentUser(data: firebase.User | null) {
    if (data) {
      const user: IUser = {
        id: data.uid as any,
        email: data.email ?? '',
        name: data.displayName ?? '',
      };
      this.user$.next(user);
    } else {
      this.user$.next(null);
    }
  }
}
