import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/Services/seo.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(
    private title: Title,
    private seo: SeoService,
  ) { }
  
  ngOnInit() {
    let t:string = "Uisek - Sobre nosotros";
    this.title.setTitle(t);

    this.seo.generateTags({
      title: "Uisek - Sobre nosotros",
      description: "Uisek Universidad",
      slug: "sobre-nosotros"
    });
    
  }
}
