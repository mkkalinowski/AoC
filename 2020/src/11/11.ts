import * as fs from 'fs';
import _ from 'lodash';

const input = fs.readFileSync('./input.txt', 'utf-8');
const rawLayout = input.split('\n');
rawLayout.pop();
const layout = rawLayout.map((val: string) => val.split(''));
const layoutHeight = layout.length;
const layoutWidth = layout[0].length;

enum Direction { NW, N, NE, W, E, SW, S, SE};
const directions = _.filter(_.values(Direction), _.isString);

const isOccupiedNear = (layout: string[][], x: number, y: number): boolean => _.inRange(x, 0, layoutWidth) && _.inRange(y, layoutHeight) && layout[y][x] == '#';

const isOccupiedFar = (layout: string[][], x: number, y: number, direction: any): boolean => {
    switch (direction) {
        case 'NW':
            for (let i = 1; _.inRange(x - i, 0, layoutWidth) && _.inRange(y - i, 0, layoutHeight); i++) if (layout[y - i][x - i] == '#') return true; else if(layout[y - i][x - i] == 'L') return false;
            return false;
        case 'N':
            for (let i = 1; _.inRange(y - i, 0, layoutHeight); i++) if (layout[y - i][x] == '#') return true; else if(layout[y - i][x] == 'L') return false;
            return false;
        case 'NE':
            for (let i = 1; _.inRange(x + i, 0, layoutWidth) && _.inRange(y - i, 0, layoutHeight); i++) if (layout[y - i][x + i] == '#') return true; else if(layout[y - i][x + i] == 'L') return false;
            return false;
        case 'W':
            for (let i = 1; _.inRange(x - i, 0, layoutWidth); i++) if (layout[y][x - i] == '#') return true; else if(layout[y][x - i] == 'L') return false;
            return false;
        case 'E':
            for (let i = 1; _.inRange(x + i, 0, layoutWidth); i++) if (layout[y][x + i] == '#') return true; else if(layout[y][x + i] == 'L') return false;
            return false;
        case 'SW':
            for (let i = 1; _.inRange(x - i, 0, layoutWidth) && _.inRange(y + i, 0, layoutHeight); i++) if (layout[y + i][x - i] == '#') return true; else if(layout[y + i][x - i] == 'L') return false;
            return false;
        case 'S':
            for (let i = 1; _.inRange(y + i, 0, layoutHeight); i++) if (layout[y + i][x] == '#') return true; else if(layout[y + i][x] == 'L') return false;
            return false;
        case 'SE':
            for (let i = 1; _.inRange(x + i, 0, layoutWidth) && _.inRange(y + i, 0, layoutHeight); i++) if (layout[y + i][x + i] == '#') return true; else if(layout[y + i][x + i] == 'L') return false;
            return false;
    }
    return false;
};

const occupiedNearSeatsNumber = (layout: string[][], x: number, y: number): number => _.compact([isOccupiedNear(layout, x - 1, y - 1), isOccupiedNear(layout, x, y - 1), isOccupiedNear(layout, x + 1, y - 1), isOccupiedNear(layout, x - 1, y), isOccupiedNear(layout, x + 1, y), isOccupiedNear(layout, x - 1, y + 1), isOccupiedNear(layout, x, y + 1), isOccupiedNear(layout, x + 1, y + 1)]).length;

const occupiedFarSeatsNumber = (layout: string[][], x: number, y: number): number => _.compact(directions.map((d: string) => isOccupiedFar(layout, x, y, d))).length;

const process = (layout: string[][], occupiedCheckFn: Function, tolerance: number): string[][] => {
    let output = _.cloneDeep(layout);
    for (let y = 0; y < layoutHeight; y++)
        for (let x = 0; x < layoutWidth; x++) {
            if (layout[y][x] == '.') continue;
            let occupied = occupiedCheckFn(layout, x, y);
            if (layout[y][x] == 'L' && occupied == 0) output[y][x] = '#';
            else if (layout[y][x] == '#' && occupied >= tolerance) output[y][x] = 'L';
        }
    return output;
};

const seatCount = (layout: string[][]): number => _.countBy(_.flatten(layout))['#'];

let passes = 0;
let newLayout: string[][] = _.cloneDeep(layout);
let last: string[][] = [];
while (!_.isEqual(last, newLayout)) {
    passes++;
    last = _.cloneDeep(newLayout);
    newLayout = process(last, occupiedNearSeatsNumber, 4);
}
console.log(`Changes stabilized after ${passes} passes - ${seatCount(newLayout)} seats occupied.`)

passes = 0;
newLayout = _.cloneDeep(layout);
last = [];
while (!_.isEqual(last, newLayout)) {
    passes++;
    last = _.cloneDeep(newLayout);
    newLayout = process(last, occupiedFarSeatsNumber, 5);
}
console.log(`Changes stabilized after ${passes} passes - ${seatCount(newLayout)} seats occupied.`)