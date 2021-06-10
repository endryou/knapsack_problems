import {Item} from "../../../types";
import { cli } from "cli-ux";
import {msToHumanReadableFormat} from "../../../util";

export default (items: Item[], capacity: number) => {

  cli.action.start("Przetwarzanie");
  const t0 = Date.now();

  const dp = new Array(capacity + 1).fill(0);

  dp.forEach((_, i) => {
    items.forEach(({weight, value}, j) => {
      if(weight < i) {
        dp[i] = Math.max(dp[i], (dp[i - weight] + value))
      }
    })
  })

  const result =  dp[capacity];

  cli.action.stop(`Zakończono w ${msToHumanReadableFormat(Date.now() - t0)}, maskymalna możliwa wartość = ${result}`);
}
