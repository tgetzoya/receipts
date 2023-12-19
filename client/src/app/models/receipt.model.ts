import {Location} from "./location.model";
import {DrawAccount} from "./draw-account.model";

export class Receipt {
  date?: Date;
  donation?: number;
  drawAccount?: DrawAccount;
  id?: number;
  location?: Location;
  subtotal?: number;
  salesTax?: number;

  /* This method is required as Receipt is a compiler directive _unless_ explicitly instantiated by Angular. That means
   * that the compareTo() method will _not_ go along for the ride from API calls that return Receipt or Receipt[]
   * _unless_ this static method is called on each element after the call is returned.
   */
  static toReceipt(other: Receipt): Receipt {
    let receipt: Receipt = new Receipt();
    receipt.id = other.id;
    receipt.date = new Date(other.date + 'T00:00:00');
    receipt.donation = other.donation;
    receipt.drawAccount = other.drawAccount;
    receipt.location = other.location;
    receipt.subtotal = other.subtotal;
    receipt.salesTax = other.salesTax;

    return receipt;
  }

  compareTo(other: Receipt | undefined) {
    if (!other) {
      return -1;
    }

    if (this.id != other.id) {
      return 1;
    }

    if (this.date?.getTime() !== other.date?.getTime()) {
      return 2;
    }

    if (this.donation !== other.donation) {
      return 3;
    }

    if (this.drawAccount?.id !== other.drawAccount?.id) {
      return 4;
    }

    if (this.location?.id !== other.location?.id) {
      return 5;
    }

    if (this.subtotal !== other.subtotal) {
      return 6;
    }

    if (this.salesTax !== other.salesTax) {
      return 7;
    }

    return 0;
  }
}
