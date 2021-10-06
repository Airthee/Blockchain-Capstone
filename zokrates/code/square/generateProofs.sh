#!/bin/bash

if [ "$1" == "" ]; then
    echo "Missing number of proofs to generate";
    echo "  usage:   ./generateProof [NUMBER OF PROOFS]"
    echo "  example: ./generateProof 10"
    exit 255;
fi

STARTING_NUMBER=2
ENDING_NUMBER=$(($STARTING_NUMBER + $1 - 1))

for number in $(seq $STARTING_NUMBER $ENDING_NUMBER); do
    square=$(($number * $number))
    echo "Generating proof for $number => $square"
    zokrates compute-witness -o witness${number} -a $number $square;
    zokrates generate-proof -w witness${number} -j proof${number}.json;
done