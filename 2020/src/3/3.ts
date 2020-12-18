import * as fs from 'fs';

const input = fs.readFileSync('./input.txt', 'utf-8');
const rows = input.split('\n');
const width = rows[0].length;
rows.pop();

const getData = (x: number, y: number) => rows[y][x%width];

const traverse = (xSpd: number, ySpd: number) => {
    let x = 0;
    let y = 0;
    let trees = 0;
    while (y < rows.length - ySpd) {
        y += ySpd;
        x += xSpd;
        if (getData(x, y) == '#') trees++;
    }
    return trees;
}

const product = traverse(1, 1) * traverse(3, 1) * traverse(5, 1) * traverse(7, 1) * traverse(1, 2);

console.log(product);