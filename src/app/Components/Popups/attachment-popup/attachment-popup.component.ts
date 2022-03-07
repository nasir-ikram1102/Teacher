import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataContext } from 'src/app/Services/dataContext.service';

@Component({
  selector: 'attachment-popup',
  templateUrl: './attachment-popup.component.html',
  styleUrls: ['./attachment-popup.component.scss']
})
export class AttachmentPopupComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dataContext: DataContext,
    private _dialogRef: MatDialogRef<AttachmentPopupComponent>, ) { }

  ngOnInit() {
  }

  onClose() {
    this._dialogRef.close();
  }

  //GET ATTACHEMNT
  getAttachment(file: any): void {
    const model = { FileName: this.data.fileName, FileContentType: this.data.fileContentType };
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
      link.download = this.data.fileName;
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(data);
      }, 100);
    });
  }
}
