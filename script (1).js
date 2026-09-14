
const seedProfiles=[
 {name:"Walker",role:"Creator",bio:"Building Walk With Walker — music, books, games and people.",letter:"W"},
 {name:"Nova Beats",role:"Artist",bio:"Independent music creator.",letter:"N"},
 {name:"Story House",role:"Writer",bio:"Stories, books and creative writing.",letter:"S"}
];
const seedMusic=[
 {title:"Fast Lane",artist:"WWW Demo Artist",type:"Single",letter:"♪"},
 {title:"Night Drive",artist:"WWW Demo Artist",type:"Single",letter:"♫"},
 {title:"Big Machines",artist:"WWW Demo Artist",type:"Track",letter:"♬"}
];
const seedBooks=[
 {title:"The Long Walk",author:"WWW Demo Writer",type:"Book",letter:"B"},
 {title:"City of Dreams",author:"WWW Demo Writer",type:"Story",letter:"S"},
 {title:"Creative Mind",author:"WWW Demo Writer",type:"Book",letter:"C"}
];
const seedGames=[
 {title:"Street Rush",genre:"Racing",status:"In development",letter:"R"},
 {title:"Walker Arena",genre:"Action",status:"Coming soon",letter:"A"},
 {title:"Puzzle World",genre:"Puzzle",status:"Prototype",letter:"P"}
];

function get(key,seed){const v=localStorage.getItem(key);return v?JSON.parse(v):seed}
function save(key,v){localStorage.setItem(key,JSON.stringify(v))}
function toast(msg){const t=document.getElementById("toast");if(!t)return;t.textContent=msg;t.style.display="block";setTimeout(()=>t.style.display="none",2200)}
function toggleMenu(){document.getElementById("links")?.classList.toggle("open")}
function openModal(id){document.getElementById(id)?.classList.add("show")}
function closeModal(id){document.getElementById(id)?.classList.remove("show")}
function currentUser(){return JSON.parse(localStorage.getItem("ww_current_user")||"null")}

function setupNav(){
 const path=location.pathname.split("/").pop()||"index.html";
 document.querySelectorAll(".links a").forEach(a=>{if(a.getAttribute("href")===path)a.classList.add("active")});
 document.getElementById("menuBtn")?.addEventListener("click",toggleMenu);
 document.getElementById("loginBtn")?.addEventListener("click",()=>openModal("loginModal"));
 document.getElementById("signupBtn")?.addEventListener("click",()=>openModal("signupModal"));
}
function profileCards(list){
 return list.map((p,i)=>`<article class="card"><div class="profileRow"><div class="avatar">${p.letter||p.name[0]}</div><div><h3>${escapeHtml(p.name)}</h3><div class="meta">${escapeHtml(p.role||"Creator")}</div></div></div><p class="meta">${escapeHtml(p.bio||"")}</p><span class="tag">View profile</span></article>`).join("");
}
function renderProfiles(){
 const el=document.getElementById("profileGrid");if(!el)return;
 const all=get("ww_profiles",seedProfiles);el.innerHTML=profileCards(all);
 const search=document.getElementById("profileSearch");
 search?.addEventListener("input",()=>{const q=search.value.toLowerCase();el.innerHTML=profileCards(all.filter(p=>(p.name+" "+p.role+" "+p.bio).toLowerCase().includes(q)))||'<div class="empty">No profiles found.</div>'});
}
function renderCards(id,data,type){
 const el=document.getElementById(id);if(!el)return;
 el.innerHTML=data.map(x=>`<article class="card"><div class="cover">${x.letter}</div><h3>${escapeHtml(x.title)}</h3><div class="meta">${escapeHtml(x.artist||x.author||x.genre||"")}</div><p class="meta">${escapeHtml(x.type||x.status||"")}</p><button class="btn" onclick="toast('Demo item selected')">Open</button></article>`).join("");
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function signup(e){
 e.preventDefault();
 const f=new FormData(e.target), name=f.get("name"), email=f.get("email");
 const profiles=get("ww_profiles",seedProfiles);profiles.push({name,role:f.get("role"),bio:f.get("bio"),letter:name[0].toUpperCase()});save("ww_profiles",profiles);
 localStorage.setItem("ww_current_user",JSON.stringify({name,email}));
 closeModal("signupModal");toast("Profile created on this device");e.target.reset();renderProfiles();
}
function login(e){
 e.preventDefault();const f=new FormData(e.target);localStorage.setItem("ww_current_user",JSON.stringify({name:f.get("email").split("@")[0],email:f.get("email")}));
 closeModal("loginModal");toast("Demo login successful");e.target.reset();updateAccount();
}
function updateAccount(){
 const u=currentUser(), box=document.getElementById("accountState");if(!box)return;
 box.innerHTML=u?`Signed in as <strong>${escapeHtml(u.name)}</strong> <button class="btn" onclick="logout()">Log out</button>`:`<button class="btn" onclick="openModal('loginModal')">Log in</button> <button class="btn primary" onclick="openModal('signupModal')">Create account</button>`;
}
function logout(){localStorage.removeItem("ww_current_user");toast("Logged out");updateAccount()}
document.addEventListener("DOMContentLoaded",()=>{setupNav();renderProfiles();renderCards("musicGrid",get("ww_music",seedMusic));renderCards("bookGrid",get("ww_books",seedBooks));renderCards("gameGrid",get("ww_games",seedGames));updateAccount()});
