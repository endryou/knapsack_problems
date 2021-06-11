#!/bin/sh
PROJECT_ROOT=$( dirname $(dirname $(realpath $0)))

#for i in $(seq 1 30);
#  do  $PROJECT_ROOT/bin/run UKP greedy $PROJECT_ROOT/datasets/ukp/01 --capacity=120
#done
CAPACITY=50000
DATASET=5000_10.txt
#UKP
$PROJECT_ROOT/bin/run UKP greedy $PROJECT_ROOT/datasets/instances/$DATASET --capacity=$CAPACITY
$PROJECT_ROOT/bin/run UKP bruteForce $PROJECT_ROOT/datasets/instances/$DATASET --capacity=$CAPACITY
$PROJECT_ROOT/bin/run UKP dynamic $PROJECT_ROOT/datasets/instances/$DATASET --capacity=$CAPACITY

#MKP
#$PROJECT_ROOT/bin/run MKP boundAndBound $PROJECT_ROOT/datasets/mkp/01/items --knapsacksPath=$PROJECT_ROOT/datasets/mkp/01/knapsacks --backtracks=30
#$PROJECT_ROOT/bin/run MKP greedy $PROJECT_ROOT/datasets/mkp/01/items --knapsacksPath=$PROJECT_ROOT/datasets/mkp/01/knapsacks

#MKP
#$PROJECT_ROOT/bin/run MKP boundAndBound $PROJECT_ROOT/datasets/mkp/02/items --knapsacksPath=$PROJECT_ROOT/datasets/mkp/02/knapsacks --backtracks=30
#$PROJECT_ROOT/bin/run MKP greedy $PROJECT_ROOT/datasets/mkp/02/items --knapsacksPath=$PROJECT_ROOT/datasets/mkp/02/knapsacks














