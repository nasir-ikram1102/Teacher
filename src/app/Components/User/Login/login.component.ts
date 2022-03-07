import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../Service/user.service';
import { UserSession } from '../../../Services/userSession.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { environment } from '../../../../environments/environment';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {

    JobId = 0;
    loginForm: FormGroup;
    email: any;
    UserClaim: any;
    action = 0; //For View Question i.e 1 And View Answer i.e 2 
    problemId = 0;

    constructor(
        private fb: FormBuilder,
        private _userService: UserService,
        private router: Router,
        private notifier: NotifierService,
        private _userSession: UserSession,
        private activatedRoute: ActivatedRoute, ) {
    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params['email']) {
                let model = {
                    Email: params.email,
                    password: params.pa,
                    action: params.ac ? params.ac : 0,
                    problemId: params.problem ? params.problem : 0
                }
                this._userService.upprotectData('auth/unprotectdata', model).subscribe((unprotectedData: any) => {
                    if (params.pa && params.email) {
                        localStorage.removeItem('userToken');
                        localStorage.removeItem('userClaims');
                        if (params.problem > 0) {
                            this.action = params.ac;
                            this.problemId = params.problem;
                        }
                        let model = {
                            email: unprotectedData.email,
                            password: unprotectedData.password
                        }
                        this.loginForm.setValue(model);
                        this.onSubmit(this.loginForm);
                    }
                },
                    error => this.notifier.notify('error', 'Link is not valid.'));
            }
        });
    }

    changeLang(lang: string) {
        if (lang === 'es') {
            localStorage.setItem('locale', 'es');
            location.reload();
        }
        if (lang === 'en') {
            localStorage.setItem('locale', 'en');
            location.reload();
        }
    }

    onSubmit(formData: any) {
        if (this.loginForm.valid) {
            this._userService.userAuthentication(environment.apiUrl, formData.value).subscribe((data: any) => {
                localStorage.setItem('userToken', data.token);
                this.GetUserClaims(data);
            },
                (err: HttpErrorResponse) => {
                    if (err.error == 'Invalid') {
                        this.notifier.notify('error', "Invalid email or password.");
                        return;
                    }
                });
        }
    }

    GetUserClaims(data: any): void {
        localStorage.setItem('userClaims', JSON.stringify(data));
        this.UserClaim = JSON.parse(localStorage.getItem('userClaims'));
        this._userSession.SetUserSession();

        if (this._userSession.getUserRoleId() == 1) { // For Teacher
            if (this.activatedRoute.queryParams && this.problemId > 0) {
                if (this.action == 1) {
                    this.Accept(this.problemId);
                }
                else {
                    this.router.navigate(['/teacherDashboard']).then(() => {
                    });
                }
            }
            else {
                this.router.navigate(['/teacherDashboard']).then(() => {
                });
            }
        }
        else if (this._userSession.getUserRoleId() == 2) { //For Students
            this.router.navigate(['/studentDashboard']).then(() => {
            });
        }
    }

    Accept(ProblemId: number) {
        this.router.navigate(['/teacherDashboard'], { queryParams: { problemId: ProblemId, ac: this.action } });
    }
}