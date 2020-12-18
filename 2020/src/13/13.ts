import * as fs from 'fs';
import _ from 'lodash';

const input = fs.readFileSync('./input.txt', 'utf-8');
const rawInstructions = input.split('\n');
rawInstructions.pop();

const availableBuses = (timetable: string[]): number[] => _.without(timetable, 'x').map(Number);

const getNearestBusTime = (timestamp: number, availableBuses: number[]): number => {
    let nextAvailables = {};
    availableBuses.forEach((bus) => _.set(nextAvailables, bus, _.floor((timestamp / bus) + 1) * bus - timestamp));
    const minWaitTime: number = _.min(_.values(nextAvailables)) || 0;
    const busNo = Number(_.findKey(nextAvailables, (v) => v == minWaitTime));
    return busNo * minWaitTime;
};

const greatestCommonDivisor = (a: number, b: number): number => b == 0 ? a : greatestCommonDivisor(b, a % b);

const leastCommonMultiple = (a: number, b: number): number => (!a || !b) ? 0 : Math.abs((a * b) / greatestCommonDivisor(a, b));

const isValid = (timestamp: number, buses: number[], departureOffsets: number[]): boolean => {
    for (let i = 0; i < buses.length; i++) if (((timestamp + departureOffsets[i]) % buses[i]) > 0) return false;
    return true;
};

const findTimestamp = (allBuses: number[]): number => {
    const departureOffsets: number[] = [];
    const buses: number[] = _.compact(allBuses);
    for (let i = 0; i < allBuses.length; i++) {
        if (_.isNaN(allBuses[i])) continue;
        departureOffsets.push(i);
    };

    let multiplier = buses[0];
    let timestamp = 0;
    for (let i = 1; i < buses.length; i++) {
        while (true) {
            if ((timestamp + departureOffsets[i]) % buses[i] === 0) {
                multiplier *= buses[i];
                break;
            }
            timestamp += multiplier;
        };
    };

    return timestamp;
};

const timestamp: number = Number(rawInstructions[0]);
const timetable: string[] = rawInstructions[1].split(',');
const validBuses: number[] = availableBuses(timetable);
const allBuses: number[] = timetable.map(Number);

console.log(`Nearest bus timestamp: ${getNearestBusTime(timestamp, validBuses)}`);
console.log(`The timestamp that matches ${allBuses} is ${findTimestamp(allBuses)}`);