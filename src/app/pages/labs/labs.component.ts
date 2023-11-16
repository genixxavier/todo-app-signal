import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.scss'],
})
export class LabsComponent {
  welcome = 'Welcome to Angular 17';
  tasks = signal(['Angular CLI', 'Php with laravel', 'Spring boot 3']);
  valueInput = '';
  name = signal('Gnx');

  changeTextInput(event: Event) {
    const elementInput = event.target as HTMLInputElement;
    this.valueInput = elementInput.value;
  }

  changeTextKeyboard(event: KeyboardEvent) {
    const elementInput = event.target as HTMLInputElement;
    this.valueInput = elementInput.value;
  }

  changeSignal(event: Event) {
    const element = event.target as HTMLInputElement;
    this.name.set(element.value);
  }
}
