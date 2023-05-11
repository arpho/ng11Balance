import { Injectable } from "@angular/core";
import { Platform } from "@ionic/angular/providers/platform";

@Injectable({
  providedIn: 'root'
})
export class PlatformStrategyService {

  constructor(
    private platform:Platform){
      console.log("piattaforma :: :: :: :: :: :: :: ::")
      console.log("android: ",this.platform.is("android"))
      console.log("ios",this.platform.is("ios"))
      console.log("hybrid",this.platform.is("hybrid"))
      console.log("mobileweb",this.platform.is("mobileweb"))
      console.log("piattaforma :: :: :: :: :: :: :: ::")
    }
    isMobile():boolean{
      return this.platform.is("android") || this.platform.is("ios")||this.platform.is("mobile")||this.platform.is("mobileweb")||this.platform.is("hybrid")
    }
  
}