import { Component, OnInit } from '@angular/core';
import { DataContext } from 'src/app/Services/dataContext.service';

@Component({
  selector: 'teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss']
})
export class TeacherDashboardComponent implements OnInit {

  paymentProcessing: boolean = false;
  IsAccepted: boolean = false;
  Tab: number = 1;
  ActiveProblems: number = 1;
  AcceptedProblems: number = 1;

  constructor(
    private _dataContext: DataContext, ) { }

  ngOnInit() {
    this.getProblemsCounter();
  }

  onTabChange(tab: number) {
    this.Tab = tab;
  }

  cancelPaymentProcessing() {
    this.paymentProcessing = !this.paymentProcessing;
  }

  getProblemsCounter() {
    let model = {}
    this._dataContext.post('ProblemsAndSolutions/CountProblems', model).subscribe((data: any) => {
      this.ActiveProblems = data.totalActiveProblems;
      this.AcceptedProblems = data.totalAcceptedProblems;
    });
  }
}
