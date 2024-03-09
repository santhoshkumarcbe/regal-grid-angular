import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Slot } from 'src/app/models/slot.model';
import { SlotService } from 'src/app/services/slot.service';

@Component({
  selector: 'app-activate-port',
  templateUrl: './activate-port.component.html',
  styleUrls: ['./activate-port.component.scss']
})

export class ActivatePortComponent {
  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  slotService: SlotService = inject(SlotService);
  id!: string | null;
  slot!: Slot;
  showMessage!: boolean;
  errorMessage!: string | null;
  slotActivated = false;

  ngOnInit() {
    this.activeRoute.queryParamMap.subscribe((data) => {
      this.id = data.get('id');
    });

    this.slotService.findSlotById(this.id!.toString()).subscribe({
      next: data => {
        this.slot = data
        this.showMessage = !this.slot.expired;
        console.log("this.showMessage", this.showMessage);
        
        console.log(data);

      },
      error: error => {
        console.error(error);
        this.errorMessage = "Link is broken or Already verified";
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      }
    })
  }

  activateChargingPort() {
    this.setSlotExpiredTrue();
    // activate charging port api 
    // add api to  activate charging port 
  }

  setSlotExpiredTrue() {
    this.slotService.setSlotExpiredTrue(this.id!.toString()).subscribe({
      next: data => {
        console.log(data);
        this.slotActivated = true
      },
      error: error => {
        console.error(error);
        console.log(error.error);

      }
    })
  }

}
