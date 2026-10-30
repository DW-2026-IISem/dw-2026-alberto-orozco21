import { Component } from '@angular/core';

@Component({
  host: { class: 'block' },
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly title = 'EnlaceExpress';
}