import * as fs from 'fs';
import _ from 'lodash';

const input = fs.readFileSync('./input.txt', 'utf-8');
const rawLayout: string[] = input.split('\n');
rawLayout.pop();

type coordinates = [number, number, number, number];

let layout = {};
rawLayout.map((row, y) => row.split('').map((value, x) => _.set(layout, `0.0.${y - 1}.${x - 1}`, value)));

const countActiveNeighbors = (layout: object, coords: coordinates): number => {
    let total = 0;
    for (let w = coords[0] - 1; w <= coords[0] + 1; w++)
        for (let z = coords[1] - 1; z <= coords[1] + 1; z++)
            for (let y = coords[2] -1; y <= coords[2] + 1; y++)
                for (let x = coords[3] -1; x <= coords[3] + 1; x++)
                    if (_.get(layout, `${w}.${z}.${y}.${x}`) == '#') total++;
    if (_.get(layout, `${coords[0]}.${coords[1]}.${coords[2]}.${coords[3]}`) == '#') total--;
    return total;
};

const cycle = (layout: object): object => {
    const newLayout = _.cloneDeep(layout);
    const wIndexes: number[] = _.keys(layout).map(Number);
    const zIndexes: number[] = _.keys(_.get(layout, 0)).map(Number);
    const yIndexes: number[] = _.keys(_.get(layout, '0.0')).map(Number);
    const xIndexes: number[] = _.keys(_.get(layout, '0.0.0')).map(Number);
    for (let w = (_.min(wIndexes) || 0) - 1; w <= (_.max(wIndexes) || 0) + 1; w++)
        for (let z = (_.min(zIndexes) || 0) - 1; z <= (_.max(zIndexes) || 0) + 1; z++)
            for (let y = (_.min(yIndexes) || 0) - 1; y <= (_.max(yIndexes) || 0) + 1; y++)
                for (let x = (_.min(xIndexes) || 0) - 1; x <= (_.max(xIndexes) || 0) + 1; x++) {
                    const neighbors = countActiveNeighbors(layout, [w, z, y, x]);
                    if (_.get(layout, `${w}.${z}.${y}.${x}`) == '#') _.set(newLayout, `${w}.${z}.${y}.${x}`, _.inRange(neighbors, 2, 4) ? '#' : '.');
                    else _.set(newLayout, `${w}.${z}.${y}.${x}`, neighbors == 3 ? '#' : '.');
                };
    return newLayout;
};

const count = (layout: object, value: string): number => {
    let total = 0;
    _.keys(layout).forEach(w => _.keys(_.get(layout, w)).forEach(z => _.keys(_.get(layout, `${w}.${z}`)).forEach(y => {
        total += _.countBy(_.values(_.get(layout, `${w}.${z}.${y}`)))[value] || 0;
    })));
    return total;
}

const process = (layout: object, cycleCount: number) => {
    let newLayout = _.cloneDeep(layout);
    for (let i = 1; i <= cycleCount; i++) {
        newLayout = cycle(newLayout);
        console.log(`Total active cells after stage ${i}: ${count(newLayout, '#')}`);
    }
};

let newLayout = _.cloneDeep(layout);
console.log(`Total active cells in initial state: ${count(newLayout, '#')}`);
process(newLayout, 6);