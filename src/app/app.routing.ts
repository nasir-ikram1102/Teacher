import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Components/User/Login/login.component';

//Routing Authentication
import { AuthGuard } from './Authentication/auth.guard';
import { SiteLayoutComponent } from './Components/_layout/site-layout/site-layout.component';
import { AppLayoutComponent } from './Components/_layout/app-layout/app-layout.component';
import { RegistrationComponent } from './Components/User/Registration/registration.component';
import { StudentDashboardComponent } from './Components/student-dashboard/student-dashboard.component';
import { TeacherDashboardComponent } from './Components/teacher-dashboard/teacher-dashboard.component';
import { MyQuestionsComponent } from './Components/student-dashboard/my-questions/my-questions.component';
import { ProblemDetailComponent } from './Components/student-dashboard/problem-detail/problem-detail.component';
import { ReviewQuestionComponent } from './Components/teacher-dashboard/review-question/review-question.component';
import { MeetingRoomComponent } from './Components/meeting-room/meeting-room.component';
import { WebsiteComponent } from './Components/Website/website.component';
import { TeachersSiteComponent } from './Components/Website/Teachers-Site/teachers-site.component';
import { UserRoleType } from './Shared/enum';

const appRoutes: Routes = [
    {
        path: '',
        component: SiteLayoutComponent,
        children: [
            { path: '', component: WebsiteComponent },
            { path: 'teachers', component: TeachersSiteComponent },
            { path: 'login', component: LoginComponent },
            { path: 'signUp', component: RegistrationComponent },
        ]
    },
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            {
                path: 'studentDashboard', component: StudentDashboardComponent, canActivate: [AuthGuard],
                data: {
                    path: '/studentDashboard',
                    title: 'StudentDashboard',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.Student] }
                }
            },
            {
                path: 'teacherDashboard', component: TeacherDashboardComponent, canActivate: [AuthGuard],
                data: {
                    path: '/teacherDashboard',
                    title: 'TeacherDashboard',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.Teacher] }
                }
            },
            {
                path: 'myQuestions', component: MyQuestionsComponent, canActivate: [AuthGuard],
                data: {
                    path: '/myQuestions',
                    title: 'MyQuestions',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.Student] }
                }
            },
            {
                path: 'problemDetail', component: ProblemDetailComponent, canActivate: [AuthGuard],
                data: {
                    path: '/problemDetail',
                    title: 'ProblemDetail',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.Student, UserRoleType.Teacher] }
                }
            },
            {
                path: 'reviewQuestion', component: ReviewQuestionComponent, canActivate: [AuthGuard],
                data: {
                    path: '/reviewQuestion',
                    title: 'ReviewQuestion',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle',
                    permission: { roles: [UserRoleType.Teacher] }
                }
            },            {
                path: 'meeting', component: MeetingRoomComponent, canActivate: [AuthGuard],
                data: {
                    path: '/meeting',
                    title: 'Meeting',
                    type: 'main',
                    icontype: 'apps',
                    collapse: 'components',
                    ab: 'account_circle'
                }
            },
        ]
    }];
export const routing: ModuleWithProviders =
    RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' });