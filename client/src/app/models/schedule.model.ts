import { DrawAccount } from "./draw-account.model";
import { Location } from "./location.model";
import {Receipt} from "./receipt.model";

export class Schedule {
  donation?   : number;
  drawAccount?: DrawAccount;
  id?         : number;
  interval?   : string;
  location?   : Location;
  nextDate?   : Date;
  salesTax?   : number;
  subtotal?   : number;

  static fromReceipt(receipt: Receipt): Schedule {
    let schedule: Schedule = new Schedule();

    if (receipt) {
      schedule.id = receipt.id;
      schedule.donation = receipt.donation;
      schedule.drawAccount = receipt.drawAccount;
      schedule.location = receipt.location;
      schedule.subtotal = receipt.subtotal;
      schedule.salesTax = receipt.salesTax;
    }

    return schedule;
  }
}
