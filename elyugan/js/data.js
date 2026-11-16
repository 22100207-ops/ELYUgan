/* DATA - saved data, app state and fare calculation */

const $=id=>document.getElementById(id),m=n=>'₱'+(+n).toFixed(2),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const KEY='elyugan_v1',MAX=32;
const def=()=>({drivers:[{id:1,name:'Juan Dela Cruz',phone:'0917 111 2222'},{id:2,name:'Maria Santos',phone:'0918 333 4444'},{id:3,name:'Pedro Reyes',phone:'0919 555 6666'}],
buses:[{id:1,plate:'ELY-101',driver:1,on:0},{id:2,plate:'ELY-102',driver:2,on:0},{id:3,plate:'ELY-103',driver:3,on:0}],queue:[1,2,3],tickets:[],mine:[],seq:1,bid:4,did:4,
stops:[{n:'Cordon',km:0},{n:'Santiago City',km:15},{n:'Echague',km:28},{n:'Cauayan',km:45},{n:'Ilagan',km:65}],cfg:{min:13,free:4,rate:2.2,disc:20,pin:'1234'}});
let S;try{S=JSON.parse(localStorage.getItem(KEY))||def()}catch(e){S=def()}
S.users=S.users||[];if(!S.users.some(u=>u.username=='passenger'))S.users.push({id:1,name:'passenger',username:'passenger',phone:'',pw:'1234'});S.cfg=S.cfg||def().cfg;S.cfg.adm=S.cfg.adm||'admin';if(S.v!=3){S.v=3;S.stops=['Alcalamagallanes/Luna','Barrientos','Purok 1 Nalvo Norte','Nalvo Norte','Nalvo Sur','Km. Post 298','Darigayos','Darigayos/Almeida Boundary','Almeida','Paraoir Bridge','Paraoir','Km. Post 292','Km. Post 291/Little Chapel','Gate 8, Bacnotan Cement','Quirino Auditorium','Ballogo Basketball Court','Nagatiran/Mabangkbeng','Waiting Shed Narra','Narra','Bitalag','Pampang Shed','VBP Gas','Baptist Church','Shell Station','Bacnotan Municipal Hall','Baroro Bridge','DMMMSU Research','Isla de Natalia','Brgy. Talogtog','Mapa-ay Gulf','Municipal Hall, San Juan','Twins Garden, San Juan','Pente Costal','MPA','Cicosat-Lingsat','Grand Fiesta','Carlatan','Pagdaraoan Hall','San Fernando City Hall'].map((n,i)=>({n,km:i}));S.cfg={...S.cfg,min:14,base:6,rate:2,disc:20}}if(S.sess&&!S.users.find(u=>u.id==S.sess))S.sess=null;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
let U={mode:S.sess?'user':null,auth:'user',reg:0,tab:'book',step:1,bus:null,seat:null,from:'',to:'',type:'Regular',name:'',admin:false,at:'queue',last:null,q:''};
const bus=id=>S.buses.find(b=>b.id==id),drv=id=>S.drivers.find(d=>d.id==id),dn=b=>drv(b.driver)?drv(b.driver).name:'No driver';
const taken=id=>S.tickets.filter(t=>t.bus==id&&t.st=='active').map(t=>t.seat);
const km=n=>(S.stops.find(s=>s.n==n)||{km:0}).km;

function fare(f,t,ty){if(!f||!t||f==t)return null;const d=Math.abs(km(f)-km(t)),c=S.cfg;let base=Math.max(c.min,(c.base||0)+d*c.rate);base=Math.round(base*100)/100;const tot=ty!='Regular'?Math.round(base*(100-c.disc)/25)/4:base;return{d,base,off:base-tot,tot}}

