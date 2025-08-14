window.runBrowserTests = async function(){
  const { quicksort } = await import('./quicksort.js');
  describe('quicksort', ()=>{
    it('ordena array pequeño', ()=>{
      const res = quicksort([3,1,2]);
      expect(res.array).to.deep.equal([1,2,3]);
    });
    it('maneja vacío', ()=>{
      const res = quicksort([]);
      expect(res.array).to.deep.equal([]);
    });
    it('property sort', ()=>{
      fc.assert(fc.property(fc.array(fc.integer()), a => {
        const res = quicksort(a.slice());
        const sorted = a.slice().sort((x,y)=>x-y);
        return JSON.stringify(res.array) === JSON.stringify(sorted);
      }));
    });
  });
  mocha.run();
};
