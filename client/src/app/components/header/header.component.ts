import { Component, inject, OnInit } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatTabsModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{


  links = ['data', 'analysis', 'monitor'];
  router:Router = inject(Router);
  activeLink = this.links[0];
  ngOnInit(): void {
    this.router.events.pipe(
      (filter(event=>event instanceof NavigationEnd))
    ).subscribe(event=>{
      console.log(event);
      const currentUrl = this.links.find(link=>link=== event.url.replace("/",""));
      if(currentUrl){
        this.activeLink = currentUrl;
      }
    });


  }
}
