import assert from 'node:assert/strict';
import { test } from 'node:test';
import { once } from 'node:events';
import { app } from './app.js';
import { DatabaseSync } from 'node:sqlite';
import express from 'express';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { registerAnalytics } from './analytics/analytics.js';

test('analytics permissions, validation, version conflicts, serial allocation and rollback', async () => {
 const server=app.listen(0,'127.0.0.1'); await once(server,'listening');
 const base=`http://127.0.0.1:${server.address().port}`;
 const request=async(path,token,method='GET',body,status=200)=>{const r=await fetch(base+path,{method,headers:{...(token?{Authorization:`Bearer ${token}`} : {}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined}); const data=await r.json();assert.equal(r.status,status,JSON.stringify(data));return data;};
 try {
 const admin=(await request('/users/login',null,'POST',{email:'admin@gmail.com',password:'123'})).accessToken;
 const user=(await request('/users/login',null,'POST',{email:'user1@gmail.com',password:'123'})).accessToken;
 for(const token of [null,user]) {const status=token?403:401;await request('/analytics',token,'GET',null,status);await request('/analytics/stock',token,'PUT',{rows:[]},status);}
 let state=await request('/analytics',admin);assert.equal(state.catalogs.length,37);
 await request('/analytics/calculate?article=21930&quantity=10',admin);
 await request('/analytics/planning?from=1&to=15',admin);
 await request('/analytics/calculate?article=21930&quantity=-1',admin,'GET',null,400);
 await request('/analytics/stock',admin,'PUT',{rows:[],version:state.version},400);
 await request('/analytics/stock',admin,'PUT',{rows:state.stock,version:0},409);
 state=await request('/analytics/stock',admin,'PUT',{rows:state.stock,version:state.version});
 const previous=state.version;
 state=await request('/analytics/serial/issue',admin,'POST',{article:'22166',quantity:2,employee:'Test',version:state.version});
 assert.equal(state.history[0].from,118933);assert.equal(state.history[0].to,118934);
 await request('/analytics/serial/issue',admin,'POST',{article:'22166',quantity:1,employee:'Test',version:previous},409);
 await request('/analytics/serial/issue',admin,'POST',{article:'22166',quantity:1000,employee:'Test',version:state.version},400);
 const item=state.catalogs.find(c=>c.id==='22527(2)');
 await request('/analytics/catalog/'+encodeURIComponent(item.id),admin,'PUT',{item:{...item,components:[{article:item.id,name:'Cycle',quantity:1}]},version:state.version},400);
 state=await request('/analytics/catalog/'+encodeURIComponent(item.id),admin,'PUT',{item:{...item,name:'Edited assembly'},version:state.version});
 state=await request('/analytics/plan',admin,'PUT',{rows:state.plan,version:state.version});
 await request('/analytics/unknown',admin,'PUT',{version:state.version},404);
 const unchanged=await request('/analytics',admin);assert.equal(unchanged.version,state.version);
 assert.ok(state.audit.length>=4);
 } finally {await new Promise(resolve=>server.close(resolve));}
});

test('analytics edits persist after closing and reopening the database', async () => {
 const folder=mkdtempSync(join(tmpdir(),'analytics-storage-'));
 const file=join(folder,'test.sqlite');
 const open=async()=>{const db=new DatabaseSync(file);const instance=express();instance.use(express.json());registerAnalytics(instance,db,(req,res,next)=>{req.user={email:'admin@test'};next();},(req,res,next)=>next());const server=instance.listen(0,'127.0.0.1');await once(server,'listening');return {db,server,url:'http://127.0.0.1:'+server.address().port+'/analytics'};};
 let running;
 try {
 running=await open();const state=await (await fetch(running.url)).json();
 const saved=await fetch(running.url+'/stock',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({version:state.version,rows:[{article:'TEST',name:'Saved stock',quantity:42}]})});assert.equal(saved.status,200);
 await new Promise(resolve=>running.server.close(resolve));running.db.close();running=null;
 running=await open();const restored=await (await fetch(running.url)).json();assert.equal(restored.version,state.version+1);assert.deepEqual(restored.stock,[{article:'TEST',name:'Saved stock',quantity:42}]);assert.equal(restored.audit.length,1);
 } finally {if(running){await new Promise(resolve=>running.server.close(resolve));running.db.close();}rmSync(folder,{recursive:true,force:true});}
});
