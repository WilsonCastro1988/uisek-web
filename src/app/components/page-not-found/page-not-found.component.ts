import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/Services/seo.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    private title: Title,
    private seo: SeoService,
  ) { }

  ngOnInit() {
    let t:string = "Uisek - No Encontrada";
    this.title.setTitle(t);

    this.seo.generateTags({
      title: "Uisek - No Encontrada",
      description: "uisek Inscripciones",
      slug: "web-no-encotrada"
    });
  }

}
