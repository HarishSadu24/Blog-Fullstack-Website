import { UpdateProfileModel } from './../models/blog.model';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { };

  getUserDetails(){
    return this.http.get(`${environment.user_api}/fetchuserdetails` ); 
  }

  updateUser(updatedUser: UpdateProfileModel){
    return this.http.patch(`${environment.user_api}/updateuser`, updatedUser ).subscribe(res=>{
      console.log(res);
      
    })
  }

}
