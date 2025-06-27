import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InsuranceComponent } from './insurance/insurance.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ InsuranceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'my-app';
}
