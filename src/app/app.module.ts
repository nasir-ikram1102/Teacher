import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//import { AppMaterialModule } from './App-Material/app-material';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routing } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { MatSidenavModule } from '@angular/material/sidenav';
import { CdkTableModule } from '@angular/cdk/table';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { ChartsModule } from 'ng2-charts';
import { BlockUIModule } from 'ng-block-ui';
import { TagInputModule } from 'ngx-chips';
import { NgxPrintModule } from 'ngx-print';
import { NgxPaginationModule } from 'ngx-pagination';
import { createCustomElement } from '@angular/elements';
import { MeetingService } from './Services/meeting.service'
import { environment } from '../environments/environment';

import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDialogRef
} from '@angular/material';
import { NgaReadMoreModule } from 'nga-read-more';
import { DragDropModule } from '@angular/cdk/drag-drop';
//Routing Authentication
import { AuthGuard } from './Authentication/auth.guard';

//For Client Side Error Logging 
import { AuthInterceptor } from './Authentication/auth.interceptor';

// Dashboard Component

// Login Component
import { LoginComponent } from './Components/User/Login/login.component';

//Services
import { UserService } from './Service/user.service';
import { DataContext } from './Services/dataContext.service';
import { UserSession } from './Services/userSession.service';
import { ErrorHandlerService } from './Services/error-handler/error-handler.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommunicationService } from './Services/communication.service';

import {
    SocialLoginModule,
    AuthServiceConfig,
    GoogleLoginProvider,
} from "angular-6-social-login";
import { NgSelectModule } from '@ng-select/ng-select';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { UsersService } from './Services/users.service';
import { SelectCheckAllComponent } from './Elements/MultiSelect/multi-select.component';
import { SiteLayoutComponent } from './Components/_layout/site-layout/site-layout.component';
import { AppLayoutComponent } from './Components/_layout/app-layout/app-layout.component';
import { DatePipe } from '../../node_modules/@angular/common';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TopNavComponent } from './Components/TopNav/top-nav.component';
import { StudentDashboardComponent } from './Components/student-dashboard/student-dashboard.component';
import { RegistrationComponent } from './Components/User/Registration/registration.component';
import { TeacherDashboardComponent } from './Components/teacher-dashboard/teacher-dashboard.component';
import { MyQuestionsComponent } from './Components/student-dashboard/my-questions/my-questions.component';
import { ProblemDetailComponent } from './Components/student-dashboard/problem-detail/problem-detail.component';
import { AboutTodComponent } from './Components/User/About-TOD/about-tod.component';
import { StudentProblemsComponent } from './Components/teacher-dashboard/student-problems/student-problems.component';
import { StudentProblemsWithSolutionsComponent } from './Components/teacher-dashboard/student-problems-with-solutions/student-problems-with-solutions.component';
import { ReviewQuestionComponent } from './Components/teacher-dashboard/review-question/review-question.component';
import { MeetingRoomComponent } from './Components/meeting-room/meeting-room.component';
import { JoinMeetingPopupComponent } from './Components/Popups/join-meeting-popup/join-meeting-popup.component';
import { AttachmentPopupComponent } from './Components/Popups/attachment-popup/attachment-popup.component';
import { WebsiteComponent } from './Components/Website/website.component';
import { TeachersSiteComponent } from './Components/Website/Teachers-Site/teachers-site.component';

export function getAuthServiceConfigs() {
    let config = new AuthServiceConfig(
        [
            {
                id: GoogleLoginProvider.PROVIDER_ID,
                provider: new GoogleLoginProvider("1089399494578-akukt8c08bjsj9eo4l0hgevmpiop35de.apps.googleusercontent.com")
            }
        ]
    );
    return config;
}

const customNotifierOptions: NotifierOptions = {
    position: {
        horizontal: {
            position: 'middle',
            distance: 12
        },
        vertical: {
            position: 'top',
            distance: 70,
            gap: 10
        }
    },
    theme: 'material',
    behaviour: {
        autoHide: 5000,
        onClick: 'hide',
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 4
    },
    animations: {
        enabled: true,
        show: {
            preset: 'slide',
            speed: 300,
            easing: 'ease'
        },
        hide: {
            preset: 'fade',
            speed: 300,
            easing: 'ease',
            offset: 50
        },
        shift: {
            speed: 300,
            easing: 'ease'
        },
        overlap: 150
    }
};

@NgModule({
    imports: [
        UiSwitchModule.forRoot({
            size: 'small',
            color: 'rgba(128,128,128,1)',
            switchColor: '#3bb2fa',
            defaultBgColor: '#3bb2fa',
            //defaultBoColor: '#3ab7a9',
            checkedLabel: 'Yes',
            uncheckedLabel: 'No'
        }),
        NgxPrintModule,
        TagInputModule,
        NgxDatatableModule,
        ChartsModule,
        BrowserModule, ReactiveFormsModule, MatSidenavModule, CdkTableModule, HttpModule, routing, FormsModule,
        Ng2Bs3ModalModule, BrowserAnimationsModule, HttpClientModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatStepperModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        SocialLoginModule,
        MatTooltipModule,
        BlockUIModule.forRoot(),
        NotifierModule.withConfig(customNotifierOptions),
        NgSelectModule,
        SatDatepickerModule,
        SatNativeDateModule,
        NgxPaginationModule,
        DragDropModule,
        NgbModule.forRoot(),
        NgbModalModule,
        NgaReadMoreModule
    ],
    declarations: [
        SiteLayoutComponent,
        AppLayoutComponent,
        AppComponent,
        LoginComponent,
        SelectCheckAllComponent,
        TopNavComponent,
        StudentDashboardComponent,
        RegistrationComponent,
        TeacherDashboardComponent,
        MyQuestionsComponent,
        ProblemDetailComponent,
        AboutTodComponent,
        StudentProblemsComponent,
        StudentProblemsWithSolutionsComponent,
        ReviewQuestionComponent,
        MeetingRoomComponent,
        JoinMeetingPopupComponent,
        AttachmentPopupComponent,
        WebsiteComponent,
        TeachersSiteComponent,
    ],
    entryComponents: [
        JoinMeetingPopupComponent,
        AttachmentPopupComponent,
    ],
    providers: [
        DatePipe,
        UserService,
        AuthGuard,
        DataContext,
        UserSession,
        ErrorHandlerService,
        CommunicationService,
        UsersService,
        MeetingService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        { provide: MatDialogRef, useValue: {} },
        {
            //For Google Account
            provide: AuthServiceConfig,
            useFactory: getAuthServiceConfigs
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {

}