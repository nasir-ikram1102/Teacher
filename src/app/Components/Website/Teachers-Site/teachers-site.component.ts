import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'teachers-site',
  templateUrl: './teachers-site.component.html',
  styleUrls: ['./teachers-site.component.scss']
})
export class TeachersSiteComponent implements OnInit {

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
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef, ) {
    this.mobileQuery = media.matchMedia('(max-width: 992px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.getScreenSize();
  }

  ngOnInit() {
  }

  changeNavbar() {
    this.showMenu = !this.showMenu;
  }
}
