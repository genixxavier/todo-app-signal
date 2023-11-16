import {
  Component,
  computed,
  effect,
  signal,
  inject,
  Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITask } from 'src/app/models/task.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  tasks = signal<ITask[]>([]);
  title = '';

  filter = signal<'all' | 'pending' | 'completed'>('all');
  tasksByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();

    if (filter === 'pending') {
      return tasks.filter((task) => !task.completed);
    }

    if (filter === 'completed') {
      return tasks.filter((task) => task.completed);
    }

    return tasks;
  });

  injector = inject(Injector);

  constructor() {
    const storage = localStorage.getItem('tasks');
    if (storage) {
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
    this.trackTask();
  }

  trackTask() {
    effect(() => {
      const tasks = this.tasks();
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }),
      { injector: this.injector };
  }

  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    this.addTask(input.value);
  }

  addTask(title: string) {
    const newTask = {
      id: Date.now(),
      title: title,
      completed: false,
    };

    this.tasks.update((tasks) => [...tasks, newTask]);
    this.title = '';
  }

  deleteTask(index: number) {
    this.tasks.update((tasks) => tasks.filter((task, i) => i != index));
  }

  changeStatusTask(index: number) {
    this.tasks.update((tasks) =>
      tasks.map((task, i) => {
        if (i === index) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      })
    );
  }

  updateTaskMode(index: number) {
    if (this.tasks()[index].completed) return;

    this.tasks.update((tasks) =>
      tasks.map((task, i) => {
        if (i === index) {
          return {
            ...task,
            editing: true,
          };
        }
        return {
          ...task,
          editing: false,
        };
      })
    );
  }

  updateTaskText(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update((tasks) =>
      tasks.map((task, i) => {
        if (i === index) {
          return {
            ...task,
            title: input.value,
            editing: false,
          };
        }
        return task;
      })
    );
  }

  changeFilter(filter: 'all' | 'pending' | 'completed') {
    this.filter.set(filter);
  }
}
