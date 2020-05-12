import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor() {
    var firebaseConfig = {
      apiKey: 'AIzaSyD3gTYkI301nmZQUd6HdxVdQCCKrDbtZ9o',
      authDomain: 'my-library-5aa8a.firebaseapp.com',
      databaseURL: 'https://my-library-5aa8a.firebaseio.com',
      projectId: 'my-library-5aa8a',
      storageBucket: 'my-library-5aa8a.appspot.com',
      messagingSenderId: '968336091051',
      appId: '1:968336091051:web:9bff5c8585b3328fd814ee',
      measurementId: 'G-82ECVLRCG1',
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
  }
}
