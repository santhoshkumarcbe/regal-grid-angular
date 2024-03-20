import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DealerRoutingModule } from './dealer-routing.module';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { SlotService } from 'src/app/services/slot.service';
import { SlotComponent } from './slot/slot.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionsComponent } from './transactions/transactions.component';



@NgModule({
    declarations: [
        DashboardComponent,
        SidebarComponent,
        SlotComponent,
        TransactionsComponent
    ],
    imports: [
        CommonModule,
        DealerRoutingModule,
        HeaderComponent,
        FooterComponent,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [ DatePipe, SlotService ]
})
export class DealerModule { }
