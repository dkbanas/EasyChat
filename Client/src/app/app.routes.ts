import { Routes } from '@angular/router';
import {JoinPageComponent} from "./components/pages/join-page/join-page.component";
import {RoomPageComponent} from "./components/pages/room-page/room-page.component";

export const routes: Routes = [
  {path:'', component:JoinPageComponent},
  {path:'room',component:RoomPageComponent}
];
