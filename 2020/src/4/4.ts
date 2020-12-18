import * as fs from 'fs';
import * as _ from 'lodash';

const input = fs.readFileSync('./input.txt', 'utf-8');
const passports = input.split('\n\n');
const requiredKeys = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
const colorRegex = /#[a-f0-9]{6}/;
const validEyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
const pidRegex = /^[0-9]{9}$/;

const hasAllKeys = (entry: string) => {
    const passportData = entry.split(/\s/g);
    const keys = passportData.map(chunk => chunk.split(':')[0]);
    return _.difference(requiredKeys, keys).length === 0;
}

const isValid = (entry: string) => {
    const passportData = entry.split(/\s/g);
    const passport = _.fromPairs(passportData.map(chunk => chunk.split(':')));
    const keys = _.keys(passport);
    if (_.difference(requiredKeys, keys).length != 0) return false;
    if (!_.inRange(Number(passport.byr), 1920, 2003)) return false;
    if (!_.inRange(Number(passport.iyr), 2010, 2021)) return false;
    if (!_.inRange(Number(passport.eyr), 2020, 2031)) return false;
    const [height, unit] = _.words(passport.hgt);
    if (!(unit == 'cm' || unit == 'in')) return false;
    if (unit == 'cm' && !_.inRange(Number(height), 150, 194)) return false;
    if (unit == 'in' && !_.inRange(Number(height), 59, 77)) return false;
    if (!colorRegex.test(passport.hcl)) return false;
    if (!_.includes(validEyeColors, passport.ecl)) return false;
    if (!pidRegex.test(passport.pid)) return false;
    return true;
}

console.log("Passports with all keys: ", _.reduce(passports, (sum, passport) => hasAllKeys(passport) ? sum + 1 : sum, 0));
console.log("Valid passports: ", _.reduce(passports, (sum, passport) => isValid(passport) ? sum + 1 : sum, 0));