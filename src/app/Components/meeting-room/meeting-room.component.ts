import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { ZoomMtg } from '@zoomus/websdk';
import { environment } from '../../../environments/environment';
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'meeting-room',
  templateUrl: './meeting-room.component.html',
  styleUrls: ['./meeting-room.component.scss']
})
export class MeetingRoomComponent implements OnInit {

  private credentials = {
    apiKey: environment.zoomSdkKey,
    apiSecret: environment.zoomSdkSecret,
    meetingNumber: '',
    role: '',
    leaveUrl: environment.zoomMeetingLeaveUrl,
    userName: '',//'Angular',
    userEmail: '',//'nikram1993@gmail.com',
    meetingPassword: ''
  };

  constructor(
    public httpClient: HttpClient,
    @Inject(DOCUMENT) document) {
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
    var meetingDetails = localStorage.getItem('meeting');
    var claims = jwt_decode(localStorage.getItem('userToken'));
    //this.credentials.userEmail = claims.Email;
    //this.credentials.userName = claims.Name;
    this.credentials.meetingNumber = meetingDetails.split('&')[0];
    this.credentials.meetingPassword = meetingDetails.split('&')[1];
    this.credentials.role = meetingDetails.split('&')[2];
    this.getSignature();
  }

  ngOnInit() {
  }

  getSignature() {
    var signature = ZoomMtg.generateSignature({
      meetingNumber: this.credentials.meetingNumber,
      apiKey: this.credentials.apiKey,
      apiSecret: this.credentials.apiSecret,
      role: this.credentials.role,
      success: function (res) {
      }
    });
    this.startMeeting(signature);
  }

  startMeeting(signature) {
    document.getElementById('zmmtg-root').style.display = 'block'
    ZoomMtg.init({
      leaveUrl: this.credentials.leaveUrl,
      isSupportAV: true,
      success: (success) => {
        ZoomMtg.join({
          signature: signature,
          meetingNumber: this.credentials.meetingNumber,
          userName: this.credentials.userName,
          apiKey: this.credentials.apiKey,
          userEmail: this.credentials.userEmail,
          passWord: this.credentials.meetingPassword,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}