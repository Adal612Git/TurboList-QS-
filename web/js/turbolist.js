export class TurboList {
  constructor(arr, hooks = {}) {
    this.arr = Array.from(arr);
    this.hooks = hooks;
    this.comparisons = 0;
    this.swaps = 0;
  }
  length() { return this.arr.length; }
  compare(i, j) {
    this.comparisons++;
    const v = this.arr[i] - this.arr[j];
    if (this.hooks.onCompare) this.hooks.onCompare(i, j);
    return v;
  }
  swap(i, j) {
    this.swaps++;
    [this.arr[i], this.arr[j]] = [this.arr[j], this.arr[i]];
    if (this.hooks.onSwap) this.hooks.onSwap(i, j);
  }
  sliceView(lo, hi) {
    return { arr: this.arr, lo, hi };
  }
}
