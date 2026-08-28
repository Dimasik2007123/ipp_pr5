import { Component } from '@angular/core';
import { ContactListComponent } from './contactlist/contact-list/contact-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ContactListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
