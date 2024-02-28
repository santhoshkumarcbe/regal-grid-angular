import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatComponent } from './chat/chat.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent,
    ChatComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HeaderComponent,
    FooterComponent,
    FormsModule
  ]
})
export class AdminModule { }
