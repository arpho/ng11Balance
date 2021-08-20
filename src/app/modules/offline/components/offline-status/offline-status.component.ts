import { Component, OnInit } from '@angular/core';
import { Offline } from '../../models/offlineDecorator';
import { OfflineManagerService } from '../../services/offline-manager.service';

@Component({
  selector: 'app-offline-status',
  templateUrl: './offline-status.component.html',
  styleUrls: ['./offline-status.component.scss'],
})
/**subscribe to offlineStatus field in offlineManager */
export class OfflineStatusComponent implements OnInit {
  status = OfflineManagerService.offlineDbStatus

  constructor() {
    console.log('ciao sono ',status)
    OfflineManagerService._offlineDbStatus.subscribe(status=>{console.log('status db',status)})
   }

  ngOnInit() {}

}
