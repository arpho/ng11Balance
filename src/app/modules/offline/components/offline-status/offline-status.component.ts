import { Component, OnInit } from '@angular/core';
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
    OfflineManagerService._offlineDbStatus.subscribe(status=>{})
   }

  ngOnInit() {}

}
