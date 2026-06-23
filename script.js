function startAuthLoad(mode){
  const page=mode==='signup'?'signup.html':'login.html';
  let loader=document.getElementById('authLoader');
  if(!loader){
    loader=document.createElement('div');
    loader.id='authLoader';
    loader.className='auth-loader';
    loader.innerHTML='<div class="auth-spinner"></div><p>Loading secure page...</p>';
    document.body.appendChild(loader);
  }
  loader.classList.add('show');
  document.body.classList.remove('dash-menu-lock');
  document.getElementById('navLinks')?.classList.remove('active');
  setTimeout(()=>{ window.location.href=page; },5000);
}
let authMode = "login";
function qs(id){return document.getElementById(id)}
function toggleMenu(){qs("navLinks")?.classList.toggle("active")}
document.addEventListener('click',e=>{if(e.target.matches('.nav-links a')) qs('navLinks')?.classList.remove('active')})
function openAuth(mode){startAuthLoad(mode)}
function closeAuth(){qs("authModal").style.display="none"}
function switchAuth(){authMode=authMode==="login"?"signup":"login";updateAuthUI();clearLoginError()}
function updateAuthUI(){qs("authTitle").innerText=authMode==="login"?"Login":"Create Account";qs("nameField").style.display=authMode==="signup"?"block":"none";qs("switchText").innerText=authMode==="login"?"Create account":"Already have account? Login"}
function clearLoginError(){
  const errorBox=qs('loginError');
  if(errorBox) errorBox.textContent='';
  ['nameField','email','password'].forEach(id=>qs(id)?.classList.remove('auth-error-input'));
}
function setLoginError(id,msg){
  const errorBox=qs('loginError');
  if(errorBox) errorBox.textContent=msg;
  const field=qs(id);
  if(field){
    field.classList.add('auth-error-input');
    field.focus();
  }
}
function authSubmit(){
  const n=qs("nameField")?.value.trim() || '';
  const e=qs("email")?.value.trim() || '';
  const p=qs("password")?.value.trim() || '';
  clearLoginError();
  if(authMode==="signup"&&!n){setLoginError('nameField',"Please enter your full name");return}
  if(!e){setLoginError('email',"Please enter your email address");return}
  if(!p){setLoginError('password',"Please enter your password");return}
  if(!e.includes('@')){setLoginError('email','Please enter a valid email address');return}
  const finalName=authMode==="signup"?n:e.split("@")[0];
  qs("website").style.display="none";
  qs("dashboard").style.display="block";
  qs("authModal").style.display="none";
  qs("userName").innerText=finalName;
  qs("profileName").innerText=finalName;
  qs("profileEmail").innerText=e;
  setupDashboardMenu();
  closeDashMenu();
  window.scrollTo(0,0);
  showToast('Welcome to your dashboard')
}
function logout(){qs("dashboard").style.display="none";qs("website").style.display="block";['email','password','nameField'].forEach(id=>{if(qs(id))qs(id).value=''});showToast('Logged out successfully');window.scrollTo(0,0)}
function showToast(msg){let t=qs('toast'); if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t)} t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400)}
function scrollToSection(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth'})}
function searchProperties(){const loc=qs('searchLocation')?.value || 'your selected location'; const type=qs('searchType')?.value || 'property'; const budget=qs('searchBudget')?.value || 'budget'; showToast(`Searching ${type} in ${loc} within ${budget}`); setTimeout(()=>{ if(!location.pathname.endsWith('properties.html')) location.href='properties.html'; },700)}
function bookVisit(name){showToast(`Visit request sent for ${name}. Please login/signup to track it.`); setTimeout(()=>openAuth('signup'),900)}
function viewProperty(name){showToast(`Opening details for ${name}`); setTimeout(()=>location.href='property-details.html',500)}
function contactAgent(name){showToast(`${name} will contact you shortly`); setTimeout(()=>openAuth('signup'),800)}
function readArticle(title){showToast(`Opening article: ${title}`)}
function clearContactError(id){
  const field=qs(id);
  const error=qs(id+'Error');
  if(field) field.classList.remove('error-input');
  if(error) error.textContent='';
}
function setContactError(id,msg){
  const field=qs(id);
  const error=qs(id+'Error');
  if(field){
    field.classList.add('error-input');
    field.focus();
  }
  if(error) error.textContent=msg;
}
function clearAllContactErrors(){
  ['contactName','contactEmail','contactPhone','contactMessage'].forEach(clearContactError);
}
function sendContact(){
  clearAllContactErrors();
  const n=qs('contactName')?.value.trim() || '';
  const e=qs('contactEmail')?.value.trim() || '';
  const p=qs('contactPhone')?.value.trim() || '';
  const m=qs('contactMessage')?.value.trim() || '';
  const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern=/^[0-9+\-\s()]{7,15}$/;

  if(!n){setContactError('contactName','Please enter your name.');return;}
  if(!e){setContactError('contactEmail','Please enter your email address.');return;}
  if(!emailPattern.test(e)){setContactError('contactEmail','Please enter a valid email address.');return;}
  if(!p){setContactError('contactPhone','Please enter your phone number.');return;}
  if(!phonePattern.test(p)){setContactError('contactPhone','Please enter a valid phone number.');return;}
  if(!m){setContactError('contactMessage','Please enter your message.');return;}

  showToast('Message sent successfully. Redirecting...');
  clearAllContactErrors();
  setTimeout(()=>{
    window.location.href='404page.html';
  },600);
}
function showDashTab(tab,el){document.querySelectorAll('.dash-tab').forEach(d=>d.classList.remove('active'));qs('dash-'+tab)?.classList.add('active');document.querySelectorAll('.sidebar a').forEach(a=>a.classList.remove('active'));el?.classList.add('active')}
const reveals=document.querySelectorAll(".reveal");function revealOnScroll(){reveals.forEach(el=>{if(el.getBoundingClientRect().top<window.innerHeight-80)el.classList.add("show")})}window.addEventListener("scroll",revealOnScroll);window.addEventListener("load",revealOnScroll);

window.addEventListener('scroll',()=>{document.querySelector('header')?.classList.toggle('scrolled',window.scrollY>40);});


function setupDashboardMenu(){
  const dash=qs('dashboard');
  if(!dash) return;

  // Remove old close/back buttons so only the rich 3-dot menu is used.
  dash.querySelectorAll('.dash-close').forEach(btn=>btn.remove());

  let mobileHeader=dash.querySelector('.dash-mobile-header');
  if(!mobileHeader){
    mobileHeader=document.createElement('div');
    mobileHeader.className='dash-mobile-header';
    mobileHeader.innerHTML=`<a class="dash-mobile-brand" href="index.html"><img src="assets/logo-dark.webp" alt="Stackly Logo"></a>`;
    dash.prepend(mobileHeader);
  }

  let btn=mobileHeader.querySelector('.dash-menu-btn') || dash.querySelector(':scope > .dash-menu-btn');
  if(!btn){
    btn=document.createElement('button');
    btn.className='dash-menu-btn';
    btn.type='button';
    btn.setAttribute('aria-label','Open dashboard menu');
    mobileHeader.appendChild(btn);
  }else if(btn.parentElement!==mobileHeader){
    mobileHeader.appendChild(btn);
  }
  btn.innerHTML='<span></span><span></span><span></span>';
  btn.onclick=toggleDashMenu;

  let overlay=dash.querySelector('.dash-overlay');
  if(!overlay){
    overlay=document.createElement('div');
    overlay.className='dash-overlay';
    dash.appendChild(overlay);
  }
  overlay.onclick=closeDashMenu;
}
function toggleDashMenu(){
  const dashboard=document.getElementById('dashboard');
  if(!dashboard) return;
  dashboard.classList.toggle('sidebar-open');
  document.body.classList.toggle('dash-menu-lock', dashboard.classList.contains('sidebar-open'));
}
function closeDashMenu(){
  const dashboard=document.getElementById('dashboard');
  dashboard?.classList.remove('sidebar-open');
  document.body.classList.remove('dash-menu-lock');
}
window.addEventListener('resize',()=>{if(window.innerWidth>950) closeDashMenu();});
window.addEventListener('load',setupDashboardMenu);


/* Requested functionality fixes shared external */
function forgotPassword(){const email=(document.getElementById('email')?.value||'').trim();if(!email){if(typeof setLoginError==='function')setLoginError('email','Please enter your email to reset password');else alert('Please enter your email to reset password');return;}showToast('Password reset link sent to '+email);}
function listProperty(){showToast('Property listing started. Create/login to continue.');setTimeout(()=>openAuth('signup'),500)}
function loanAdvisor(){showToast('Loan advisor request started. Login/signup to track your report.');setTimeout(()=>openAuth('signup'),500)}
function checkDocuments(){showToast('Document checklist opened. Login/signup to upload documents.');setTimeout(()=>openAuth('signup'),500)}
function getLoanHelp(){showToast('Loan help request started. Our advisor will guide EMI and documents.');setTimeout(()=>openAuth('signup'),500)}
function goDashboardHome(){const first=document.querySelector('.dashboard .sidebar a:not(.logo)');if(typeof showDashTab==='function')showDashTab('overview',first);document.getElementById('dashboard')?.scrollIntoView({behavior:'smooth',block:'start'});if(typeof closeDashMenu==='function')closeDashMenu();showToast('Dashboard home opened');return false}
(function(){const oldView=window.viewProperty;window.viewProperty=function(name){const key=String(name||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');const fixed=key.includes('modern-family-villa')?'modern-family-villa':key.includes('luxury-city-apartment')?'luxury-city-apartment':key.includes('premium-smart-home')?'premium-smart-home':key;showToast('Opening details for '+name);setTimeout(()=>location.href='property-details.html?property='+fixed,250)};window.addEventListener('load',()=>{document.querySelectorAll('.dashboard .sidebar .logo,.dashboard .dash-mobile-brand').forEach(a=>{a.href='#';a.onclick=goDashboardHome});const page=(location.pathname.split('/').pop()||'index.html');document.querySelectorAll('.nav-links a').forEach(a=>{if(a.getAttribute('href')===page || (page==='index.html'&&a.getAttribute('href')==='index.html'))a.classList.add('active-module')});});})();
