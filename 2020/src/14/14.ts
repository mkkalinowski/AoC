import * as fs from 'fs';
import _ from 'lodash';

const input = fs.readFileSync('./input.txt', 'utf-8');
const rawInstructions = input.split('\n');
rawInstructions.pop();
const instructions = rawInstructions.map(instruction => instruction.split(' = '));

const applyMask = (value: string, mask: string): number => {
    let output = '';
    for (let i = 0; i < 36; i++) output += mask[i] != 'X' ? mask[i] : value[i];
    return parseInt(output, 2);
};

const applyValueV1 = (memory: number[], mask: string, address: number, value: number): number => {
    const binary = value.toString(2).padStart(36, '0');
    const lastValue = memory[address] || 0;
    memory[address] = applyMask(binary, mask);
    return memory[address] - lastValue;
};

const getAddresses = (address: number, mask: string): number[] => {
    let addresses: string[] = [];
    let initialAddress = '';
    const binary = address.toString(2).padStart(36, '0');
    for (let i = 0; i < 36; i++) initialAddress += mask[i] == '0' ? binary[i] : mask[i];
    addresses.push(initialAddress);
    while (_.find(addresses, address => address.includes('X'))) {
        let address = _.find(addresses, address => address.includes('X')) || '';
        _.pull(addresses, address);
        let [optionA, optionB] = [address?.replace('X', '0'), address?.replace('X', '1')];
        addresses.push(optionA);
        addresses.push(optionB);
    };
    return addresses.map(address => parseInt(address, 2));
};

const applyValueV2 = (memory: number[], mask: string, address: number, value: number): number => {
    let total = 0;
    getAddresses(address, mask).forEach(address => {
        let lastValue = memory[address] || 0;
        memory[address] = value;
        total += value - lastValue;
    });
    return total;
}

const parse = (instructions: string[][], applyFunction: Function): number => {
    let mask = '';
    const memory: number[] = [];
    let total = 0;
    instructions.forEach((instruction) => {
        if (instruction[0] == 'mask') mask = instruction[1];
        else {
            const address = Number(_.words(instruction[0].replace(/[\[\]]/g, ''))[1]);
            const value = Number(instruction[1]);
            total += applyFunction(memory, mask, address, value);
        };
    });
    return total;
};

console.log(`Sum of values left in memory with v1 chip: ${parse(instructions, applyValueV1)}`);
console.log(`Sum of values left in memory with v2 chip: ${parse(instructions, applyValueV2)}`);