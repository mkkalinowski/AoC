import * as fs from 'fs';
import _ from 'lodash';

const input = fs.readFileSync('./input.txt', 'utf-8');
const rawRules = input.split('\n');
rawRules.pop();
const rules = {};

rawRules.map(rule => {
    const [name, rawBags] = rule.replace('.', '').replace('bags', 'bag').split(' bag contain ');
    const bags = rawBags.split(', ');
    const bagRules = {};
    bags.map(bag => {
        const [count, ...name] = bag.replace(' bag', '').split(' ');
        const fullName = _.trimEnd(name.join(' '), 's');
        if (count != 'no') _.set(bagRules, fullName, Number(count));
    });
    _.set(rules, name, bagRules);
});

const topLevelColours: string[] = [];

const mapColours = (bag: string) => {
    const bags: string[] = [];
    _.forIn(rules, (value, key) => {
        if (_.has(value, bag)) {
            bags.push(key);
            topLevelColours.push(key);
        }
    });
    _.map(bags, mapColours);
};

const howMany = (bag: string): number => {
    let total = 0;
    const rule = _.get(rules, bag); 
    _.forIn(rule, (value, key) => {
        total += value + (value * howMany(key));
    });
    return total;
};

mapColours('shiny gold')
console.log(`Colours that can contain shiny gold bag: ${_.uniq(topLevelColours).length}`);
const total = howMany('shiny gold');
console.log(`Number of bags required in a shiny gold bag: ${total}`);