import * as fs from 'fs';
import _ from 'lodash';

const input = fs.readFileSync('./input.txt', 'utf-8');
const binary = _.replace(_.replace(input, /[F,L]/g, '0'), /[B,R]/g, '1');
const passes = binary.split('\n');

type position = [number, number];

const seatID = (pos: position): number => (pos[0] * 8) + pos[1];

const seat = (input: string): position => [parseInt(input.substring(0, 7), 2), parseInt(input.substring(7), 2)];

const seatIDs = passes.map(pass => seatID(seat(pass)));

const maxSeatId = _.max(seatIDs) || 0;

const minSeatId = _.min(seatIDs) || 0;

console.log(`Highest seat ID: ${maxSeatId}`);
console.log(`My seat is ${_.difference(_.range(minSeatId, maxSeatId), seatIDs)}`);