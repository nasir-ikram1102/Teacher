import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DataContext } from 'src/app/Services/dataContext.service';
import { Router } from '@angular/router';

@Component({
  selector: 'student-problems-with-solutions',
  templateUrl: './student-problems-with-solutions.component.html',
  styleUrls: ['./student-problems-with-solutions.component.scss']
})
export class StudentProblemsWithSolutionsComponent implements OnInit {

  displayedColumns = ['information', 'problem', 'action'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _dataContext: DataContext,
    private router: Router, ) { }

  ngOnInit() {
    this.getAcceptedProblems();
  }

  getAcceptedProblems() {
    let model = {
      IsSent: true
    }
    this._dataContext.post('ProblemsAndSolutions/GetAcceptedProblems', model).subscribe((data: any) => {
      this.dataSource.data = data;
    });
  }

  RedirectToProblemDetail(data: any) {
    localStorage.setItem('confirmationNumber', data.confirmationNumber);
    this.router.navigate(['/problemDetail']);
  }
}