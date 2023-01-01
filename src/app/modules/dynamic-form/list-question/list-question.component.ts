import { Component, Input, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-list-question',
  templateUrl: './list-question.component.html',
  styleUrls: ['./list-question.component.scss'],
})
export class ListQuestionComponent implements OnInit {
  @Input() itemsList:unknown[]

  constructor() { }

  ngOnInit() {
    
  }
  deleteItem(item,slide:IonItemSliding,i){
    console.log("deleting ",item,i)
    slide.close()
  }

  editItem(item,slide:IonItemSliding,i){
    console.log("editing ",item,i)
    slide.close()
  }

}
