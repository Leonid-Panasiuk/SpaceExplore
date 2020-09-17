import { Component } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations'
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ]
})

export class AppComponent {
  
  rovers: Rover[];
  selectedRoverIndex: number = -1;
  selectedSol: number = 0;
  selectedCamera: string;
  currentPage: number = 1;
  photos: Photo[];
  loading: boolean = false;
  loadingMore: boolean = false;
  noMorePhotos: boolean = false;

  apiKey: string = '335VrdIQSgchdzdDKgChzhUGvBvc5cKobBQACKyD';
  baseUrl: string = 'https://api.nasa.gov/mars-photos/api/v1/rovers/';
  title = 'SpaceExplore';
  isMenuOpen = false;

  constructor(private http: HttpClient)
  {
    let fhaz = new Camera('Front Hazard Avoidance Camera', 'FHAZ');
    let rhaz = new Camera('Rear Hazard Avoidance Camera', 'RHAZ');
    let mast = new Camera('Mast Camera', 'MAST');
    let chemcam = new Camera('Chemistry and Camera Complex', 'CHEMCAM');
    let mahli = new Camera('Mars Hand Lens Imager', 'MAHLI');
    let mardi = new Camera('Mars Descent Imager', 'MARDI');
    let navcam = new Camera('Navigation Camera', 'NAVCAM');
    let pancam = new Camera('Panoramic Camera', 'PANCAM');
    let minites = new Camera('Miniature Thermal Emission Spectrometer (Mini-TES)', 'MINITES');

    this.rovers = new Array<Rover>();
    this.rovers.push(new Rover('Curiosity', [fhaz, rhaz, mast, chemcam, mahli, mardi, navcam], '../assets/rover-1.svg'));
    this.rovers.push(new Rover('Opportunity', [fhaz, rhaz, navcam, navcam, pancam, minites], '../assets/rover-2.svg'));
    this.rovers.push(new Rover('Spirit', [fhaz, rhaz, navcam, navcam, pancam, minites], '../assets/rover-3.svg'));
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onRoverClick(index: number){
    this.selectedRoverIndex = index;

    let sameCameraExist = false;
    for (let i = 0; i < this.rovers[this.selectedRoverIndex].cameras.length; i++){
      if (this.rovers[this.selectedRoverIndex].cameras[i].abbreviation === this.selectedCamera){
        sameCameraExist = true;
        break;
      }
    }

    if (!sameCameraExist){
      this.selectedCamera = this.rovers[this.selectedRoverIndex].cameras[0].abbreviation;
    }

    this.onOptionsChanged();
  }

  onOptionsChanged() {
    this.noMorePhotos = false;
    this.currentPage = 1;
    let url = this.baseUrl + `${this.rovers[this.selectedRoverIndex].name}/photos?sol=${this.selectedSol}&camera=${this.selectedCamera}&page=${this.currentPage}&api_key=${this.apiKey}`;
    this.loading = true;
    this.http.get<Response>(url).subscribe((data: Response) => 
    {
      if (data.photos.length !== 0){
        this.photos = data.photos;
      }
      else {
        this.photos = [];
        this.noMorePhotos = true;
      }

      this.loading = false;
    });
  }

  loadMore() {
    this.currentPage++;
    let url = this.baseUrl + `${this.rovers[this.selectedRoverIndex].name}/photos?sol=${this.selectedSol}&camera=${this.selectedCamera}&page=${this.currentPage}&api_key=${this.apiKey}`;
    this.loadingMore = true;
    this.http.get<Response>(url).subscribe((data: Response) => 
    {
      if (data.photos.length !== 0){
        this.photos = this.photos.concat(data.photos);
      }
      else {
        this.noMorePhotos = true;
      }

      
      this.loadingMore = false;
    });
  }

  showView = {
    previous: false,
    current: false,
    next: false
  }
}

class Rover {
  name: string;
  cameras: Camera[];
  image: string;

  constructor(name: string, cameras: Camera[], image: string){
    this.name = name;
    this.cameras = cameras;
    this.image = image;
  }
}

class Camera {
  name: string;
  abbreviation: string;
  
  constructor(name: string, abbreviation: string){
    this.name = name;
    this.abbreviation = abbreviation;
  }
}

class Response{
  photos: Photo[];
}

class Photo {
  img_src: string;
}