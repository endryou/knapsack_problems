import {Item} from "../../../types";
import { cli } from "cli-ux";
import {msToHumanReadableFormat} from "../../../util";

export default (items: Item[], capacity: number) => {
  cli.action.start("Przetwarzanie");
  const t0 = Date.now();

   const result = items
    // dodanie do przedmiotu wyniku dzielenia kosztu przez wagę
    .map((item) => ({
      ...item,
      score: item.value / item.weight,
    }))
    // sortowanie rosnąco
    .sort((itemA, itemB) => {
      if(itemA.score > itemB.score)
        return 1;
      else if(itemA.score < itemB.score)
        return -1;
      else return 0 // obiekty równe
    })
    // odwrócenie tablicy - wyniki posortowane malejąco
    .reverse()
    // dodanie do przedmiotu informacji o tym czy jest w plecaku
    .map((item) => ({
      ...item,
      inKnapsack: false,
    }))
    .map((item: Item, index, allItems: Item[]) => {
      const remainingCapacity = allItems
        .filter((item) => item.inKnapsack)
        .reduce((remaining, { weight }) => remaining - weight, capacity);

      if (item.weight <= remainingCapacity) {
        item.inKnapsack = true;
      }

      return item;
    })
     // przygotowanie du sumowania wyniku - zostawiam tylko przedmioty ktore zostaly w plecaku
     .filter(item => item.inKnapsack)
     // suma wag pozostałych przedmiotów
     .reduce((acc, item) => acc + item.value, 0)



  cli.action.stop(`Zakończono w ${msToHumanReadableFormat(Date.now() - t0)}, maksymalna możliwa wartość = ${result}`)

}
