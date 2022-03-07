import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { interval } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserSession } from 'src/app/Services/userSession.service';

@Component({
  selector: 'website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.scss']
})
export class WebsiteComponent implements OnInit {

  form: FormGroup;
  carouselItem: any = 1;
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
    private fb: FormBuilder,
    private _userSession: UserSession,
    private router: Router,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef, ) {
    interval(5000).subscribe((x => {
      this.carouselItem = this.carouselItem == 3 ? 1 : this.carouselItem + 1;
    }));
    this.mobileQuery = media.matchMedia('(max-width: 992px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.getScreenSize();
  }

  ngOnInit() {
    this.form = this.fb.group({
      problemDescription: ['', [Validators.required]],
    });
  }

  changeNavbar() {
    this.showMenu = !this.showMenu;
  }

  onSubmit() {
    if (this.form.valid) {
      localStorage.setItem('problemDescription', this.form.value.problemDescription);
      this._userSession.UserClaim == null ? this.router.navigate(['/login']) : this.router.navigate(['/studentDashboard']);
    }
  }
}
