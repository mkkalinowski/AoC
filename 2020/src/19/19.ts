import * as fs from 'fs';
import _ from 'lodash';

const input = fs.readFileSync('./input.txt', 'utf-8');
const [rawRules, rawExamples]: string[] = input.split('\n\n');
const rules = rawRules.split('\n');
const examples = rawExamples.split('\n');
const maxDepth = 16;
examples.pop();

const parseRules = (rules: string[]): {[id: string]: string} => {
    const output = {};
    rules.forEach(rule => {
        const [index, value] = rule.split(': ');
        _.set(output, index, value.replace('"', '').replace('"', ''));
    });
    return output;
};

const getRule = (rules: {[id: string]: string}, ruleId: string, depth: number): string[] => {
    if (depth > maxDepth) return [];
    const rule = _.get(rules, ruleId);
    if (rule == 'a' || rule === 'b') return [rule];
    else if (rule.includes('|')) {
        let result = [];
        const [ruleSet1, ruleSet2] = rule.split(' | ');
        result.push('(');
        const part1 = ruleSet1.split(' ').map(r => getRule(rules, r, depth + 1));
        result = _.concat(result, _.flatten(part1));
        result.push('|')
        const part2 = ruleSet2.split(' ').map(r => getRule(rules, r, depth + 1));
        result = _.concat(result, _.flatten(part2));
        result.push(')');
        return result;
    }
    else return _.flatten(rule.split(' ').map(r => getRule(rules, r, depth + 1)));
};

const getRegexp = (rule: string[]): RegExp => new RegExp(`^${rule.join('')}$`);

const countValid = (values: string[], regExp: RegExp): number => _.filter(values, value => regExp.test(value)).length;

const parsedRules = parseRules(rules);
const ruleRegexp = getRegexp(getRule(parsedRules, '0', 0));
console.log(`Valid values: ${countValid(examples, ruleRegexp)}`);

_.set(parsedRules, '8', '42 | 42 8');
_.set(parsedRules, '11', '42 31 | 42 11 31');
const loopRegexp = getRegexp((getRule(parsedRules, '0', 0)));
console.log(`Valid values with looped rules: ${countValid(examples, loopRegexp)}`);