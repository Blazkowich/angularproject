import { Component } from '@angular/core';
import { ImageComponent } from "../../shared/image/image.component";
import { ControlIconsComponent } from "../../shared/control-icons/control-icons.component";

@Component({
  selector: 'commander-main-page',
  standalone: true,
  imports: [ImageComponent, ControlIconsComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

}
