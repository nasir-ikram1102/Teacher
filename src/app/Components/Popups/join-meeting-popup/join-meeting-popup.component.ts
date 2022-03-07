import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'join-meeting-popup',
  templateUrl: './join-meeting-popup.component.html',
  styleUrls: ['./join-meeting-popup.component.scss']
})
export class JoinMeetingPopupComponent implements OnInit {

  form: FormGroup;
  meetingNumber = '';
  meetingPassword = '';

  constructor(
    private _dialogRef: MatDialogRef<JoinMeetingPopupComponent>,
    private fb: FormBuilder,
    private router: Router, ) { }

  ngOnInit() {
    this.form = this.fb.group({
      meetingNumber: ['', Validators.required],
      meetingPassword: ['']
    });
  }

  JoinMeeting(role) {
    if (this.form.valid) {
      this.meetingNumber = this.form.get('meetingNumber').value;
      this.meetingPassword = this.form.get('meetingPassword').value;
      localStorage.setItem('meeting', (this.meetingNumber + '&' + this.meetingPassword + '&' + role));
      this.router.navigate(["/meeting"]);
      this.onClose();
    }
  }

  onClose() {
    this._dialogRef.close();
  }
}
