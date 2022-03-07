import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DataContext } from 'src/app/Services/dataContext.service';
import { Router } from '@angular/router';

@Component({
  selector: 'my-questions',
  templateUrl: './my-questions.component.html',
  styleUrls: ['./my-questions.component.scss']
})
export class MyQuestionsComponent implements OnInit {

  displayedColumns = ['date', 'problem', 'acceptedBy', 'action'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _dataContext: DataContext,
    private router: Router,) { }

  ngOnInit() {
    this.getMyProblems();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getMyProblems() {
    let model = {}
    this._dataContext.post('ProblemsAndSolutions/GetMyProblems', model).subscribe((data: any) => {
      this.dataSource.data = data;
    });
  }

  RedirectToProblemDetail(data: any) {
    localStorage.setItem('confirmationNumber', data.confirmationNumber);
    this.router.navigate(['/problemDetail']);
  }
}