import * as fs from 'fs';
import _ from 'lodash';

const input = fs.readFileSync('./input.txt', 'utf-8');
const rawValues = input.split('\n');
rawValues.pop();
const values: number[] = rawValues.map(Number);
const sortedValues: number[] = _.sortBy(values);
const maxValue = _.max(sortedValues) || 0;
const map: any = {};

const connect = (values: number[]) => {
    let lastVal = 0;
    return values.map((value) => {
        const last = lastVal;
        lastVal = value;
        return value - last;
    });
};

const getPreviousValuesSum = (value: number) => (map[value - 1] || 0) + (map[value - 2] || 0) + (map[value - 3] || 0);

const getTotalArrangements = (values: number[]) => {
    map[0] = 1;
    values.forEach((value: number) => {
        map[value] = getPreviousValuesSum(value);
    });
    return map[maxValue];
};

const differences = connect(sortedValues);
const counts = _.countBy(differences);
console.log(`1 jolt differences: ${counts[1]}, 3 jolt differences: ${counts[3] + 1}, product: ${counts[1] * (counts[3] + 1)}`);

const totalArrangments = getTotalArrangements(sortedValues);
console.log(`Total possible connections: ${totalArrangments}`);
