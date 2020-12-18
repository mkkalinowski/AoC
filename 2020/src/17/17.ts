import * as fs from 'fs';
import _ from 'lodash';

const input = fs.readFileSync('./input.txt', 'utf-8');
const rawLayout: string[] = input.split('\n');
rawLayout.pop();

type coordinates = [number, number, number];

let layout = {};
rawLayout.map((row, y) => row.split('').map((value, x) => _.set(layout, `0.${y - 1}.${x - 1}`, value)));

const showState = (layout: object) => _.sortBy(_.keys(layout).map(Number)).forEach(z => {
    console.log(`Z = ${z}`);
    _.sortBy(_.keys(_.get(layout, z)).map(Number)).forEach(y => {
        console.log(`Y=${y.toString().padStart(3, ' ')}: `, _.sortBy(_.keys(_.get(layout, `${z}.${y}`))).map(x => _.get(layout, `${z}.${y}.${x}`)).join(''));
    });
});

const countActiveNeighbors = (layout: object, coords: coordinates): number => {
    let total = 0;
    for (let z = coords[0] - 1; z <= coords[0] + 1; z++)
        for (let y = coords[1] -1; y <= coords[1] + 1; y++)
            for (let x = coords[2] -1; x <= coords[2] + 1; x++)
                if (_.get(layout, `${z}.${y}.${x}`) == '#') total++;
    if (_.get(layout, `${coords[0]}.${coords[1]}.${coords[2]}`) == '#') total--;
    return total;
};

const cycle = (layout: object): object => {
    const newLayout = _.cloneDeep(layout);
    const zIndexes: number[] = _.keys(layout).map(Number);
    const yIndexes: number[] = _.keys(_.get(layout, 0)).map(Number);
    const xIndexes: number[] = _.keys(_.get(layout, '0.0')).map(Number);
    for (let z = (_.min(zIndexes) || 0) - 1; z <= (_.max(zIndexes) || 0) + 1; z++)
        for (let y = (_.min(yIndexes) || 0) - 1; y <= (_.max(yIndexes) || 0) + 1; y++)
            for (let x = (_.min(xIndexes) || 0) - 1; x <= (_.max(xIndexes) || 0) + 1; x++) {
                const neighbors = countActiveNeighbors(layout, [z, y, x]);
                if (_.get(layout, `${z}.${y}.${x}`) == '#') _.set(newLayout, `${z}.${y}.${x}`, _.inRange(neighbors, 2, 4) ? '#' : '.');
                else _.set(newLayout, `${z}.${y}.${x}`, neighbors == 3 ? '#' : '.');
            };
    return newLayout;
};

const count = (layout: object, value: string): number => {
    let total = 0;
    _.keys(layout).forEach(z => _.keys(_.get(layout, z)).forEach(y => {
        total += _.countBy(_.values(_.get(layout, `${z}.${y}`)))[value] || 0;
    }));
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
console.log('Initial state:');
showState(newLayout);
console.log(`Total active cells: ${count(newLayout, '#')}`);
process(newLayout, 6);