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
  window.location.href=page;
}
let authMode = "login";
function qs(id){return document.getElementById(id)}
function toggleMenu(){qs("navLinks")?.classList.toggle("active")}
document.addEventListener('click',e=>{if(e.target.matches('.nav-links a')) qs('navLinks')?.classList.remove('active')})
document.addEventListener('click',e=>{
  const link=e.target.closest('a[href$="404page.html"]');
  if(link && typeof saveReturnPosition==='function') saveReturnPosition();
})
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
  const finalName=authMode==="signup"?n:(e.split("@")[0] || 'User');
  qs("website").style.display="none";
  qs("dashboard").style.display="block";
  qs("authModal").style.display="none";
  updateDashboardProfile(finalName,e);
  setupDashboardMenu();
  closeDashMenu();
  window.scrollTo(0,0);
  showToast('Welcome to your dashboard')
}
function logout(){qs("dashboard").style.display="none";qs("website").style.display="block";['email','password','nameField'].forEach(id=>{if(qs(id))qs(id).value=''});showToast('Logged out successfully');window.scrollTo(0,0)}
function showToast(msg){let t=qs('toast'); if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t)} t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400)}
function scrollToSection(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth'})}
function searchProperties(){const loc=qs('searchLocation')?.value || 'your selected location'; const type=qs('searchType')?.value || 'property'; const budget=qs('searchBudget')?.value || 'budget'; showToast(`Searching ${type} in ${loc} within ${budget}`); if(!location.pathname.endsWith('properties.html')) location.href='properties.html'}
function isDashboardVisible(){
  const dash=qs('dashboard');
  return !!dash && (document.body.classList.contains('dashboard-mode') || getComputedStyle(dash).display!=='none');
}
function saveReturnPosition(){
  const activeDash=document.querySelector('.dashboard .dash-tab.active');
  sessionStorage.setItem('stacklyReturnPosition',JSON.stringify({
    url:window.location.href,
    scrollY:window.scrollY,
    dashboardVisible:isDashboardVisible(),
    dashboardTab:activeDash ? activeDash.id.replace('dash-','') : ''
  }));
}
function restoreReturnPosition(){
  const raw=sessionStorage.getItem('stacklyReturnPositionPending');
  if(!raw) return;
  sessionStorage.removeItem('stacklyReturnPositionPending');
  sessionStorage.removeItem('stacklyReturnPosition');
  let data;
  try{data=JSON.parse(raw)}catch(e){return}
  if(data.dashboardVisible){
    document.body.classList.add('dashboard-mode');
    if(qs('website')) qs('website').style.display='none';
    if(qs('dashboard')) qs('dashboard').style.display='block';
    setupDashboardMenu();
    const dashLink=[...document.querySelectorAll('.dashboard .sidebar a:not(.logo)')].find(a=>a.getAttribute('onclick')?.includes(`'${data.dashboardTab}'`));
    if(data.dashboardTab) showDashTab(data.dashboardTab,dashLink);
  }
  setTimeout(()=>window.scrollTo(0,Number(data.scrollY)||0),80);
}
function bookVisit(name){
  saveReturnPosition();
  window.location.href='404page.html';
}
function viewProperty(name){const key=getPropertyKey(name);showToast(`Opening details for ${name}`);location.href='property-details.html?property='+key}
function contactAgent(name){showToast(`${name} will contact you shortly`); openAuth('signup')}
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
    saveReturnPosition();
    window.location.href='404page.html';
  },600);
}
function showDashTab(tab,el){document.querySelectorAll('.dash-tab').forEach(d=>d.classList.remove('active'));qs('dash-'+tab)?.classList.add('active');document.querySelectorAll('.sidebar a').forEach(a=>a.classList.remove('active'));el?.classList.add('active')}
function formatProfileName(name){
  const clean=(name || 'User').trim() || 'User';
  return clean.replace(/\b\w/g,letter=>letter.toUpperCase());
}
function getProfileInitial(name){
  return (formatProfileName(name).charAt(0) || 'U').toUpperCase();
}
function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function updateDashboardProfile(name,email){
  const displayName=(name || 'User').trim() || 'User';
  if(qs('userName')) qs('userName').innerText=displayName;
  if(qs('profileName')) qs('profileName').innerText=displayName;
  if(qs('profileEmail')) qs('profileEmail').innerText=email || 'user@email.com';
  document.querySelectorAll('.profile-action').forEach(btn=>{
    btn.innerHTML='<span class="profile-avatar" aria-hidden="true">'+escapeHtml(getProfileInitial(displayName))+'</span><span class="profile-name">'+escapeHtml(formatProfileName(displayName))+'</span>';
    btn.setAttribute('aria-label','Open profile for '+formatProfileName(displayName));
  });
}
function openProfileTab(){
  const profileLink=[...document.querySelectorAll('.dashboard .sidebar a:not(.logo)')].find(a=>a.getAttribute('onclick')?.includes("'profile'"));
  showDashTab('profile',profileLink);
  closeDashMenu();
}
function openNotifications(){
  const messagesLink=[...document.querySelectorAll('.dashboard .sidebar a:not(.logo)')].find(a=>a.getAttribute('onclick')?.includes("'messages'"));
  showDashTab('messages',messagesLink);
  document.querySelectorAll('.notification-action .notification-badge').forEach(badge=>badge.textContent='0');
  closeDashMenu();
  showToast('Notifications opened');
}
function setupDashboardActions(){
  document.querySelectorAll('.dashboard').forEach(dash=>{
    const top=dash.querySelector('.dash-top');
    const sidebar=dash.querySelector('.sidebar');

    if(sidebar && !sidebar.querySelector('.sidebar-logout')){
      const profileLink=[...sidebar.querySelectorAll('a:not(.logo)')].find(a=>a.getAttribute('onclick')?.includes("'profile'"));
      const logoutLink=document.createElement('a');
      logoutLink.className='sidebar-logout';
      logoutLink.href='#';
      logoutLink.textContent='Logout';
      logoutLink.onclick=function(e){e.preventDefault();logout();};
      if(profileLink) profileLink.insertAdjacentElement('afterend',logoutLink);
      else sidebar.appendChild(logoutLink);
    }

    if(top){
      let profileAction=top.querySelector('.profile-action');
      if(!profileAction){
        profileAction=document.createElement('button');
        profileAction.className='logout profile-action';
        profileAction.type='button';
        profileAction.onclick=openProfileTab;
      }
      profileAction.classList.add('profile-action');
      profileAction.type='button';
      profileAction.onclick=openProfileTab;

      let actions=top.querySelector('.dash-actions');
      if(!actions){
        actions=document.createElement('div');
        actions.className='dash-actions';
        top.appendChild(actions);
      }

      let notify=actions.querySelector('.notification-action');
      if(!notify){
        notify=document.createElement('button');
        notify.className='notification-action';
        notify.type='button';
        notify.setAttribute('aria-label','Open notifications');
        notify.onclick=openNotifications;
        notify.innerHTML='<span class="notification-icon" aria-hidden="true">!</span><span class="notification-badge">2</span>';
        actions.prepend(notify);
      }

      if(profileAction.parentElement!==actions) actions.appendChild(profileAction);
    }
  });
  updateDashboardProfile(qs('userName')?.textContent || 'User',qs('profileEmail')?.textContent || 'user@email.com');
}
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
  setupDashboardActions();
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
function listProperty(){showToast('Property listing started. Create/login to continue.');openAuth('signup')}
function loanAdvisor(){showToast('Loan advisor request started. Login/signup to track your report.');openAuth('signup')}
function checkDocuments(){showToast('Document checklist opened. Login/signup to upload documents.');openAuth('signup')}
function getLoanHelp(){showToast('Loan help request started. Our advisor will guide EMI and documents.');openAuth('signup')}
function goDashboardHome(){const first=document.querySelector('.dashboard .sidebar a:not(.logo)');if(typeof showDashTab==='function')showDashTab('overview',first);document.getElementById('dashboard')?.scrollIntoView({behavior:'smooth',block:'start'});if(typeof closeDashMenu==='function')closeDashMenu();showToast('Dashboard home opened');return false}

