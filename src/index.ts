import { Command, flags } from "@oclif/command";
import { mkp, ukp } from "./problems";
import { loadItems, loadKnapsacks } from "./util";
import { cli } from "cli-ux";

class KnapsackSolver extends Command {
  static description = "rozwiązywanie problemu plecakowego";

  static flags = {
    help: flags.help({ char: "h", description: "Wyświetla pomoc" }),
    backtracks: flags.integer({
      char: "b",
      description:
        "Liczba ponownych przejść dla algorytmu podziału i ograniczania, domyślnie 0",
      required: false,
      default: 0,
    }),
    knapsacksPath: flags.string({
      char: "k",
      description: "Ścieżka do pliku będącego zbiorem plecaków (tylko dla MKP)",
      required: false,
    }),
    capacity: flags.integer({
      char: "c",
      description: "Pojemność plecaka (tylko dla UKP)",
      required: false,
    }),
    verbose: flags.boolean({
      char: 'v',
      description: 'Wyświetlanie dodatkowych informacji',
      required: false,
      default: false
    })
  };

  static args = [
    {
      name: "problem",
      description: "Problem do rozwiązania",
      required: true,
      options: ["MKP", "UKP"],
    },
    {
      name: "algorithm",
      required: true,
      description: `Algorytm. Możliwe wartości: greedy (zachłanny), boundAndBound(podział i ograniczenia), dynamic(programowanie dynamiczne), bruteForce
      Algorytmy dostępne dla danego problemu:
        MKP:\t${Object.keys(mkp.algorithms).join(", ")}
        UKP:\t${Object.keys(ukp.algorithms).join(", ")}
`,
    },
    {
      name: "items",
      required: true,
      description: "Ścieżka do zbioru danych z przedmiotami",
    },
  ];

  async run() {
    const { args, flags } = this.parse(KnapsackSolver);

    const { problem } = args;
    const algorithm: string = args.algorithm;
    const { backtracks, knapsacksPath, capacity, verbose } = flags;

    const allowedAlgs = {
      UKP: Object.keys(ukp.algorithms),
      MKP: Object.keys(mkp.algorithms),
    }[<"MKP" | "UKP">problem];

    if (!allowedAlgs.includes(algorithm)) {
      throw new Error(
        `Niekompatybilny algorytm. Algorytmy dostępne dla ${problem} to: ${allowedAlgs.join(
          ", "
        )}`
      );
    }

    console.log(`Rozwiązywanie ${problem} za pomocą ${algorithm}`);

    const items = loadItems(args.items);

    if(verbose) {
      console.log("Przedmioty: ");
      cli.table(
        items,
        {
          weight: { header: "Waga" },
          value: { header: "Wartość" },
        },
        { printLine: (s) => console.log("\t" + s) }
      );


    }

    if (problem == "UKP") {
      if (!capacity) {
        throw new Error("Nie podano pojemności plecaka!");
      }
      console.log("Pojemność plecaka = " + capacity);
      // @ts-ignore
      ukp.algorithms[algorithm](items, capacity);
    }
    else if (problem == "MKP") {

      if(algorithm == 'boundAndBound' ) {
        if(!backtracks) {
          throw new Error("Nie podano ilości ponownych przejść! (flaga b)");
        }
        console.log("Ponowne przejścia: " + backtracks);

      }

      if (!knapsacksPath) {
        throw new Error("Nie podano ścieżki do pliku z plecakami");
      }
      const knapsacks = loadKnapsacks(<string>knapsacksPath);

      if(verbose) {
        console.log("Plecaki: ");
        cli.table(
          knapsacks,
          {
            index: { header: "Indeks" },
            capacity: { header: "Pojemność" },
          },
          { printLine: (s) => console.log("\t" + s) }
        );


      }
      // @ts-ignore
      mkp.algorithms[algorithm](knapsacks, items, backtracks);
    }
  }
}

export = KnapsackSolver;
