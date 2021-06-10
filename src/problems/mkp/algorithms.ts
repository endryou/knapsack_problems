import {Item, Knapsack} from "../../types";
// @ts-ignore
import {MTM} from './mtm';
import { cli } from "cli-ux";
import {msToHumanReadableFormat} from "../../util";

export const greedy = (knapsacks: Knapsack[], items: Item[]) => {
  cli.action.start("Przetwarzanie");
  const t0 = Date.now();
 // sort items in decreasing order of profit per unit weight
	items.sort((a, b) => (a.weight / a.value) - (b.weight / b.value));

	// sort knapsacks in increasing order of capacity
	knapsacks.sort((a, b) => a.capacity - b.capacity);

	let solution = 0;
	items.forEach(item => {
		for (let i = 0; i < knapsacks.length; i++) {
			if (item.weight < knapsacks[i].capacity) {
				// item.knapsack = knapsacks[i].index;
				knapsacks[i].capacity -= item.weight;
				solution += item.value;
				break;
			}
		}
	});

  cli.action.stop(`Zakończono w ${msToHumanReadableFormat(Date.now() - t0)}, maksymalny wynik = ${solution}`);
}

export const branchAndBound = (knapsacks: Knapsack[], items: Item[], maxBacktracks: number) => {
  cli.action.start("Przetwarzanie");
  const t0 = Date.now();

  // sortowanie przedmiotów malejąco wedle stosunku wartości do wagi
  items.sort((a, b) => (a.weight / a.value) - (b.weight / b.value));

  // sortowanie plecaków rosnąco wedle pojemności
  knapsacks.sort((a, b) => a.capacity - b.capacity);

  // wywołanie algorytmu MTM
  const result = MTM(knapsacks, items, maxBacktracks);

  cli.action.stop(`Zakończono w ${msToHumanReadableFormat(Date.now() - t0)}, wynik = ${result.solution}`)
}