const propertyData={
  'modern-family-villa':{title:'Modern Family Villa',price:'₹1.25 Cr',hero:'Premium Modern Family Villa',desc:'Spacious Bangalore family villa with premium interiors, private garden, verified documents, and visit-ready availability.',meta:'4 Beds • 3 Baths • 3200 sqft • Bangalore • Family Villa • Verified Listing',imgs:['assets/modern-house.webp','assets/office-interior.webp','assets/city-home.webp']},
  'luxury-city-apartment':{title:'Luxury City Apartment',price:'₹86 Lakhs',hero:'Luxury City Apartment',desc:'Mumbai apartment with modern amenities, excellent connectivity, and comfortable city living.',meta:'3 Beds • 2 Baths • 1800 sqft • Mumbai • City Living • Verified Listing',imgs:['assets/luxury-interior.webp','assets/living-room.webp','assets/home-exterior.webp']},
  'premium-smart-home':{title:'Premium Smart Home',price:'₹2.8 Cr',hero:'Premium Smart Home',desc:'Luxury gated community home with smart automation, premium interiors, landscaped garden, security, and excellent connectivity.',meta:'5 Beds • 4 Baths • 4200 sqft • Hyderabad • Gated community • Smart security • Clubhouse • Garden view',imgs:['assets/premium-villa.webp','assets/office-interior.webp','assets/city-home.webp']},
  'lake-view-residence':{title:'Lake View Residence',price:'₹1.65 Cr',hero:'Lake View Residence',desc:'Premium Pune residence with spacious rooms, lake-facing surroundings, verified papers, and visit-ready availability.',meta:'4 Beds • 4 Baths • 3500 sqft • Pune • Lake View • Verified Listing',imgs:['assets/home-exterior.webp','assets/living-room.webp','assets/modern-house.webp']},
  'urban-apartment':{title:'Urban Apartment',price:'₹72 Lakhs',hero:'Urban Apartment',desc:'Efficient Chennai apartment with smart planning, city connectivity, practical amenities, and a budget-friendly price.',meta:'2 Beds • 2 Baths • 1450 sqft • Chennai • Budget Pick • Verified Listing',imgs:['assets/living-room.webp','assets/luxury-interior.webp','assets/city-home.webp']},
  'royal-garden-villa':{title:'Royal Garden Villa',price:'₹3.4 Cr',hero:'Royal Garden Villa',desc:'Large Delhi NCR villa with garden-facing spaces, luxury finishes, premium privacy, and full family comfort.',meta:'5 Beds • 5 Baths • 5100 sqft • Delhi NCR • Luxury Villa • Verified Listing',imgs:['assets/apartment-view.webp','assets/premium-villa.webp','assets/home-exterior.webp']}
};
function getPropertyKey(name){
  const key=String(name||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  return propertyData[key]?key:'premium-smart-home';
}
function applyPropertyDetails(){
  if(!location.pathname.endsWith('property-details.html')) return;
  const key=new URLSearchParams(location.search).get('property')||'premium-smart-home';
  const data=propertyData[key]||propertyData['premium-smart-home'];
  const heroH1=document.querySelector('.page-hero h1');
  const heroP=document.querySelector('.page-hero p');
  if(heroH1) heroH1.textContent=data.hero;
  if(heroP) heroP.textContent=data.desc;
  const price=document.querySelector('.grid-2 .card .price');
  const title=document.querySelector('.grid-2 .card h2');
  const meta=document.querySelector('.grid-2 .card .muted');
  if(price) price.textContent=data.price;
  if(title) title.textContent=data.title;
  if(meta) meta.textContent=data.meta;
  document.querySelectorAll('.gallery img').forEach((img,i)=>{if(data.imgs[i]) img.src=data.imgs[i]});
  document.querySelectorAll('button').forEach(btn=>{
    const text=btn.textContent.trim().toLowerCase();
    if(text.includes('book')) btn.setAttribute('onclick',`bookVisit('${data.title}')`);
    if(text.includes('contact')) btn.setAttribute('onclick',`contactAgent('${data.title} Agent')`);
  });
}
function openDashboardFromUrl(){
  const params=new URLSearchParams(location.search);
  if(params.get('dashboard')!=='1') return;
  const name=params.get('name')||'User';
  const email=params.get('email')||'user@email.com';
  if(qs('website')) qs('website').style.display='none';
  if(qs('dashboard')) qs('dashboard').style.display='block';
  updateDashboardProfile(name,email);
  setupDashboardMenu();
  history.replaceState(null,'','index.html');
}
(function(){window.addEventListener('load',()=>{document.querySelectorAll('.dashboard .sidebar .logo,.dashboard .dash-mobile-brand').forEach(a=>{a.href='#';a.onclick=goDashboardHome});setupDashboardActions();const page=(location.pathname.split('/').pop()||'index.html');document.querySelectorAll('.nav-links a').forEach(a=>{if(a.getAttribute('href')===page || (page==='index.html'&&a.getAttribute('href')==='index.html'))a.classList.add('active-module')});applyPropertyDetails();openDashboardFromUrl();restoreReturnPosition();});document.addEventListener('DOMContentLoaded',applyPropertyDetails);})();
