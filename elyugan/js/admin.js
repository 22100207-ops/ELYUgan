/* ADMIN - queue, minibuses, drivers, tickets, settings and destinations */

function adminV(){if(!U.admin)return`<h2>Admin login</h2><div class="card"><label>PIN (default 1234)</label><input id="pin" type="password" inputmode="numeric" placeholder="PIN"><button class="btn" onclick="login()">Enter</button></div>`;
const act=S.tickets.filter(t=>t.st=='active'),rev=S.tickets.filter(t=>t.st!='cancelled').reduce((a,t)=>a+t.fare,0);
let h=`<div class="stat"><div><b>${S.queue.length}</b>In queue</div><div><b>${act.length}</b>Active tix</div><div><b>${m(rev)}</b>Revenue</div></div>`;
const t=U.at;
if(t=='queue'){h+='<h2>Queue</h2>';S.queue.map(bus).forEach((b,i)=>{h+=`<div class="card"><div class="row"><b>#${i+1} · ${esc(b.plate)}</b><span class="mu">${taken(b.id).length}/${MAX} seats</span></div><div class="mu">${esc(dn(b))}</div><div class="row" style="margin-top:8px;flex-wrap:wrap"><span><button class="btn sm ghost" onclick="mv(${i},-1)">▲</button> <button class="btn sm ghost" onclick="mv(${i},1)">▼</button> <button class="btn sm ghost" onclick="deq(${b.id})">Remove</button></span><button class="btn sm red" onclick="depart(${b.id})">Depart 🚀</button></div></div>`});
if(!S.queue.length)h+='<div class="empty">Queue is empty.</div>';
const out=S.buses.filter(b=>!S.queue.includes(b.id));h+='<h3>Not in queue</h3>'+(out.map(b=>`<div class="card row"><span><b>${esc(b.plate)}</b><br><span class="mu">${esc(dn(b))}${b.on?' · on trip':''}</span></span><button class="btn sm" onclick="enq(${b.id})">${b.on?'Return':'Add'} to queue</button></div>`).join('')||'<div class="mu">All buses are queued.</div>')}
if(t=='buses'){h+=`<h2>Minibuses</h2><div class="card"><label>Plate number</label><input id="bp" placeholder="ELY-104"><label>Driver</label><select id="bd">${S.drivers.map(d=>`<option value="${d.id}">${esc(d.name)}</option>`).join('')}</select><button class="btn" onclick="addBus()">Add minibus (${MAX} seats)</button></div>`+S.buses.map(b=>`<div class="card"><div class="row"><b>${esc(b.plate)}</b><button class="btn sm red" onclick="delBus(${b.id})">Delete</button></div><label>Driver</label><select onchange="bus(${b.id}).driver=+this.value;save();render()">${S.drivers.map(d=>`<option value="${d.id}" ${d.id==b.driver?'selected':''}>${esc(d.name)}</option>`).join('')}</select></div>`).join('')}
if(t=='drivers'){h+=`<h2>Drivers</h2><div class="card"><label>Name</label><input id="dnm"><label>Phone</label><input id="dph" inputmode="tel"><button class="btn" onclick="addDrv()">Add driver</button></div>`+S.drivers.map(d=>`<div class="card row"><span><b>${esc(d.name)}</b><br><span class="mu">${esc(d.phone)} · ${S.buses.filter(b=>b.driver==d.id).map(b=>b.plate).join(', ')||'unassigned'}</span></span><button class="btn sm red" onclick="delDrv(${d.id})">Delete</button></div>`).join('')}
if(t=='tix'){h+='<h2>All tickets</h2>'+(S.tickets.length?S.tickets.slice().reverse().map(x=>tkC(x)+(x.st=='active'?`<button class="btn sm red" style="margin:-4px 0 10px" onclick="cancelT(${x.id})">Cancel</button>`:'')).join(''):'<div class="empty">No tickets yet.</div>')}
if(t=='set'){const c=S.cfg;h+=`<h2>Fare settings</h2><div class="card"><label>Minimum fare (₱)</label><input id="c1" type="number" step="0.01" value="${c.min}"><label>Base fare added to every trip (₱)</label><input id="c2" type="number" step="0.01" value="${c.base}"><label>Rate per extra km (₱)</label><input id="c3" type="number" step="0.01" value="${c.rate}"><label>Student / Senior discount (%)</label><input id="c4" type="number" value="${c.disc}"><label>Admin password</label><input id="c5" value="${esc(c.pin)}"><button class="btn" onclick="saveCfg()">Save settings</button></div><h3>Stops (km from first stop)</h3>`+S.stops.map((s,i)=>`<div class="card"><div class="row"><b>Stop ${i+1}</b><button class="btn sm red" onclick="if(confirm('Delete this stop?')){S.stops.splice(${i},1);save();render()}">✕</button></div><label>Destination name</label><input value="${esc(s.n)}" onchange="editStop(${i},'n',this.value)"><label>Distance (km)</label><input type="number" value="${s.km}" onchange="editStop(${i},'km',this.value)"></div>`).join('')+`<div class="card"><input id="sn" placeholder="Stop name"><input id="sk" type="number" placeholder="Km"><button class="btn ghost" onclick="addStop()">Add stop</button></div><button class="btn red" onclick="logout()">Log out</button> <button class="btn ghost" style="margin-top:8px" onclick="if(confirm('Reset ALL data?')){S=def();save();render()}">Reset all data</button>`}
return h}


