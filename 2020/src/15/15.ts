import * as fs from 'fs';
import _ from 'lodash';

const input = fs.readFileSync('./input.txt', 'utf-8');
const numbers = input.split('\n')[0].split(',').map(Number);

const play = (numbers: number[], maxTurns: number): number => {
    let transcript: { [id: number] : number[]} = {};
    let lastNumber: number = NaN;
    for (let i = 1; i <= numbers.length; i++) transcript[numbers[i -1]] = [i];
    lastNumber = numbers[numbers.length - 1];
    for (let i = numbers.length + 1; i <= maxTurns; i++) {
        if (i % 100000 == 0) {
            console.clear();
            console.log(`Done: ${((i / maxTurns) * 100).toFixed(2)}%`);
        }
        let turnsSpoken: number[] = transcript[lastNumber];
        if (turnsSpoken.length <= 1) lastNumber = 0;
        else lastNumber = turnsSpoken[turnsSpoken.length - 1] - turnsSpoken[turnsSpoken.length - 2];
        try {
            transcript[lastNumber].push(i);
        } catch {
            transcript[lastNumber] = [i];
        };
    };
    return lastNumber;
}

console.log(`Number spoken at 2020th turn is ${play(numbers, 2020)}`);
console.log(`Number spoken at 30000000th turn is ${play(numbers, 30000000)}`);