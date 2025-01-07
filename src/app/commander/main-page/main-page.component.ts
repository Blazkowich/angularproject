import { Component } from '@angular/core';
import { ImageComponent } from "../../shared/image/image.component";
import { ControlIconsComponent } from "../../shared/control-icons/control-icons.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'commander-main-page',
  standalone: true,
  imports: [ImageComponent, ControlIconsComponent, FormsModule, CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  jobs = [
    { jobName: 'Software Developer' },
    { jobName: 'Project Manager' }
  ];
}
