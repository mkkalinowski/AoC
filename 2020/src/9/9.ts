import * as fs from 'fs';
import * as _ from 'lodash';

const input = fs.readFileSync('./input.txt', 'utf-8');
const rawValues = input.split('\n');
rawValues.pop();
const values = rawValues.map(Number);

const isValid = (valueIndex: number, valueList: number[], preambleLength: number): boolean => {
    if (valueIndex < preambleLength) return true;
    const value = valueList[valueIndex];
    const values = _.slice(valueList, valueIndex - preambleLength, valueIndex);
    for (let i = 0; i < preambleLength; i++) {
        const val = values[i];
        if (val == value) continue;
        const match = value - val;
        if (_.without(values, val).includes(match)) return true;
    }
    return false;
}

const getInvalid = (values: number[], preambleLength: number): number => {
    for (let i = 0; i < values.length; i++) {
        if (isValid(i, values, preambleLength)) continue; else return values[i];
    }
    return -1;
};

const findRange = (values: number[], invalid: number): number[] => {
    for (let i = 0; i < values.length; i++) {
        let sum = values[i];
        let slice = (() => {
            for (let j = i + 1; j < values.length; j++) {
                sum += values[j];
                if (sum > invalid) return null;
                else if (sum < invalid) continue;
                else return _.slice(values, i, j + 1);
            }
        })();
        if (slice == null) continue;
        return slice;
    };
    return [];
};

const invalid = getInvalid(values, 25);
const range = findRange(values, invalid);
const min = _.min(range) || 0;
const max = _.max(range) || 0;

console.log(`First invalid number is: ${invalid}`);
console.log(`The range that sums up to ${invalid} is ${range}`);
console.log(`Vulnerability number is: ${min + max}`);