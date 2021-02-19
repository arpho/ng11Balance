export class UserModel {
    image: string;
    location: string;
    about: string;
    email: string;
    phone: string;
    name: string;
    website: string;
    uid:string;
  
    makeUser(user:any){
      this.image = user && user.image || "";
      this.location = user && user.location || "";
      this.about = user && user.about || "";
      this.email = user && user.email || "";
      this.phone = user && user.phone || "";
      this.website = user && user.website || "";
      this.name = user && user.name || "";
      this.uid = user && user.uid || "";
    }
    constructor(){
  
    }
  }