function mv(i,d){const q=S.queue,j=i+d;if(j<0||j>=q.length)return;[q[i],q[j]]=[q[j],q[i]];save();render()}

function deq(id){S.queue=S.queue.filter(x=>x!=id);save();render()}

function enq(id){if(!S.queue.includes(id))S.queue.push(id);bus(id).on=0;save();render()}

function depart(id){if(!confirm('Depart this minibus? Its tickets will be closed.'))return;S.tickets.forEach(t=>{if(t.bus==id&&t.st=='active')t.st='departed'});S.queue=S.queue.filter(x=>x!=id);bus(id).on=1;if(U.bus==id)reset();save();render()}

function addBus(){const p=$('bp').value.trim();if(!p||!S.drivers.length)return alert('Enter plate and add a driver first.');S.buses.push({id:S.bid++,plate:p,driver:+$('bd').value,on:0});S.queue.push(S.bid-1);save();render()}

function delBus(id){if(!confirm('Delete minibus?'))return;S.buses=S.buses.filter(b=>b.id!=id);S.queue=S.queue.filter(x=>x!=id);save();render()}

function addDrv(){const n=$('dnm').value.trim();if(!n)return;S.drivers.push({id:S.did++,name:n,phone:$('dph').value.trim()||'-'});save();render()}

function delDrv(id){if(S.buses.some(b=>b.driver==id))return alert('Reassign this driver’s minibus first.');S.drivers=S.drivers.filter(d=>d.id!=id);save();render()}

function saveCfg(){S.cfg={...S.cfg,min:+$('c1').value,base:+$('c2').value,rate:+$('c3').value,disc:+$('c4').value,pin:$('c5').value||'1234'};save();alert('Saved');render()}

function addStop(){const n=$('sn').value.trim(),k=$('sk').value;if(!n||k==='')return;S.stops.push({n,km:+k});save();render()}

function editStop(i,f,v){const s=S.stops[i];if(f=='n'){v=v.trim();if(!v||S.stops.some((x,j)=>j!=i&&x.n==v)){alert('Enter a unique destination name.');return render()}const o=s.n;S.tickets.forEach(t=>{if(t.from==o)t.from=v;if(t.to==o)t.to=v});if(U.from==o)U.from=v;if(U.to==o)U.to=v;s.n=v}else s.km=+v||0;save()}

