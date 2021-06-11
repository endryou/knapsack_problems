#!/bin/sh
PROJECT_ROOT=$( dirname $(dirname $(realpath $0)))

echo 'Wykonywanie obliczeń dla zbiorów zawierających 50 przedmiotów'
for i in $(seq 1 10);
  do
    echo Przejście nr $i
    ITEMS=$PROJECT_ROOT/datasets/mkp/items/50_$i.txt
    KNAPSACKS=$PROJECT_ROOT/datasets/mkp/knapsacks_1
    echo Przedmioty: $ITEMS plecaki: $KNAPSACKS
    $PROJECT_ROOT/bin/run MKP greedy $ITEMS --knapsacksPath=$KNAPSACKS
    printf '\n'
    $PROJECT_ROOT/bin/run MKP boundAndBound $ITEMS --knapsacksPath=$KNAPSACKS --backtracks=5
    printf '\n'
done

echo 'Wykonywanie obliczeń dla zbiorów zawierających 2.5 tys. przedmiotów z 5 ponownymi przejściami dla boundAndBound'
for i in $(seq 1 10);
  do
    echo Przejście nr $i
    ITEMS=$PROJECT_ROOT/datasets/mkp/items/2500_$i.txt
    KNAPSACKS=$PROJECT_ROOT/datasets/mkp/knapsacks_2
    echo Przedmioty: $ITEMS plecaki: $KNAPSACKS
    $PROJECT_ROOT/bin/run MKP greedy $ITEMS --knapsacksPath=$KNAPSACKS
    printf '\n'
    $PROJECT_ROOT/bin/run MKP boundAndBound $ITEMS --knapsacksPath=$KNAPSACKS --backtracks=5
    printf '\n'
done

echo 'Wykonywanie obliczeń dla zbiorów zawierających 5 tys. przedmiotów z 5 ponownymi przejściami dla boundAndBound'
for i in $(seq 1 10);
  do
    echo Przejście nr $i
    ITEMS=$PROJECT_ROOT/datasets/mkp/items/5000_$i.txt
    KNAPSACKS=$PROJECT_ROOT/datasets/mkp/knapsacks_3
    echo Przedmioty: $ITEMS plecaki: $KNAPSACKS
    $PROJECT_ROOT/bin/run MKP greedy $ITEMS --knapsacksPath=$KNAPSACKS
    printf '\n'
    $PROJECT_ROOT/bin/run MKP boundAndBound $ITEMS --knapsacksPath=$KNAPSACKS --backtracks=5
    printf '\n'
done

