import {Item, Knapsack} from "./types";
import * as path from 'path';
import * as fs from 'fs';

export const loadItems: (pathLike: string) => Item[] = pathLike => {



  if(!fs.existsSync(pathLike)) {
    throw new Error(`File located at ${pathLike} does not exist. `);
  }

  const file = fs.readFileSync(pathLike).toString();

  const items = file.split('\n')
    // zostawiam linie zawierające dwie liczby oddzielone spacją
    .filter(line => line.match(/^\d*\W\d*$/))
    // str => [weight, value]
    .map(line => line.split(' ').map(str => Number(str)))
    // [weight, value] => Obj{ weight, value }
    .map(([weight, value]) => ({
      weight,
      value
    }));



  return items;
}

export const loadKnapsacks: (pathLike: string) => Knapsack[] = pathLike => {
  if(!fs.existsSync(pathLike)) {
    throw new Error(`File located at ${pathLike} does not exist. `);
  }

  const file = fs.readFileSync(pathLike).toString();

  const knapsacks = file
    // podział pliku na linie
    .split('\n')
    // usuwam zbędne spacje z linii
    .map(line => line.trim())

    // zostawiam linie zawierające tylko liczby
    .filter(line => line.match(/^\d\d*$/))
    // str => number
    .map(line => Number(line))
    .map((capacity, index) => <Knapsack>{
      capacity,
      index
    });

  return knapsacks;
}

export const msToHumanReadableFormat = (ms: number) => {
  const date = new Date(~~ms);

  return `${date.getUTCHours()} godz. ${date.getUTCMinutes()} min. ${date.getUTCSeconds()} s ${date.getUTCMilliseconds()} ms`
}

