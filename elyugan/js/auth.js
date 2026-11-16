/* AUTH - login, register and logout (admin or passenger is detected automatically) */

function me(){return S.users.find(u=>u.id==S.sess)}

function loginV(){return`<div class="welc"><div class="logo big">ELY<b>U</b>gan</div><div style="font-size:60px;margin:4px 0">🚌</div><h1>Get your ticket easily<br>from ELY<b>U</b>gan!</h1></div><main><div class="card"><label>Username</label><input id="${U.reg?'ru':'lp'}" autocomplete="username" autocapitalize="none" placeholder="Enter username"><label>Password</label><input id="${U.reg?'rw':'lw'}" type="password" autocomplete="current-password" placeholder="Enter password">`+(U.reg?`<button class="btn" onclick="regUser()">Create account</button><p style="text-align:center"><span class="mu">Have an account?</span> <button class="lnk" onclick="U.reg=0;render()">Log in</button></p>`:`<button class="btn" onclick="signIn()">Log in</button><p style="text-align:center"><span class="mu">New passenger?</span> <button class="lnk" onclick="U.reg=1;render()">Register</button></p>`)+'</div></main>'}

function signIn(){const k=$('lp').value.trim(),w=$('lw').value;if(k==S.cfg.adm&&w==S.cfg.pin){U.admin=true;U.mode='admin';U.at='queue';return render()}loginUser()}

function loginUser(){const k=$('lp').value.trim().toLowerCase(),u=S.users.find(x=>(String(x.username||'').toLowerCase()==k||x.phone==k)&&x.pw==$('lw').value);if(!u)return alert('Wrong username or password.');S.sess=u.id;save();U.mode='user';U.name=u.name;U.tab='book';render()}

function regUser(){const n=$('ru').value.trim(),w=$('rw').value;if(!n||w.length<4)return alert('Enter a username and a password of 4+ characters.');if(n.toLowerCase()==S.cfg.adm.toLowerCase()||S.users.some(x=>String(x.username||'').toLowerCase()==n.toLowerCase()))return alert('This username is already taken.');const u={id:Date.now(),name:n,username:n,phone:'',pw:w};S.users.push(u);S.sess=u.id;save();U.mode='user';U.name=n;U.tab='book';render()}

function loginAdmin(){if($('au').value.trim()==S.cfg.adm&&$('ap').value==S.cfg.pin){U.admin=true;U.mode='admin';U.at='queue';render()}else alert('Wrong admin username or password.')}

function logout(){U.admin=false;U.mode=null;U.reg=0;S.sess=null;save();U.name='';U.step=1;U.bus=null;U.seat=null;U.from='';U.to='';U.last=null;render()}

