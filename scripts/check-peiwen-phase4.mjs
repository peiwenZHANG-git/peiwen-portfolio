import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const { chromium } = createRequire(import.meta.url)('playwright');
const out = 'visualizations/peiwen-phase4';
await mkdir(out, { recursive: true });
const frozen = JSON.parse(await readFile('public/peiwen-phase1/frozen-master-sha256.json','utf8'));
for (const [file, hash] of Object.entries(frozen)) assert.equal(createHash('sha256').update(await readFile(file)).digest('hex'), hash);
const browser = await chromium.launch({channel:'msedge',headless:true});
const errors=[];
const setup = async context => {
  const p=await context.newPage();
  p.on('pageerror', e=>errors.push(e.message));
  p.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
  await p.goto('http://localhost:3000/?peiwen-phase4=1');
  await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
  await p.waitForSelector('[data-ready=true]');
  await p.addStyleTag({content:'nextjs-portal{display:none!important}'});
  return p;
};
const settled=(p,s)=>p.waitForSelector(`[data-phase-one][data-state="${s}"][data-moving=false]`,{timeout:10000});
const about=async p=>{const r=await p.locator('[data-about-hit]').boundingBox();await p.mouse.move(r.x+65,r.y+90);};
const goto=async(p,s)=>{if(s==='ABOUT_HOVER'){await p.mouse.move(760,100);await about(p);}else await p.keyboard.press(s==='LEFT_PREVIEW'?'ArrowLeft':s==='RIGHT_PREVIEW'?'ArrowRight':'Escape');await settled(p,s);};
const results=[];
try {
  const warm=await browser.newContext();await setup(warm);await warm.close();
  const context=await browser.newContext({viewport:{width:1536,height:1024},recordVideo:{dir:out,size:{width:1536,height:1024}}});
  const p=await setup(context);
  await p.mouse.move(760,100);
  await p.waitForTimeout(200);
  await p.keyboard.press('ArrowLeft');await settled(p,'LEFT_PREVIEW');
  await about(p);await settled(p,'ABOUT_HOVER');
  await p.keyboard.press('ArrowRight');await p.waitForSelector('[data-moving=true]');
  await p.waitForTimeout(850);await p.screenshot({path:`${out}/left-to-right.png`});
  await settled(p,'RIGHT_PREVIEW');
  await goto(p,'ABOUT_HOVER');await settled(p,'ABOUT_HOVER');
  await p.keyboard.press('Escape');await settled(p,'IDLE');
  await p.screenshot({path:`${out}/return-idle.png`});
  await p.waitForTimeout(250);
  const video=p.video();await context.close();await video.saveAs(`${out}/continuous-review.webm`);
  if(process.argv.includes('--record-only')){await browser.close();console.log('Recording refreshed; verification not rerun in record-only mode.');process.exit(0);}

  const checks=await browser.newContext({viewport:{width:1536,height:1024}});
  const q=await setup(checks);
  // Frame audit checks physical continuity and exclusive overlay ownership.
  await q.evaluate(()=>{
    window.phase4Frames=[];window.phase4Audit=true;
    const sample=()=>{if(!window.phase4Audit)return;const root=document.querySelector('[data-phase-one]');const walker=document.querySelector('[data-walker]');const layer=document.querySelector('[data-layer]');const pose=document.querySelector('[data-about-overlay] > div');window.phase4Frames.push({t:performance.now(),x:new DOMMatrix(getComputedStyle(walker).transform).m41,state:root.dataset.state,moving:root.dataset.moving,walk:getComputedStyle(layer).visibility==='visible',about:Number(getComputedStyle(pose).opacity)});requestAnimationFrame(sample);};sample();
  });
  const pairs=[['IDLE','LEFT_PREVIEW'],['LEFT_PREVIEW','IDLE'],['IDLE','RIGHT_PREVIEW'],['RIGHT_PREVIEW','IDLE'],['IDLE','ABOUT_HOVER'],['ABOUT_HOVER','IDLE'],['LEFT_PREVIEW','RIGHT_PREVIEW'],['RIGHT_PREVIEW','LEFT_PREVIEW'],['LEFT_PREVIEW','ABOUT_HOVER'],['RIGHT_PREVIEW','ABOUT_HOVER'],['ABOUT_HOVER','LEFT_PREVIEW'],['ABOUT_HOVER','RIGHT_PREVIEW']];
  for(const [from,to] of pairs){
    await goto(q,from);
    const start=await q.evaluate(()=>window.phase4Frames.length);
    if(from==='LEFT_PREVIEW'&&to==='ABOUT_HOVER'){
      await about(q);await q.waitForSelector('[data-moving=true]');await q.waitForTimeout(450);await q.screenshot({path:`${out}/left-to-about.png`});await settled(q,to);
    }else if(from==='ABOUT_HOVER'&&to==='RIGHT_PREVIEW'){
      await q.keyboard.press('ArrowRight');await q.waitForSelector('[data-moving=true]');await q.waitForTimeout(500);await q.screenshot({path:`${out}/about-to-right.png`});await settled(q,to);
    }else await goto(q,to);
    if((from==='LEFT_PREVIEW'&&to==='RIGHT_PREVIEW')||(from==='RIGHT_PREVIEW'&&to==='LEFT_PREVIEW')){
      assert.ok(await q.evaluate(start=>window.phase4Frames.slice(start).every(f=>f.state!=='IDLE'&&f.walk),start),'Cross-direction stopped in Idle');
    }
    results.push(`${from} -> ${to}: PASS`);
  }
  await q.mouse.move(760,100);await q.waitForTimeout(200);
  for(const [s,name] of [['LEFT_PREVIEW','left'],['RIGHT_PREVIEW','right'],['ABOUT_HOVER','about'],['IDLE','idle']]){await goto(q,s);await q.screenshot({path:`${out}/${name}-regression.png`});}
  // Latest input, not a queued replay of every intermediate request.
  await q.keyboard.press('ArrowLeft');await q.waitForSelector('[data-moving=true]');
  await q.keyboard.press('ArrowRight');await q.keyboard.press('ArrowLeft');await settled(q,'LEFT_PREVIEW');
  await q.waitForTimeout(350);assert.equal(await q.locator('[data-phase-one]').getAttribute('data-state'),'LEFT_PREVIEW');
  await goto(q,'IDLE');
  await q.mouse.move(350,650);await q.waitForSelector('[data-moving=true]');
  await q.mouse.move(1200,650);await about(q);await q.mouse.move(350,650);await q.mouse.move(1200,650);
  await settled(q,'RIGHT_PREVIEW');
  await q.waitForTimeout(350);assert.equal(await q.locator('[data-about-overlay]').getAttribute('data-active'),'false');
  await goto(q,'IDLE');
  await q.getByRole('button',{name:'Preview Peiwen walking right'}).focus();await q.keyboard.press('Tab');await settled(q,'ABOUT_HOVER');
  await q.keyboard.press('ArrowRight');await settled(q,'RIGHT_PREVIEW');await goto(q,'IDLE');
  const frames=await q.evaluate(()=>{window.phase4Audit=false;return window.phase4Frames;});
  assert.ok(frames.length>100,'Continuous frame audit missing');
  assert.ok(!frames.some(f=>f.walk&&f.about>.025),'Walking and About overlays competed');
  for(let i=1;i<frames.length;i++)assert.ok(Math.abs(frames[i].x-frames[i-1].x)<=.06*(frames[i].t-frames[i-1].t)+3,'Character position jumped');
  await writeFile(`${out}/transition-frames.json`,JSON.stringify(frames));
  await about(q);await settled(q,'ABOUT_HOVER');await q.reload();await q.waitForSelector('[data-ready=true]');await q.waitForTimeout(400);await settled(q,'IDLE');
  await q.mouse.move(862,695);await settled(q,'ABOUT_HOVER');await q.keyboard.press('Escape');await settled(q,'IDLE');await q.waitForTimeout(400);await settled(q,'IDLE');
  await q.emulateMedia({reducedMotion:'reduce'});
  for(const s of ['LEFT_PREVIEW','RIGHT_PREVIEW','ABOUT_HOVER','LEFT_PREVIEW','IDLE'])await goto(q,s);
  await q.emulateMedia({reducedMotion:'no-preference'});
  await q.addStyleTag({content:'nextjs-portal{display:none!important}'});
  await q.screenshot({path:`${out}/final-idle.png`});
  await checks.close();
  const touchContext=await browser.newContext({viewport:{width:1536,height:1024},hasTouch:true,isMobile:true});const touch=await setup(touchContext);
  await touch.touchscreen.tap(858,690);await touch.waitForTimeout(350);await settled(touch,'IDLE');
  await touch.touchscreen.tap(350,650);await settled(touch,'LEFT_PREVIEW');await touch.touchscreen.tap(780,490);await settled(touch,'IDLE');await touchContext.close();
  assert.deepEqual(errors,[]);
}finally{await browser.close();}
const pixels=f=>sharp(f).removeAlpha().raw().toBuffer();
const idle=await pixels('design-assets/peiwen-phase1/frozen-idle-baseline.png');
for(const name of ['return-idle','idle-regression','final-idle'])assert.ok(idle.equals(await pixels(`${out}/${name}.png`)),name);
for(const name of ['left','right','about'])assert.ok((await pixels(`${out}/baselines/${name}.png`)).equals(await pixels(`${out}/${name}-regression.png`)),`${name} approved regression`);
await writeFile(`${out}/verification.json`,JSON.stringify({transitions:results,visualPixelEquality:'PASS',frameContinuityAndExclusiveOwnership:'PASS',noIdleStopBetweenDirections:'PASS',keyboardFocusEscape:'PASS',latestIntent:'PASS',hoverArming:'PASS',reducedMotion:'PASS',touch:'PASS',browserErrors:errors,humanApproval:'PENDING'},null,2)+'\n');
console.log('All 12 transitions and four frozen visual states PASS; keyboard/focus/latest intent/gating/reduced motion/touch PASS.');
