import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Team, TeamMember, TeamRole } from '../../models/team.model';
import * as TeamsActions from '../../store/teams.actions';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { UserService } from '../../../profile/services/user.service';

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss']
})
export class TeamMembersComponent implements OnInit {
  @Input() team!: Team;
  @Input() currentUserId!: string;
  @Input() isOwner = false;
  @Input() canManage = false;
  
  addMemberForm!: FormGroup;
  showAddMemberForm = false;
  loading = false;
  error = '';
  success = '';
  
  TeamRole = TeamRole;
  
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private userService: UserService
  ) {}
  
  ngOnInit(): void {
    this.initForm();
  }
  
  private initForm(): void {
    this.addMemberForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: [TeamRole.MEMBER, Validators.required]
    });
  }
  
  toggleAddMemberForm(): void {
    this.showAddMemberForm = !this.showAddMemberForm;
    if (!this.showAddMemberForm) {
      this.addMemberForm.reset({
        role: TeamRole.MEMBER
      });
    }
  }
  
  onAddMember(): void {
    if (this.addMemberForm.invalid) return;
    
    const { email, role } = this.addMemberForm.value;
    
    this.store.dispatch(TeamsActions.addTeamMember({
      teamId: this.team.id,
      member: { email, role }
    }));
    
    this.success = 'Team member invitation sent';
    this.toggleAddMemberForm();
  }
  
  onUpdateMemberRole(memberId: string, role: TeamRole): void {
    this.store.dispatch(TeamsActions.updateTeamMember({
      teamId: this.team.id,
      memberId,
      update: { role }
    }));
  }
  
  onRemoveMember(memberId: string): void {
    if (confirm('Are you sure you want to remove this member from the team?')) {
      this.store.dispatch(TeamsActions.removeTeamMember({
        teamId: this.team.id,
        memberId
      }));
    }
  }
  
  canEditMember(member: TeamMember): boolean {
    if (member.userId === this.currentUserId) return false; // Can't edit yourself
    if (this.isOwner) return true; // Team owner can edit anyone
    if (this.canManage && member.role !== TeamRole.ADMIN && member.role !== TeamRole.OWNER) {
      return true; // Admins can edit regular members
    }
    return false;
  }
  
  canRemoveMember(member: TeamMember): boolean {
    if (member.userId === this.currentUserId) return false; // Can't remove yourself
    if (member.role === TeamRole.OWNER) return false; // Can't remove the owner
    if (this.isOwner) return true; // Team owner can remove anyone else
    if (this.canManage && member.role !== TeamRole.ADMIN) {
      return true; // Admins can remove regular members but not other admins
    }
    return false;
  }
  
  getMemberName(member: TeamMember): string {
    // In a real app, you'd want to fetch user details
    // For now, just show the user ID or 'You' for the current user
    return member.userId === this.currentUserId ? 'You' : `User ${member.userId.substring(0, 8)}...`;
  }
  
  getRoleBadgeClass(role: TeamRole): string {
    switch (role) {
      case TeamRole.OWNER:
        return 'badge-primary';
      case TeamRole.ADMIN:
        return 'badge-success';
      case TeamRole.MEMBER:
        return 'badge-info';
      default:
        return '';
    }
  }
  
  clearSuccess(): void {
    this.success = '';
  }
  
  clearError(): void {
    this.error = '';
  }
}