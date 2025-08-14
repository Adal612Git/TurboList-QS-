let pyodide;

export async function runPythonSort(arr, cfg){
  try{
    if(!pyodide){
      pyodide = await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'});
      const code = `
import json

def quicksort(a):
    if len(a)<=1:
        return a
    pivot=a[len(a)//2]
    left=[x for x in a if x<pivot]
    mid=[x for x in a if x==pivot]
    right=[x for x in a if x>pivot]
    return quicksort(left)+mid+quicksort(right)
`;
      await pyodide.runPythonAsync(code);
    }
    pyodide.globals.set('input_list', arr);
    const out = await pyodide.runPythonAsync('quicksort(list(input_list))');
    return {array:[...out.toJs()]};
  }catch(e){
    console.warn('Pyodide fail',e);
    return null;
  }
}
