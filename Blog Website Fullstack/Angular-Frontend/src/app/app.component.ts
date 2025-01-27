import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'angular-blog';
  isLoading:boolean = false;
  constructor(private router:Router){
    this.router.events.subscribe((event)=>{
      if(event instanceof NavigationStart)
        this.isLoading = true;
      else if(event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError)
        this.isLoading = false;
    })
  }
}
