/* APP - screen layout, navigation and start */

function render(){if(U.mode=='user'&&!me())U.mode=null;if(!U.mode){$('app').innerHTML=loginV();return}
const a=U.mode=='admin';if(!a&&!U.name)U.name=me().name;
$('app').innerHTML=`<header><div><div class="logo">ELY<b>U</b>gan</div><small>${a?'Admin panel':'Hi, '+esc(me().name.split(' ')[0])}</small></div><button class="seg-out" onclick="logout()">Log out</button></header><main>${a?adminV():userV()}</main>${nav(a)}`}

function nav(a){const t=a?(U.admin?[['queue','🚏','Queue'],['buses','🚌','Buses'],['drivers','🧑‍✈️','Drivers'],['tix','🎫','Tickets'],['set','⚙️','Settings']]:[]):[['book','🎟️','Book'],['mine','📋','My Tickets']];const k=a?'at':'tab';return'<nav>'+t.map(x=>`<button class="${U[k]==x[0]?'on':''}" onclick="U.${k}='${x[0]}';render()"><span>${x[1]}</span>${x[2]}</button>`).join('')+'</nav>'}

render();
