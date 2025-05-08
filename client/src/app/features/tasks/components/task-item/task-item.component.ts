import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() statusChange = new EventEmitter<{ taskId: string; status: TaskStatus }>();
  @Output() deleteTask = new EventEmitter<string>();

  TaskStatus = TaskStatus;
  showActions = false;

  toggleActions(): void {
    this.showActions = !this.showActions;
  }

  moveToTodo(): void {
    this.statusChange.emit({ taskId: this.task.id, status: TaskStatus.TODO });
  }

  moveToInProgress(): void {
    this.statusChange.emit({ taskId: this.task.id, status: TaskStatus.IN_PROGRESS });
  }

  moveToDone(): void {
    this.statusChange.emit({ taskId: this.task.id, status: TaskStatus.DONE });
  }

  onDelete(): void {
    this.deleteTask.emit(this.task.id);
  }

  getPriorityClass(): string {
    switch (this.task.priority) {
      case TaskPriority.HIGH:
        return 'priority-high';
      case TaskPriority.MEDIUM:
        return 'priority-medium';
      case TaskPriority.LOW:
        return 'priority-low';
      default:
        return '';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}