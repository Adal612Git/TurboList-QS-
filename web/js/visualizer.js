export class Visualizer {
  constructor(canvas){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.data = [];
    this.events = [];
    this.timer = null;
    this.speed = 300;
  }
  setData(arr){
    this.data = Array.from(arr);
    this.draw();
  }
  pushEvent(ev){ this.events.push(ev); }
  draw(highlights={}){
    const {ctx, canvas} = this;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const w = canvas.width / this.data.length;
    const max = Math.max(...this.data,1);
    this.data.forEach((v,i)=>{
      const h = v/max*canvas.height;
      ctx.fillStyle = highlights.pivot===i ? '#dc3545' : '#0d6efd';
      ctx.fillRect(i*w, canvas.height-h, w-1, h);
    });
  }
  play(){
    if(this.timer) return;
    const step = ()=>{
      if(this.events.length===0){ this.pause(); return; }
      const ev = this.events.shift();
      this.apply(ev);
      this.timer = setTimeout(step, this.speed);
    };
    step();
  }
  pause(){ if(this.timer){ clearTimeout(this.timer); this.timer=null; } }
  step(){ if(this.events.length>0) this.apply(this.events.shift()); }
  apply(ev){
    if(ev.type==='swap'){ const [i,j]=ev.indices; [this.data[i],this.data[j]]=[this.data[j],this.data[i]]; this.draw(); }
    if(ev.type==='pivot'){ this.draw({pivot:ev.index}); }
  }
  setSpeed(ms){ this.speed = ms; }
  export(){ return JSON.stringify(this.events); }
}
