import { Component, OnInit } from '@angular/core';
import { thresholdFreedmanDiaconis } from 'd3';
import { OfflineDbServiceService } from '../../services/offline-db-service.service';
import { PersistenceService } from '../../services/persistence.service';

@Component({
  selector: 'app-dev',
  templateUrl: './dev.page.html',
  styleUrls: ['./dev.page.scss'],
})
export class DevPage implements OnInit {

  constructor(public db:PersistenceService,public offlineDb:OfflineDbServiceService) { }

  ngOnInit() {
     this.db.has('categories').subscribe(v=>{
      console.log('ha categorie',v)
    }) 
     

    this.db.keys().subscribe({
      next: (key) => {
        console.log('key:',key)
      },
      complete: () => {
        console.log('Done');
      },
    })
    let data = { text: 'yat', value: 5 }
    

    this.db.setItem('a', data, 'yat').subscribe(v => {
      console.log('set item', v,data)
    })
    /* this.db.clear().subscribe(v=>{
      console.log('deleted',v)
    }) */

    const cb = (items)=>{
      console.log('got items on subscription',items)
    }
  

    this.offlineDb.fetchAllItems2('yat').then(v => {
      console.log('finished fetching',v)
    })
  }

}
