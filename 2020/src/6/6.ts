import * as fs from 'fs';
import _ from 'lodash';

const input = fs.readFileSync('./input.txt', 'utf-8');
const answers = input.split('\n\n').map(a => a.split('\n'));
answers[answers.length - 1].pop();

const reduceAnswers = (reduceMethod: any) => {
    return _.reduce(answers, reduceMethod, 0);
};

const sumAnswers = (value: number, group: string[]) => value + _.uniq(group.join('').split('')).length;

const sameAnswers = (value: number, group: string[]) => {
    let total = 0;
    const counts = _.countBy(group.join('').split(''), _.identity);
    _.values(counts).forEach((value) => {
        if (value == group.length) total++;
    });
    return value + total;
};

console.log(reduceAnswers(sumAnswers));
console.log(reduceAnswers(sameAnswers));