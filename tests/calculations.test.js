import test from 'node:test';import assert from 'node:assert/strict';import {totals,requiredGpa} from '../src/utils/calculations.js';
test('GPA weights courses and CGPA weights all credits',()=>{const semesters=[{subjects:[{credits:3,points:4},{credits:1,points:2}]},{subjects:[{credits:12,points:3}]}];assert.equal(totals([semesters[0]]).gpa,3.5);assert.deepEqual(totals(semesters),{credits:16,gpa:3.125});});
test('empty academic record is safe',()=>assert.deepEqual(totals([]),{credits:0,gpa:0}));
test('planner solves weighted target and reports impossible targets numerically',()=>{assert.equal(requiredGpa(3.2,45,3.4,15),4);assert.ok(requiredGpa(3,45,3.8,15)>4);assert.ok(requiredGpa(4,45,2,15)<0);assert.equal(requiredGpa(0,0,3.5,15),3.5);});
test('planner rejects invalid credit inputs',()=>{assert.throws(()=>requiredGpa(3,45,3.5,0));assert.throws(()=>requiredGpa(NaN,45,3.5,15));assert.throws(()=>requiredGpa(3,-1,3.5,15));});
