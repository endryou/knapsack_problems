import { Item } from "../../../types";
import { cli } from "cli-ux";
import {msToHumanReadableFormat} from "../../../util";

export default async (items: Item[], capacity: number) => {
  cli.action.start("Przetwarzanie.");
  const t0 = Date.now();

  let maxProfit = 0;
  for (let i = 0; i <= Math.pow(items.length, 2); i++) {
    const binaryStr = i.toString(2);
    let profit = 0;
    let weight = 0;

    for (let j = 0; j < binaryStr.length; j++) {
      if (binaryStr.charAt(j) == "1") {
        if (weight + items[j].weight > capacity) {
          profit = 0;
          break;
        } else {
          profit = profit + items[j].value;
          weight = weight + items[j].weight;
        }
      }
    }

    maxProfit = Math.max(maxProfit, profit);
  }

  const executionTime = t0 - Date.now();


  cli.action.stop(`Zakończono w ${msToHumanReadableFormat(executionTime)}, maksymalna możliwa wartość = ${maxProfit}`);

};
