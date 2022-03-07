import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { DataContext } from 'src/app/Services/dataContext.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Problems } from 'src/app/Model/problems';
import { AttachmentPopupComponent } from '../../Popups/attachment-popup/attachment-popup.component';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-review-question',
  templateUrl: './review-question.component.html',
  styleUrls: ['./review-question.component.scss']
})
export class ReviewQuestionComponent implements OnInit {

  form: FormGroup;
  AttachedFile: any = null;
  FileName: string;
  OriginalFileName: string;
  FileContentType: string;
  FileExtention: string;
  Files: any;
  OriginalFileNameForDisplay: any;
  AnyAttachment: boolean = false;
  solutionAttachment: any = null;
  problemAttachment: any = null;
  problemFileName: any;
  solutionFileName: any;
  CreatedDate: any;
  problemData: Problems = new Problems();
  isLinear = true;

  constructor(
    private _dataContext: DataContext,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private notifier: NotifierService, ) { }

  ngOnInit() {
    this.form = this.fb.group({
      answer: ['', [Validators.required]],
    });
    this.getProblemById(localStorage.getItem('confirmationNumber'));
  }

  getProblemById(confirmationNumber: any) {
    let model = {
      ConfirmationNumber: confirmationNumber
    }
    this._dataContext.post('ProblemsAndSolutions/GetProblemById', model).subscribe((data: any) => {
      this.problemData = data;
      this.form.controls['answer'].setValue(data.solutionText);
      if (data.anyProblemAttachemt) {
        this.problemFileName = data.problemOriginalFileName.substr(0, 10);
        this.problemAttachment = this.sanitizer.bypassSecurityTrustResourceUrl(environment.attachmentUrl + data.problemFileName);
      }
      if (data.anySolutionAttachemt) {
        this.solutionAttachment = this.sanitizer.bypassSecurityTrustResourceUrl(environment.attachmentUrl + data.solutionFileName);
        this.OriginalFileName = data.solutionOriginalFileName;
        this.OriginalFileNameForDisplay = this.OriginalFileName.substr(0, 10);
        this.AnyAttachment = true;
        this.FileContentType = data.solutionFileContentType;
        this.CreatedDate = data.solutionCreatedDate;
        this.FileName = data.solutionFileName;
      }
    });
  }

  release() {
    let model = {
      ProblemId: this.problemData.problemId
    }
    this._dataContext.post('ProblemsAndSolutions/Release', model).subscribe((data: any) => {
      if (data[0].successStatus) {
        this.notifier.notify('success', data[0].statusMessage);
        if (this.AnyAttachment) {
          this.removeAttachment();
        }
        this.router.navigate(['/teacherDashboard']);
      }
      else {
        this.notifier.notify('error', 'Problem Occured While Process Your Request. Please Try Again Later.');
      }
    });
  }


  onSubmit(form: FormGroup, isSent: boolean) {
    if (this.form.valid) {
      let model = {
        ProblemId: this.problemData.problemId,
        SolutionText: form.value.answer,
        AnySolutionAttachemt: this.AnyAttachment ? true : false,
        SolutionFileName: this.AnyAttachment ? this.FileName : null,
        SolutionOriginalFileName: this.AnyAttachment ? this.OriginalFileName : null,
        SolutionFileExtention: this.AnyAttachment ? this.FileExtention : null,
        SolutionFileContentType: this.AnyAttachment ? this.FileContentType : null,
        IsSent: isSent
      }
      this._dataContext.post('ProblemsAndSolutions/AddSolution', model).subscribe((data: any) => {
        if (data.successStatus) {
          this.notifier.notify('success', data.statusMessage);
          this.router.navigate(['/teacherDashboard']);
        }
        else {
          this.notifier.notify('error', 'Problem Occured While Process your Request. Please Try Again Later.');
        }
      });
    }
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
    this.CreatedDate = new Date();
    let formData = new FormData();
    Array.from(files).forEach(file => formData.append('file', file));
    this.http.post(environment.apiUrl + 'fileSystem/UploadFile', formData).subscribe(event => {
      this.AnyAttachment = true;
      this.FileName = event.toString();
      var reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (event: any) => {
        this.solutionAttachment = event.target.result;
      }
    });
  }

  //GET ATTACHEMNT
  getAttachment(): void {
    let model = {
      FileName: this.problemData.problemFileName,
      FileContentType: this.problemData.problemFileContentType
    };
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
      link.download = this.problemData.problemFileName;
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
      this.AttachedFile = null;
      this.OriginalFileName = null;
      this.OriginalFileNameForDisplay = null;
      this.AnyAttachment = false;
      this.FileName = null;
    });
  }

  //OPEN ATTACHEMNT
  openAttachmentPopup(Attachment: any, OriginalFileName: any, FileName: any, FileContentType: any, CreatedDate: any): void {
    let model = {
      image: Attachment,
      originalFileName: OriginalFileName,
      fileName: FileName,
      fileContentType: FileContentType,
      createdDate: CreatedDate
    };
    this.dialog.open(AttachmentPopupComponent, {
      panelClass: 'attachment-popup',
      data: model
    });
  }
}
