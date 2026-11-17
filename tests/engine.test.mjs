import {test} from 'node:test';
import assert from 'node:assert/strict';
import {extractSkills,analyzeProfile,getPlan,getReflectionQuestions} from '../engine.mjs';
import {sampleText,roles} from '../data.mjs';

test('extracts skills in Russian and English',()=>{
  const found=extractSkills('Делала презентации, работала с SQL, Python, Power BI и API.');
  for(const skill of ['python','sql','bi','api','communication']) assert.ok(found.includes(skill),skill);
});
test('does not confuse short aliases with substrings in ordinary words',()=>{
  const found=extractSkills('Sending email from a digital marketing app.');
  for(const skill of ['ai','git','js','ux','api']) assert.ok(!found.includes(skill),skill);
});
test('recognizes standalone AI abbreviations',()=>{
  assert.ok(extractSkills('Знакома с ИИ, ML и API.').includes('ai'));
});
test('compares six fictional study profiles with bounded coverage',()=>{
  const result=analyzeProfile(sampleText);
  assert.equal(result.ranked.length,roles.length);
  assert.ok(result.ranked.every(r=>r.coverage>=0 && r.coverage<=100));
  assert.ok(result.ranked.every(r=>r.matched.length+r.missing.length===r.req.length));
  assert.ok(result.ranked.every((r,i,arr)=>i===0||arr[i-1].rankScore>=r.rankScore));
});
test('returns a practice plan and reflection questions',()=>{
  const result=analyzeProfile('Я проводила опросы, исследования, делала презентации и дашборды в Excel.');
  assert.ok(getPlan(result.top).length>=1);
  assert.equal(getReflectionQuestions(result.top).length,3);
});
test('rejects empty, short and oversized input',()=>{
  assert.throws(()=>analyzeProfile(''),/30 символов/);
  assert.throws(()=>analyzeProfile('SQL и Python'),/30 символов/);
  assert.throws(()=>analyzeProfile('x'.repeat(5001)),/5000/);
});
