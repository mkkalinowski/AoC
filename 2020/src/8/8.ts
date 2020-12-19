import * as fs from 'fs';
import _ from 'lodash';

const input = fs.readFileSync('./input.txt', 'utf-8');
const instructions = input.split('\n');

type instruction = [string, number];
type result = [boolean, number];

const getInstruction = (input: string): instruction => {
    const [ins, val] = input.split(' ');
    return [ins, Number(val)];
}

const process = (instructions: string[]): result => {
    let accumulator = 0;
    let currentInstruction = 0;
    const usedInstructions: number[] = [];
    const isLast = () => currentInstruction == instructions.length - 1;
    while (!usedInstructions.includes(currentInstruction)) {
        usedInstructions.push(currentInstruction);
        const instruction = getInstruction(instructions[currentInstruction]);
        switch (instruction[0]) {
            case 'nop':
                currentInstruction++;
                if (isLast()) return [true, accumulator];
                break;
            case 'acc':
                accumulator += instruction[1];
                currentInstruction++;
                if (isLast()) return [true, accumulator];
                break;
            case 'jmp':
                currentInstruction += instruction[1];
                if (isLast()) return [true, accumulator];
                break;
        }
    }
    return [false, accumulator];
};

const autopatch = () => {
    let res: result;
    let patched: string[];
    for (let i = 0; i < instructions.length; i++) {
        const instruction = getInstruction(instructions[i]);
        switch (instruction[0]) {
            case 'nop':
                patched = [...instructions];
                patched[i] = patched[i].replace('nop', 'jmp');
                console.log(`[${i}] Test replacing ${instructions[i]} with ${patched[i]}`);
                res = process(patched);
                if (res[0]) return res;
                break;
            case 'jmp':
                patched = [...instructions];
                patched[i] = patched[i].replace('jmp', 'nop');
                console.log(`[${i}] Test replacing ${instructions[i]} with ${patched[i]}`);
                res = process(patched);
                if (res[0]) return res;
                break;
            case 'acc':
                break;
        }
    };
    return 'Working solution not found'
}

console.clear();
console.log(`Program state at the end of program: ${process(instructions)}`);
console.log(`Program state at the end of patched program: ${autopatch()}`);