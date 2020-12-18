import * as fs from 'fs';
import _ from 'lodash';

const input = fs.readFileSync('./input.txt', 'utf-8');
const rawInstructions = input.split('\n');
rawInstructions.pop();
const turns = ['L', 'R'];
const directions = ['N', 'E', 'W', 'S'];
enum Direction { N, E, S, W };
type coordinates = [number, number];
type position = [coordinates, Direction];

const getDirection = (currentDirection: Direction, turnDegrees: number): Direction => {
    let index = currentDirection + (turnDegrees / 90);
    return index < 0 ? index + 4 : index % 4;
};

const moveShip = (instruction: string, currentPosition: position): position => {
    let [direction, rawSpeed] = _.words(instruction);
    let speed = Number(rawSpeed);
    if (_.includes(turns, direction)) return [currentPosition[0], getDirection(currentPosition[1], direction == 'L' ? -speed : speed)];
    else if (_.includes(directions, direction)) switch (direction) {
        case 'N': return [[currentPosition[0][0], currentPosition[0][1] - speed], currentPosition[1]];
        case 'E': return [[currentPosition[0][0] + speed, currentPosition[0][1]], currentPosition[1]];
        case 'W': return [[currentPosition[0][0] - speed, currentPosition[0][1]], currentPosition[1]];
        case 'S': return [[currentPosition[0][0], currentPosition[0][1] + speed], currentPosition[1]];
    } else switch (currentPosition[1]) {
        case Direction.N: return [[currentPosition[0][0], currentPosition[0][1] - speed], currentPosition[1]];
        case Direction.E: return [[currentPosition[0][0] + speed, currentPosition[0][1]], currentPosition[1]];
        case Direction.W: return [[currentPosition[0][0] - speed, currentPosition[0][1]], currentPosition[1]];
        case Direction.S: return [[currentPosition[0][0], currentPosition[0][1] + speed], currentPosition[1]];
    }
    return [[0, 0], Direction.E]
};

const rotateWaypoint = (waypointCoordinates: coordinates, turnDegrees: number): coordinates => {
    switch (turnDegrees) {
        case 90: case -270: return [-waypointCoordinates[1], waypointCoordinates[0]];
        case 180: case -180: return [-waypointCoordinates[0], -waypointCoordinates[1]];
        case 270: case -90: return [waypointCoordinates[1], -waypointCoordinates[0]];
    }
    return waypointCoordinates;
};

const moveWithWaypoint = (instruction: string, shipCoordinates: coordinates, waypointCoordinates: coordinates): [coordinates, coordinates] => {
    let [command, rawValue] = _.words(instruction);
    let value = Number(rawValue);
    if (_.includes(turns, command)) return [shipCoordinates, rotateWaypoint(waypointCoordinates, command == 'L' ? -value : value)];
    else if (_.includes(directions, command)) switch (command) {
        case 'N': return [shipCoordinates, [waypointCoordinates[0], waypointCoordinates[1] - value]];
        case 'E': return [shipCoordinates, [waypointCoordinates[0] + value, waypointCoordinates[1]]];
        case 'W': return [shipCoordinates, [waypointCoordinates[0] - value, waypointCoordinates[1]]];
        case 'S': return [shipCoordinates, [waypointCoordinates[0], waypointCoordinates[1] + value]];
    } else return [[shipCoordinates[0] + value * waypointCoordinates[0], shipCoordinates[1] + value * waypointCoordinates[1]], waypointCoordinates];
    return [shipCoordinates, waypointCoordinates];
};

const manhattanDistance = (coordinates: coordinates): number => Math.abs(coordinates[0]) + Math.abs(coordinates[1]);

let shipPosition: position = [[0, 0], Direction.E];

rawInstructions.forEach((instruction) => shipPosition = moveShip(instruction, shipPosition));
console.log(`Final ship position: ${shipPosition}`);
console.log(`Total distance covered: ${manhattanDistance(shipPosition[0])}`);

let shipCoordinates: coordinates = [0, 0];
let waypointCoordinates: coordinates = [10, -1];
rawInstructions.forEach((instruction) => [shipCoordinates, waypointCoordinates] = moveWithWaypoint(instruction, shipCoordinates, waypointCoordinates));
console.log(`Final ship coordinates: ${shipCoordinates}`);
console.log(`Final waypoint coordinates: ${waypointCoordinates}`);
console.log(`Total distance covered: ${manhattanDistance(shipCoordinates)}`);
