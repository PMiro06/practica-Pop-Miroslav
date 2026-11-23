const $=s=>document.querySelector(s);
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
function opts(g,i){const r=i/9|0,c=i%9;let m=0;for(let k=0;k<9;k++){m|=1<<g[r*9+k];m|=1<<g[k*9+c]}
const br=r-r%3,bc=c-c%3;for(let a=0;a<3;a++)for(let b=0;b<3;b++)m|=1<<g[(br+a)*9+bc+b];
const o=[];for(let v=1;v<=9;v++)if(!(m>>v&1))o.push(v);return o}
// backtracking cu euristica MRV: numără soluțiile până la lim
function count(g,lim,rnd,out){let n=0;
(function rec(){if(n>=lim)return;let bi=-1,bo=null;
for(let i=0;i<81;i++)if(!g[i]){const o=opts(g,i);if(!bo||o.length<bo.length){bi=i;bo=o;if(o.length<2)break}}
if(bi<0){n++;if(out&&n===1)out.push(...g);return}
if(rnd)shuffle(bo);
for(const v of bo){g[bi]=v;rec();if(n>=lim)break}
g[bi]=0})();return n}
function generate(clues){const sol=[];count(Array(81).fill(0),1,true,sol);
const p=sol.slice();let left=81;
for(const i of shuffle([...Array(81).keys()])){if(left<=clues)break;
const b=p[i];p[i]=0;if(count(p.slice(),2)!==1)p[i]=b;else left--}
return{p,sol}}
let given,sol,cur,sel=-1;
const grid=$("#grid");
for(let i=0;i<81;i++){const b=document.createElement("button");const r=i/9|0,c=i%9;
b.className="c"+(c%3===2?" r2":"")+(r%3===2?" b2":"")+(c===8?" cl3":"")+(r===8?" rw3":"");
b.onclick=()=>{sel=i;draw()};grid.appendChild(b)}
const pad=$("#pad");
for(let v=1;v<=9;v++){const k=document.createElement("button");k.className="k";k.textContent=v;k.onclick=()=>put(v);pad.appendChild(k)}
const er=document.createElement("button");er.className="k";er.textContent="Șterge";er.style.fontSize="1rem";er.onclick=()=>put(0);pad.appendChild(er);
function put(v){if(sel<0||given[sel])return;cur[sel]=v;msg("");draw();if(!cur.includes(0)&&conflicts().size===0)msg("Bravo, ai rezolvat puzzle-ul!")}
function conflicts(){const bad=new Set();
for(let i=0;i<81;i++){const v=cur[i];if(!v)continue;const r=i/9|0,c=i%9;
for(let j=0;j<81;j++){if(j===i||cur[j]!==v)continue;
if((j/9|0)===r||j%9===c||((j/9|0)/3|0)===(r/3|0)&&(j%9/3|0)===(c/3|0))bad.add(i)}}
return bad}
function draw(wrong){const bad=conflicts();const cells=grid.children;
for(let i=0;i<81;i++){const e=cells[i];e.textContent=cur[i]||"";
let cl=e.className.replace(/ (g|p|s|x)\b/g,"");
if(given[i])cl+=" g";
if(sel>=0){const r=i/9|0,c=i%9,sr=sel/9|0,sc=sel%9;
if(i===sel)cl+=" s";else if(r===sr||c===sc||((r/3|0)===(sr/3|0)&&(c/3|0)===(sc/3|0)))cl+=" p"}
if(bad.has(i)||(wrong&&wrong.has(i)))cl+=" x";
e.className=cl;e.setAttribute("aria-label","Rând "+((i/9|0)+1)+", coloana "+(i%9+1)+(cur[i]?", valoarea "+cur[i]:", gol"))}}
function msg(t){$("#msg").textContent=t}
function start(){msg("Se generează...");setTimeout(()=>{const r=generate(+$("#lvl").value);
given=r.p.map(v=>v);sol=r.sol;cur=r.p.slice();sel=-1;msg("");draw()},20)}
$("#new").onclick=start;
$("#check").onclick=()=>{const w=new Set();cur.forEach((v,i)=>{if(v&&v!==sol[i])w.add(i)});draw(w);
msg(w.size?w.size+(w.size===1?" valoare greșită.":" valori greșite."):"Până acum totul este corect.")};
$("#hint").onclick=()=>{let i=sel>=0&&!given[sel]&&cur[sel]!==sol[sel]?sel:-1;
if(i<0){const e=[];cur.forEach((v,k)=>{if(v!==sol[k])e.push(k)});if(!e.length)return;i=e[Math.random()*e.length|0]}
sel=i;cur[i]=sol[i];draw();msg("Indiciu adăugat.")};
$("#solve").onclick=()=>{const g=given.slice(),o=[];count(g,1,false,o);cur=o.slice();draw();msg("Rezolvat cu backtracking.")};
document.addEventListener("keydown",e=>{
if(e.key>="1"&&e.key<="9")put(+e.key);
else if(e.key==="Backspace"||e.key==="Delete"||e.key==="0")put(0);
else if(sel>=0&&e.key.startsWith("Arrow")){e.preventDefault();const d={ArrowLeft:-1,ArrowRight:1,ArrowUp:-9,ArrowDown:9}[e.key];
const r=sel/9|0,c=sel%9;if(e.key==="ArrowLeft"&&c===0||e.key==="ArrowRight"&&c===8)return;
const n=sel+d;if(n>=0&&n<81){sel=n;draw();grid.children[n].focus()}}});
start();
