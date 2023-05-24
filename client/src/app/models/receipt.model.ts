import {Location} from "./location.model";
import {DrawAccount} from "./draw-account.model";

export class Receipt {
  id!: number;
  date!: Date | null;
  location!: Location | undefined;
  subtotal!: string | null;
  salesTax!: string | null;
  donation!: string | null;
  drawAccount!: DrawAccount | undefined;
}
