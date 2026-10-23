import assert from 'node:assert/strict';
import {seedData,calculate} from './analytics/analytics.js';
const state=seedData();const result=calculate(state,[{article:'21930',quantity:10}]);let checks=0;
for(const r of state.mathSnapshot.slice(4)){if(!r[0])continue;const found=result.materials.find(x=>x.article===String(r[0]));assert.ok(found,'Missing '+r[0]);for(const [key,col]of [['total',2],['required',3],['available',4],['deficit',5]]){assert.ok(Math.abs(found[key]-Number(r[col]||0))<1e-6,`${r[0]} ${key}: ${found[key]} != ${r[col]}`);checks++;}}
const custom={catalogs:[{id:'P',name:'P',components:[{article:'A(1)',name:'assembly',quantity:2},{article:'B(1)',name:'assembly2',quantity:1}]},{id:'A(1)',name:'A',components:[{article:'M',name:'material',quantity:3}]},{id:'B(1)',name:'B',components:[{article:'A(1)',name:'A',quantity:1}]}],stock:[{article:'A',quantity:2},{article:'M',quantity:1}]};
const m=calculate(custom,[{article:'P',quantity:1}]).materials[0];assert.equal(m.total,9);assert.equal(m.required,3);assert.equal(m.deficit,2);checks+=3;
custom.catalogs[1].components=[{article:'P',name:'cycle',quantity:1}];assert.throws(()=>calculate(custom,[{article:'P',quantity:1}]),/Циклический/);checks++;
console.log(`PASS: ${checks} analytics assertions, including comparison with imported math.`);
