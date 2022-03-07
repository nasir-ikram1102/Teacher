import { Component, OnInit } from '@angular/core';
import { DataContext } from 'src/app/Services/dataContext.service';
import { UserSession } from 'src/app/Services/userSession.service';
import { Problems } from 'src/app/Model/problems';
import { AttachmentPopupComponent } from '../../Popups/attachment-popup/attachment-popup.component';
import { MatDialog } from '@angular/material';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'problem-detail',
  templateUrl: './problem-detail.component.html',
  styleUrls: ['./problem-detail.component.scss']
})
export class ProblemDetailComponent implements OnInit {

  problemData: Problems = new Problems();
  UserRoleId: number = this._userSession.getUserRoleId();
  solutionAttachment: any = null;
  problemAttachment: any = null;
  problemFileName: any;
  solutionFileName: any;


  constructor(
    private _dataContext: DataContext,
    private _userSession: UserSession,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog, ) {
  }

  ngOnInit() {
    this.getProblemById(localStorage.getItem('confirmationNumber'));
  }

  ngAfterViewInit(): void {
  }


  getProblemById(confirmationNumber: any) {
    let model = {
      ConfirmationNumber: confirmationNumber
    }
    this._dataContext.post('ProblemsAndSolutions/GetProblemById', model).subscribe((data: any) => {
      this.problemData = data;
      if (data.anyProblemAttachemt) {
        this.problemFileName = data.problemOriginalFileName.substr(0, 10);
        this.problemAttachment = this.sanitizer.bypassSecurityTrustResourceUrl(environment.attachmentUrl + data.problemFileName);
      }
      if (data.anySolutionAttachemt) {
        this.solutionFileName = data.solutionOriginalFileName.substr(0, 10);
        this.solutionAttachment = this.sanitizer.bypassSecurityTrustResourceUrl(environment.attachmentUrl + data.solutionFileName);
      }
    });
  }

  //GET ATTACHEMNT
  getAttachment(fileName: any, fileContentType: any): void {
    const model = { FileName: fileName, FileContentType: fileContentType };
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
      link.download = fileName;
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(data);
      }, 100);
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