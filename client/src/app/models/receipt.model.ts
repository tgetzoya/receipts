import {Location} from "./location.model";
import {DrawAccount} from "./draw-account.model";

export class Receipt {
  id?: number;
  date?: Date;
  location?: Location;
  subtotal?: string;
  salesTax?: string;
  donation?: string;
  drawAccount?: DrawAccount;
}
