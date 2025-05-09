import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Team } from '../../models/team.model';
import * as TeamsActions from '../../store/teams.actions';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss']
})
export class TeamFormComponent implements OnInit {
  @Input() team: Team | null = null;
  @Output() formClosed = new EventEmitter<void>();
  
  teamForm!: FormGroup;
  loading = false;
  error = '';
  
  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}
  
  ngOnInit(): void {
    this.initForm();
  }
  
  private initForm(): void {
    this.teamForm = this.fb.group({
      name: [this.team?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [this.team?.description || '']
    });
  }
  
  onSubmit(): void {
    if (this.teamForm.invalid) {
      return;
    }
    
    if (this.team) {
      // Update existing team
      this.store.dispatch(TeamsActions.updateTeam({
        id: this.team.id,
        team: this.teamForm.value
      }));
    } else {
      // Create new team
      this.store.dispatch(TeamsActions.createTeam({
        team: this.teamForm.value
      }));
    }
    
    this.formClosed.emit();
  }
  
  cancel(): void {
    this.formClosed.emit();
  }
}