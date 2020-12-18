import * as fs from 'fs';
import _ from 'lodash';

const input = fs.readFileSync('./input.txt', 'utf-8');
const sections = input.split('\n\n');
const rawRules: string[] = sections[0].split('\n');
const myTicket: number[] = sections[1].split('\n')[1].split(',').map(Number);
const rawOtherTickets: string[] = _.tail(sections[2].split('\n'));
rawOtherTickets.pop();
const otherTickets: number[][] = rawOtherTickets.map(ticket => ticket.split(',').map(Number));

type ruleSet = { [id: string] : Function};

const parseRules = (rawRules: string[]): ruleSet => {
    const rules: ruleSet = {};
    rawRules.forEach(rule => {
        const [ruleName, rawValues] = rule.split(': ');
        const values = rawValues.split(' or ');
        const pairs: number[][] = [];
        values.forEach(value => pairs.push(value.split('-').map(Number)));
        rules[ruleName] = (val: number) => _.inRange(val, pairs[0][0], pairs[0][1] + 1) || _.inRange(val, pairs[1][0], pairs[1][1] + 1);
    });
    return rules;
};

const isValid = (value: number, rules: ruleSet): boolean => _.some(_.values(rules).map(rule => rule(value)));

const getInvalidValues = (ticket: number[], rules: ruleSet): number[] => _.filter(ticket, value => !isValid(value, rules));

const getScanningErrorRate = (tickets: number[][], rules: ruleSet): number => {
    let invalid: number[] = [];
    for (let i = 0; i < tickets.length; i++) invalid = invalid.concat(getInvalidValues(tickets[i], rules));
    return _.sum(invalid);
};

const areValuesValidForRule = (values: number[], rule: Function): boolean => _.every(values.map(value => rule(value)));

const possibleRules = (rules: ruleSet, tickets: number[][], index: number): string[] => {
    const values: number[] = tickets.map(ticket => ticket[index]);
    const validRules: string[] = _.compact(_.keys(rules).map(key => areValuesValidForRule(values, rules[key]) ? key : ''));
    return validRules;
};

const getDepartureFieldsProduct = (myTicket: number[], otherTickets: number[][], rules: ruleSet): number => {
    let product = 1;
    const validTickets = _.filter(otherTickets, ticket => getInvalidValues(ticket, rules).length == 0);
    const rulesToCheck = _.clone(rules);
    const indexesToCheck = _.range(0, myTicket.length);
    while(_.keys(rulesToCheck).length > 0) {
        indexesToCheck.forEach(index => {
            const possRules = possibleRules(rulesToCheck, validTickets, index);
            if (possRules.length == 1) {
                const rule: string = possRules[0];
                _.pull(indexesToCheck, index);
                delete rulesToCheck[rule];
                if (rule.includes('departure')) product *= myTicket[index];
            };
        });
    };
    return product;
};

const rules = parseRules(rawRules);
console.log(`Scanning error rate: ${getScanningErrorRate(otherTickets, rules)}`);
console.log(`Departure fields product: ${getDepartureFieldsProduct(myTicket, otherTickets, rules)}`);