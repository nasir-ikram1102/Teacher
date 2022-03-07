import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { UserService } from 'src/app/Service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  regForm: FormGroup;
  Subjects: any;
  GradeLevels: any;

  constructor(
    private fb: FormBuilder,
    private notifier: NotifierService,
    private _userService: UserService,
    private router: Router, ) { }

  ngOnInit() {
    this.regForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]],
      subject: [[], Validators.required],
      gradeLevel: [[], Validators.required],
    });
    this.GetSubjects();
    this.GetGradeLevels();
  }

  GetSubjects() {
    this._userService.getSubjectAndGrade("auth/GetSubjects").subscribe((data: any) => {
      this.Subjects = data;
    });
  }

  GetGradeLevels() {
    this._userService.getSubjectAndGrade("auth/GetGradeLevel").subscribe((data: any) => {
      this.GradeLevels = data;
    });
  }

  onSubmit(form: any) {
    if (this.regForm.valid) {
      let model = {
        FirstName: form.value.firstName,
        LastName: form.value.lastName,
        Address: form.value.address,
        Email: form.value.email,
        PhoneNumber: form.value.phoneNumber,
        UserRoleId: 1,
        Subjects: form.value.subject,
        GradeLevels: form.value.gradeLevel,
      }
      this._userService.insertUser('auth/insertUser', model).subscribe((data: any) => {
        if (data.successStatus) {
          this.notifier.notify('success', data.statusMessage);
          this.regForm.reset();
          this.router.navigate(['/login']);
        }
        else if (!data.successStatus) {
          this.notifier.notify('error', data.statusMessage);
        }
        else {
          this.notifier.notify('error', 'Problem Occured While Process your Request. Please Try Again Later.')
        }
      });
    }
  }
}