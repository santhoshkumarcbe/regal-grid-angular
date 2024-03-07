import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatComponent } from './chat/chat.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionsComponent } from './transactions/transactions.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent,
    ChatComponent,
    TransactionsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HeaderComponent,
    FooterComponent,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
