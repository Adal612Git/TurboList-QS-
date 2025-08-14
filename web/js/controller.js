import { quicksort } from './quicksort.js';
import { Visualizer } from './visualizer.js';
import { runPythonSort } from './py_runner.js';
import { runWasmSort } from './wasm_runner.js';

const canvas = document.getElementById('viz');
const viz = new Visualizer(canvas);
let currentData = [];

function genDataset(type){
  const n = 50;
  if(type==='random') return Array.from({length:n},()=>Math.floor(Math.random()*100));
  if(type==='few') { const vals=[1,2,3,4,5]; return Array.from({length:n},()=>vals[Math.floor(Math.random()*vals.length)]); }
  if(type==='reverse') return Array.from({length:n},(_,i)=>n-i);
  if(type==='almost'){ const arr=Array.from({length:n},(_,i)=>i); for(let i=0;i<5;i++){ const a=Math.floor(Math.random()*n); const b=Math.floor(Math.random()*n); [arr[a],arr[b]]=[arr[b],arr[a]];} return arr; }
  return [];
}

function loadDataset(){
  const type = document.getElementById('dataset-select').value;
  if(type==='file') return; // file handled separately
  currentData = genDataset(type);
  viz.setData(currentData);
}

function readConfig(){
  return {
    pivot: document.getElementById('pivot-select').value,
    partition: document.getElementById('partition-select').value,
    cutoff: parseInt(document.getElementById('cutoff').value,10)||0,
    introsort: document.getElementById('introsort').checked
  };
}

export function runQuickSort(arr){
  currentData = Array.from(arr);
  viz.setData(currentData);
  const cfg = readConfig();
  const hooks = {
    onPivot: i => viz.pushEvent({type:'pivot',index:i}),
    onSwap: (i,j) => viz.pushEvent({type:'swap',indices:[i,j]}),
  };
  const res = quicksort(currentData, cfg, hooks);
  document.getElementById('metrics').innerText = `comparisons: ${res.metrics.comparisons}, swaps: ${res.metrics.swaps}, time: ${res.metrics.time.toFixed(2)}ms`;
  viz.play();
}

async function sortHandler(){
  const cfg = readConfig();
  let engine = document.getElementById('engine-select').value;
  let status = '';
  let res;
  if(engine==='py'){
    res = await runPythonSort(currentData, cfg);
    if(!res){ engine='js'; status='Pyodide no disponible, usando JS'; }
  }
  if(engine==='wasm' && !res){
    res = await runWasmSort(currentData, cfg);
    if(!res){ engine='js'; status='WASM no disponible, usando JS'; }
  }
  if(engine==='js' || !res){
    const hooks = {
      onPivot: i => viz.pushEvent({type:'pivot',index:i}),
      onSwap: (i,j) => viz.pushEvent({type:'swap',indices:[i,j]}),
    };
    res = quicksort(currentData, cfg, hooks);
  }
  viz.setData(res.array);
  document.getElementById('metrics').innerText = `comparisons: ${res.metrics?.comparisons||0}, swaps: ${res.metrics?.swaps||0}, time: ${(res.metrics?.time||0).toFixed(2)}ms`;
  if(status) document.getElementById('status').innerText = status;
  viz.play();
}

function reset(){ viz.pause(); viz.setData(currentData); }
function play(){ viz.play(); }
function pause(){ viz.pause(); }
function step(){ viz.step(); }
function speed(){ viz.setSpeed(document.getElementById('speed-range').value); }
function exportTrace(){ const blob = new Blob([viz.export()],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='trace.json'; a.click(); URL.revokeObjectURL(url); }

// events
document.getElementById('dataset-select').addEventListener('change',e=>{ if(e.target.value==='file') document.getElementById('file-input').style.display='block'; else { document.getElementById('file-input').style.display='none'; loadDataset(); } });
document.getElementById('file-input').addEventListener('change',e=>{ const file=e.target.files[0]; if(!file) return; const reader=new FileReader(); reader.onload=()=>{ currentData=JSON.parse(reader.result); viz.setData(currentData); }; reader.readAsText(file); });
document.getElementById('sort-btn').addEventListener('click', sortHandler);
document.getElementById('reset-btn').addEventListener('click', reset);
document.getElementById('play-btn').addEventListener('click', play);
document.getElementById('pause-btn').addEventListener('click', pause);
document.getElementById('step-btn').addEventListener('click', step);
document.getElementById('speed-range').addEventListener('input', speed);
document.getElementById('export-btn').addEventListener('click', exportTrace);
document.getElementById('run-tests-btn').addEventListener('click',()=>{ if(window.runBrowserTests) window.runBrowserTests(); });

// init
loadDataset();

export { viz };
