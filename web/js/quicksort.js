import { TurboList } from './turbolist.js';

function defaultHooks() { return { onPivot:()=>{}, onPartition:()=>{}, onDepth:()=>{} }; }

export function quicksort(arr, config = {}, hooks = {}) {
  const h = {...defaultHooks(), ...hooks};
  const list = arr instanceof TurboList ? arr : new TurboList(arr, h);
  const n = list.length();
  const depthLimit = config.introsort ? 2 * Math.floor(Math.log2(n)) : Infinity;
  const start = performance.now();
  qs(list, 0, n-1, depthLimit, config, h, 0);
  const end = performance.now();
  return {array:list.arr, metrics:{comparisons:list.comparisons, swaps:list.swaps, time:end-start}};
}

function qs(list, lo, hi, depthLeft, cfg, hooks, depth){
  if (lo >= hi) return;
  hooks.onDepth(depth);
  const size = hi - lo + 1;
  if (size <= (cfg.cutoff||0)) { insertion(list, lo, hi); return; }
  if (depthLeft <= 0) { heapSort(list, lo, hi); return; }
  const pivotIndex = choosePivot(list, lo, hi, cfg.pivot||'first');
  hooks.onPivot(pivotIndex);
  let pivotRegion;
  switch(cfg.partition){
    case 'hoare': pivotRegion = hoare(list, lo, hi, pivotIndex); break;
    case 'three': pivotRegion = threeWay(list, lo, hi, pivotIndex); break;
    default: pivotRegion = lomuto(list, lo, hi, pivotIndex);
  }
  hooks.onPartition(lo, hi);
  if (Array.isArray(pivotRegion)) {
    const [pLo,pHi] = pivotRegion;
    qs(list, lo, pLo-1, depthLeft-1, cfg, hooks, depth+1);
    qs(list, pHi+1, hi, depthLeft-1, cfg, hooks, depth+1);
  } else {
    const p = pivotRegion;
    qs(list, lo, p-1, depthLeft-1, cfg, hooks, depth+1);
    qs(list, p+1, hi, depthLeft-1, cfg, hooks, depth+1);
  }
}

function choosePivot(list, lo, hi, strategy){
  if (strategy==='last') return hi;
  if (strategy==='random') return lo + Math.floor(Math.random()*(hi-lo+1));
  if (strategy==='median3') {
    const mid = Math.floor((lo+hi)/2);
    return medianIndex(list, [lo, mid, hi]);
  }
  if (strategy==='median5') {
    const step = Math.floor((hi-lo)/4);
    return medianIndex(list, [lo, lo+step, lo+2*step, lo+3*step, hi]);
  }
  if (strategy==='mom') {
    const step = Math.max(1, Math.floor((hi-lo)/5));
    const group = [];
    for(let i=lo;i<=hi;i+=step) group.push(i);
    return medianIndex(list, group);
  }
  return lo; // first
}

function medianIndex(list, indices){
  const vals = indices.map(i=>list.arr[i]).sort((a,b)=>a-b);
  const medianVal = vals[Math.floor(vals.length/2)];
  return indices.find(i=>list.arr[i]===medianVal);
}

function lomuto(list, lo, hi, pivotIndex){
  list.swap(pivotIndex, hi);
  const pivot = list.arr[hi];
  let i = lo;
  for(let j=lo;j<hi;j++){
    if (list.arr[j] < pivot){ list.swap(i,j); i++; }
  }
  list.swap(i,hi);
  return i;
}

function hoare(list, lo, hi, pivotIndex){
  const pivot = list.arr[pivotIndex];
  let i = lo - 1;
  let j = hi + 1;
  while(true){
    do { i++; } while(list.arr[i] < pivot);
    do { j--; } while(list.arr[j] > pivot);
    if (i>=j) return j;
    list.swap(i,j);
  }
}

function threeWay(list, lo, hi, pivotIndex){
  const pivot = list.arr[pivotIndex];
  let lt = lo, i = lo, gt = hi;
  while(i<=gt){
    if (list.arr[i] < pivot){ list.swap(lt++, i++); }
    else if (list.arr[i] > pivot){ list.swap(i, gt--); }
    else i++;
  }
  return [lt, gt];
}

function insertion(list, lo, hi){
  for(let i=lo+1;i<=hi;i++){
    let j=i;
    while(j>lo && list.arr[j-1] > list.arr[j]){
      list.swap(j-1,j);
      j--;
    }
  }
}

function heapSort(list, lo, hi){
  const n = hi-lo+1;
  for(let i=Math.floor(n/2)-1;i>=0;i--) siftDown(list, lo, n, i);
  for(let end=n-1; end>0; end--){
    list.swap(lo, lo+end);
    siftDown(list, lo, end, 0);
  }
}
function siftDown(list, lo, n, i){
  while(true){
    let l=2*i+1, r=l+1, largest=i;
    if(l<n && list.arr[lo+l] > list.arr[lo+largest]) largest=l;
    if(r<n && list.arr[lo+r] > list.arr[lo+largest]) largest=r;
    if(largest===i) break;
    list.swap(lo+i, lo+largest);
    i=largest;
  }
}
