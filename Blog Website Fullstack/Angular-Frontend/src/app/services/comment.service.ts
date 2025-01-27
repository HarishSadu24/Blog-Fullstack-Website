import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http:HttpClient) { }

  addComment(comment:string){
    const api_url = environment.blog_api;
    const blog_id = sessionStorage.getItem('blog_id');
    return this.http.post(`${api_url}/addcomment/${blog_id}`,{comment,blog_id})
  }

  getComments(page:number = 1, limit:number = 4){
    const api_url = environment.blog_api;
    const blog_id = sessionStorage.getItem('blog_id');
    return this.http.get<any>(`${api_url}/comments/${blog_id}`,{
      params:{
        page,
        limit
      },
    });
  }

  getReplies(comment_id:string , page:number = 1 , limit:number = 4){
    const api_url = environment.blog_api;
    return this.http.get(`${api_url}/replies/${comment_id}`,{
      params:{
        page,
        limit
      }
    });
  }

  addReply(comment_id:string , comment:string){
    const api_url = environment.blog_api;
    const blog_id = sessionStorage.getItem('blog_id');
    return this.http.post(`${api_url}/replycomment/${comment_id}`,{comment,blog_id});
  }

  editComment(comment_id:string , comment:string){
    const api_url = environment.blog_api;
    return this.http.patch(`${api_url}/editcomment/${comment_id}`,{comment});
  }

  likeComment(comment_id:string){
    const api_url = environment.blog_api;
    return this.http.patch(`${api_url}/likecomment/${comment_id}`,{});
  }

  deleteComment(comment_id:string){
    const api_url = environment.blog_api;
    const blog_id = sessionStorage.getItem('blog_id')
    return this.http.delete(`${api_url}/deletecomment/${comment_id}/${blog_id}`)
  }
}
