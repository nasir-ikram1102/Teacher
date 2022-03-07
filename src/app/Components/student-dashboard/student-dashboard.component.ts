import { Component, OnInit } from '@angular/core';
import { MatStepper, MatDialog } from '@angular/material';
import { DataContext } from 'src/app/Services/dataContext.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { AttachmentPopupComponent } from '../Popups/attachment-popup/attachment-popup.component';

@Component({
  selector: 'student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {

  paymentProcessing: boolean = false;
  ProblemDescription: any;
  Subjects: any;
  PaymentPackages: any;
  PackageAmount: any;
  firstForm: FormGroup;
  secondForm: FormGroup;
  AttachedFile: any;
  FileName: string;
  OriginalFileName: string;
  FileContentType: string;
  FileExtention: string;
  Files: any;
  OriginalFileNameForDisplay: any;
  AnyAttachment: boolean = false;
  Image: any;
  isLinear = true;

  constructor(
    private _dataContext: DataContext,
    private notifier: NotifierService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpClient) { }

  ngOnInit() {
    this.firstForm = this.fb.group({
      question: ['', Validators.required],
      description: ['', Validators.required],
      subject: ['', Validators.required],
    });
    this.secondForm = this.fb.group({
      paymentSelectionId: [1, Validators.required],
      cardName: ["", Validators.required],
      cardNumber: ["", Validators.required],
      cardExpiryMonth: ["", Validators.required],
      cardExpiryYear: ["", Validators.required],
      cardCvc: ["", Validators.required],
    });
    this.getProblemDescription();
    this.GetSubjects();
    this.GetPaymentPackages();

    let question = localStorage.getItem('problemDescription');
    if (question != undefined && question != null) {
      this.firstForm.get('question').setValue(question);
    }
  }

  getProblemDescription() {
    this._dataContext.get("ProblemsAndSolutions/GetProblemDescription").subscribe((data: any) => {
      this.ProblemDescription = data;
    });
  }

  GetSubjects() {
    this._dataContext.get("user/GetSubjects").subscribe((data: any) => {
      this.Subjects = data;
    });
  }

  GetPaymentPackages() {
    this._dataContext.get("ProblemsAndSolutions/GetPaymentPackages").subscribe((data: any) => {
      this.PaymentPackages = data;
      this.PackageAmount = data[0].packageAmount;
    });
  }

  onChange(id: number) {
    this.PackageAmount = this.PaymentPackages[id - 1].packageAmount;
  }

  onSubmit(firstForm: any, secondForm: any, stepper: MatStepper) {
    if (this.firstForm.valid && this.secondForm.valid) {
      let model = {
        Problems: {
          SubjectId: firstForm.value.subject,
          DescriptionId: firstForm.value.description,
          ProblemText: firstForm.value.question,
          AnyProblemAttachemt: this.AnyAttachment ? true : false,
          ProblemFileName: this.AnyAttachment ? this.FileName : null,
          ProblemOriginalFileName: this.AnyAttachment ? this.OriginalFileName : null,
          ProblemFileExtention: this.AnyAttachment ? this.FileExtention : null,
          ProblemFileContentType: this.AnyAttachment ? this.FileContentType : null,
          PaymentSelectionId: secondForm.value.paymentSelectionId
        },
        PaymentDetail: {
          Name: secondForm.value.cardName,
          Number: secondForm.value.cardNumber,
          ExpMonth: secondForm.value.cardExpiryMonth,
          ExpYear: secondForm.value.cardExpiryYear,
          Cvc: secondForm.value.cardCvc,
          Amount: secondForm.value.paymentSelectionId,
          Currency: "$",
          Description: "",
        }
      }
      this._dataContext.post('ProblemsAndSolutions/AddProblem', model).subscribe((data: any) => {
        if (data.successStatus) {
          this.notifier.notify('success', data.statusMessage);
          //this.resetForm(stepper);
          this.paymentProcessing = false;
          stepper.next();
          this.reset();
        }
        else {
          this.notifier.notify('error', 'Problem Occured While Process your Request. Please Try Again Later.');
        }
      },
        error => {
          console.log(error);
          this.notifier.notify('error', error.error);
        });
    }
  }

  goToNextForm(stepper: MatStepper) {
    stepper.next();
  }

  goBackToPreviousForm(stepper: MatStepper) {
    stepper.previous();
  }

  resetForm(stepper: MatStepper) {
    localStorage.removeItem('problemDescription');
    this.ngOnInit();
    stepper.reset();
    this.reset();
  }

  makePayment() {
    this.paymentProcessing = true;
  }

  cancelPaymentProcessing() {
    this.paymentProcessing = false;
  }

  //UPLOAD ATTACHEMNT
  uploadClick() {
    if (this.AnyAttachment) {
      this.notifier.notify('error', 'Please first remove the attachment.');
    }
    else {
      const fileUpload = document.getElementById('UploadButton') as HTMLInputElement;
      fileUpload.click();
    }
  }

  uploadAttachment(files: File[]) {
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.notifier.notify('error', 'Only images are supported.');
      return;
    }
    this.AttachedFile = files;
    this.FileContentType = files[0].type;
    if (!this.FileContentType) {
      this.FileContentType = "text/plain";
    }
    this.OriginalFileName = this.AttachedFile[0].name;
    this.OriginalFileNameForDisplay = this.OriginalFileName.substr(0, 10);
    this.FileExtention = files[0].name.split('.')[1];
    let formData = new FormData();
    Array.from(files).forEach(file => formData.append('file', file));
    this.http.post(environment.apiUrl + 'fileSystem/UploadFile', formData).subscribe(event => {
      this.AnyAttachment = true;
      this.FileName = event.toString();
      var reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (event: any) => {
        this.Image = event.target.result;
      }
    });
  }

  //GET ATTACHEMNT
  getAttachment(): void {
    const model = { FileName: this.FileName, FileContentType: this.FileContentType };
    this._dataContext.getFile('fileSystem/GetFile', model).subscribe((blob: any) => {
      const newBlob = new Blob([blob]);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }
      // To open in browser
      // const files = new Blob([blob], { type: file.attachedFileId });
      // window.open(URL.createObjectURL(files));   
      // To Download
      let data = window.URL.createObjectURL(newBlob);
      let link = document.createElement('a');
      link.href = data;
      link.download = this.FileName;
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(data);
      }, 100);
    });
  }

  //DELETE ATTACHEMNT
  removeAttachment() {
    let model = {
      fileName: this.FileName
    }
    this._dataContext.post('fileSystem/DeleteFile', model).subscribe((respose: any) => {
      this.reset();
    });
  }

  //RESET ATTACHEMNT
  reset() {
    this.AttachedFile = null;
    this.OriginalFileName = null;
    this.OriginalFileNameForDisplay = null;
    this.AnyAttachment = false;
    this.FileName = null;
    this.Image = null;
    this.FileContentType = null;
  }

  //OPEN ATTACHEMNT
  openAttachmentPopup(): void {
    let model = {
      image: this.Image,
      originalFileName: this.OriginalFileName,
      fileName: this.FileName,
      fileContentType: this.FileContentType,
      createdDate: new Date()
    };
    this.dialog.open(AttachmentPopupComponent, {
      panelClass: 'attachment-popup',
      data: model
    });
  }
}
