import { DrawAccount } from "./draw-account.model";
import { Location } from "./location.model";

export class Schedule {
  id?         : number;
  interval?   : string;
  nextDate?   : Date;
  location?   : Location;
  subtotal?   : number;
  salesTax?   : number;
  donation?   : number;
  drawAccount?: DrawAccount;
}
