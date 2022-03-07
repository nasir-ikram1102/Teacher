import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DataContext } from 'src/app/Services/dataContext.service';
import { NotifierService } from 'angular-notifier';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'student-problems',
  templateUrl: './student-problems.component.html',
  styleUrls: ['./student-problems.component.scss']
})
export class StudentProblemsComponent implements OnInit {

  displayedColumns = ['information', 'problem', 'action'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _dataContext: DataContext,
    private router: Router,
    private notifier: NotifierService,
    private route: ActivatedRoute, ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.problemId && params.ac == 1) {
        this.acceptFromEmail(params.problemId);
      }
    });
    this.getProblems();
  }

  getProblems() {
    let model = {
      IsSent: false
    }
    this._dataContext.post('ProblemsAndSolutions/GetProblems', model).subscribe((data: any) => {
      this.dataSource.data = data;
    });
  }

  accept(row: any) {
    let model = {
      ProblemId: row.problemId
    }
    this._dataContext.post('ProblemsAndSolutions/Accept', model).subscribe((data: any) => {
      if (data[0].successStatus) {
        this.notifier.notify('success', data[0].statusMessage);
        localStorage.setItem('confirmationNumber', row.confirmationNumber);
        this.router.navigate(['/reviewQuestion']);
      }
      else {
        this.notifier.notify('error', 'Problem Occured While Process Your Request. Please Try Again Later.');
      }
    });
  }

  acceptFromEmail(problemId: number) {
    let model = {
      ProblemId: problemId
    }
    this._dataContext.post('ProblemsAndSolutions/Accept', model).subscribe((data: any) => {
      if (data[0].successStatus) {
        this.notifier.notify('success', data[0].statusMessage)
        this.getProblems();
      }
      else {
        this.notifier.notify('error', 'Problem Occured While Process Your Request. Please Try Again Later.')
      }
    });
  }

  locked(row: any) {
    localStorage.setItem('confirmationNumber', row.confirmationNumber);
    this.router.navigate(['/reviewQuestion']);
  }
}