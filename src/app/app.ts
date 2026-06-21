import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GradeManagement } from "./features/academic/pages/admin/grade-management/grade-management";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GradeManagement],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('LMS-Frontend');
}
