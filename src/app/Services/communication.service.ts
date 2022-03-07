import { Injectable, Output, EventEmitter } from '@angular/core'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class CommunicationService {
    isOpen = false;
    @Output() redirectToProblemDetail: EventEmitter<any> = new EventEmitter();

    RedirectToProblemDetail(config: any) {
        this.redirectToProblemDetail.emit(config);
    }
}