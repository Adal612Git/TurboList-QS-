export async function runWasmSort(arr, cfg){
  try{
    const resp = await fetch('wasm/turbolist.wasm');
    const buffer = await resp.arrayBuffer();
    const mod = await WebAssembly.instantiate(buffer, {});
    const { memory, sort } = mod.instance.exports;
    if(!memory || !sort) return null;
    const heap = new Uint32Array(memory.buffer);
    heap.set(arr,0);
    sort(arr.length);
    const out = Array.from(heap.slice(0, arr.length));
    return {array:out};
  }catch(e){
    console.warn('WASM fail',e);
    return null;
  }
}
