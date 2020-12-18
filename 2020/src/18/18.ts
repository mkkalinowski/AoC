import * as fs from 'fs';
import _ from 'lodash';

const input = fs.readFileSync('./input.txt', 'utf-8');
const expressions: string[] = input.split('\n');
expressions.pop();

type solveFunction = (arg0: string) => number;

const parenthesesRegex = /\(([^()]+)\)/;
const additionRegex = /\d+\ \+\ \d+/;;

const solve: solveFunction = (expression: string): number => {
    const parentheses = expression.match(parenthesesRegex);
    if (parentheses != null) return solve(expression.replace(parentheses[0], solve(parentheses[1]).toString()));
    let total = null;
    let expr = expression.split(' ');
    for (let i = 0; i < expr.length; i++) {
        if (total == null) total = Number(expr[i]);
        else if (expr[i] == '+') total += Number(expr[++i]);
        else if (expr[i] == '*') total *= Number(expr[++i]);
    };
    return total || 0;
};

const solvePlusPrecedence: solveFunction = (expression: string): number => {
    const parentheses = expression.match(parenthesesRegex);
    if (parentheses != null) return solvePlusPrecedence(expression.replace(parentheses[0], solvePlusPrecedence(parentheses[1]).toString()));
    const addition = expression.match(additionRegex);
    if (addition != null && expression != addition[0]) return solvePlusPrecedence(expression.replace(addition[0], solvePlusPrecedence(addition[0]).toString()));
    let total = null;
    let expr = expression.split(' ');
    for (let i = 0; i < expr.length; i++) {
        if (total == null) total = Number(expr[i]);
        else if (expr[i] == '+') total += Number(expr[++i]);
        else if (expr[i] == '*') total *= Number(expr[++i]);
    };
    return total || 0;
};

const sum = (expressions: string[], solveFunction: solveFunction): number => _.sum(expressions.map(solveFunction));

console.log(`Sum of all expressions: ${sum(expressions, solve)}`);
console.log(`Sum of all expressions with plus operation precedence: ${sum(expressions, solvePlusPrecedence)}`);