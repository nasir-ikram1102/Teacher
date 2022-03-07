import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserSession } from 'src/app/Services/userSession.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { MeetingService } from '../../Services/meeting.service';
import { HttpErrorResponse } from '@angular/common/http';
import { JoinMeetingPopupComponent } from '../Popups/join-meeting-popup/join-meeting-popup.component';
import { MatDialog } from '@angular/material';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

  UserRoleId: number = this._userSession.getUserRoleId();
  modalRef: NgbModalRef;
  meetingNumber = '';
  meetingPassword = '';
  code = '';
  isMobileResolution: boolean = false;
  showMenu: boolean = false;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    if (this.mobileQuery.matches) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }

  constructor(
    private router: Router,
    private _userSession: UserSession,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private meetingService: MeetingService,
    public dialog: MatDialog,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef, ) {

    this.mobileQuery = media.matchMedia('(max-width: 700px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.getScreenSize();

    this.route.queryParams.subscribe(params => {
      this.code = params['code'];
      var isZoomRedirect = localStorage.getItem('isZoomRedirect');
      if (this.code && isZoomRedirect) {
        localStorage.removeItem('isZoomRedirect');
        this.meetingService.authenticate({ code: this.code, redirectUri: environment.zoomApiRedirectUri }).subscribe((data: any) => {
          localStorage.setItem('zoomToken', data.access_token);
          this.CreateMeeting();
        },
          (err: HttpErrorResponse) => {
            console.log(err);
          }
        );
      }
    });
  }

  ngOnInit() {
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  CreateMeeting() {
    var zoomToken = localStorage.getItem('zoomToken');
    if (zoomToken) {
      this.meetingService.createMeeting({
        agenda: "sample",
        type: "1",
        topic: "sample"
      }, zoomToken).subscribe((data: any) => {
        this.meetingNumber = data.id;
        this.meetingPassword = data.password;
        this.JoinMeeting(1);
      },
        (err: HttpErrorResponse) => {
          console.log(err);
        });
    }
  }

  Logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userClaims');
    this.router.navigate(['/login']);
    this._userSession.nullUserSession();
  }

  FindQuestions() {
    this.router.navigate(['/teacherDashboard']);
  }

  MyQuestions() {
    this.router.navigate(['/myQuestions']);
  }

  GotoDashboard() {
    if (this._userSession.getUserRoleId() == 1) {
      this.router.navigate(['/teacherDashboard']);
    }
    else if (this._userSession.getUserRoleId() == 2) {
      this.router.navigate(['/studentDashboard']);
    }
    else {
      this.router.navigate(['/login']);
    }
  }

  LoginZoom() {
    // var zoomToken = localStorage.getItem('zoomToken');
    // if(zoomToken) {
    //   this.meetingService.createMeeting({
    //     agenda: "sample",
    //     type: "1",
    //     topic: "sample"
    //   }, zoomToken).subscribe((data: any) => {
    //     this.meetingNumber = data.id;
    //     this.meetingPassword = data.password;
    //     this.JoinMeeting(1);      
    //   },
    //   (err: HttpErrorResponse) => {
    //     console.log(err);
    //   });
    // }
    // else {
    localStorage.setItem('isZoomRedirect', 'true');
    window.location.href = environment.zoomApiAuthorizationUrl
      .replace('{CLIENT_ID}', environment.zoomApiClientId)
      .replace('{REDIRECT_URI}', environment.zoomApiRedirectUri)
    //}
  }

  JoinMeeting(role) {
    localStorage.setItem('meeting', (this.meetingNumber + '&' + this.meetingPassword + '&' + role));
    if (this.modalRef)
      this.modalRef.close();
    this.router.navigate(["/meeting"]);
  }

  openJoinMeetingPopup() {
    this.dialog.open(JoinMeetingPopupComponent, {
      panelClass: 'join-meeting-popup',
      position: { top: '80px' }
    });
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
