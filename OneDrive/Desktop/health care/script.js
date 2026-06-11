const PAGE_LINKS = document.querySelectorAll('.nav-links a, .mobile-menu a');
function setActiveNav() {
  const path = window.location.pathname.split('/').pop().replace('.html','') || 'index';
  PAGE_LINKS.forEach(link => {
    const href = link.getAttribute('href') || '';
    const page = href.split('/').pop().replace('.html','');
    link.classList.toggle('active', page === path || (page === 'index' && path === ''));
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const page = href.split('/').pop().replace('.html','');
    link.classList.toggle('active', page === path || (page === 'index' && path === ''));
  });
}
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if(menu) menu.classList.toggle('open');
}
window.addEventListener('scroll', ()=>{
  const nav = document.getElementById('mainNav');
  if(nav) nav.classList.toggle('scrolled', window.scrollY > 20);
});
function initAOS() {
  const items = document.querySelectorAll('[data-aos]');
  if(!items.length) return;
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add('aos-animate');
    });
  }, {threshold:0.15});
  items.forEach(item => {
    if(!item.classList.contains('aos-animate')) observer.observe(item);
  });
}
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if(!counters.length) return;
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        const step = Math.ceil(target / 80);
        let current = 0;
        const timer = setInterval(()=>{
          current = Math.min(current + step, target);
          el.textContent = current >= 1000 ? (current / 1000).toFixed(current >= 10000 ? 0 : 1) + 'K+' : current + '+';
          if(current >= target) clearInterval(timer);
        }, 20);
        observer.unobserve(el);
      }
    });
  }, {threshold:0.5});
  counters.forEach(counter => observer.observe(counter));
}
function toggleFaq(button) {
  const item = button.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if(!wasOpen) item.classList.add('open');
}
function validateName(input) {
  input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
  checkContactForm();
}
function checkContactForm() {
  const fn = document.getElementById('c-fname');
  const ln = document.getElementById('c-lname');
  const ph = document.getElementById('c-phone');
  const em = document.getElementById('c-email');
  const msg = document.getElementById('c-msg');
  if(!fn || !ln || !ph || !em || !msg) return;
  const validEmail = /\S+@\S+\.\S+/.test(em.value.trim());
  const validPhone = ph.value.replace(/\s/g, '').length >= 10;
  const valid = fn.value.trim() && ln.value.trim() && validPhone && validEmail && msg.value.trim();
  document.getElementById('contactSendBtn').disabled = !valid;
}
function submitContactForm() {
  const btn = document.getElementById('contactSendBtn');
  if(!btn || btn.disabled) return;
  alert('Thank you! Your message has been sent. We will contact you shortly.');
  ['c-fname','c-lname','c-phone','c-email','c-msg'].forEach(id => {
    const element = document.getElementById(id);
    if(element) element.value = '';
  });
  checkContactForm();
}
let selectedRole = 'patient';
function selectRole(role) {
  selectedRole = role;
  document.querySelectorAll('.role-btn').forEach(btn => btn.classList.toggle('active', btn.id === `role-${role}`));
}
function togglePw(id, btn) {
  const input = document.getElementById(id);
  if(!input) return;
  if(input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
  else { input.type = 'password'; btn.textContent = '👁'; }
}
function doSignIn() {
  const email = document.getElementById('si-email');
  const password = document.getElementById('si-pw');
  if(!email || !password || !email.value.trim() || !password.value.trim()) {
    alert('Please enter email and password.');
    return;
  }
  if(selectedRole === 'patient') window.location.href = 'patient-dash.html';
  else window.location.href = 'provider-dash.html';
}
function doRegister() {
  alert('Your account has been created. Please sign in.');
  window.location.href = 'signin.html';
}
function checkPwStrength(value) {
  const bar = document.getElementById('pw-strength-bar');
  const txt = document.getElementById('pw-strength-txt');
  if(!bar || !txt) return;
  let score = 0;
  if(value.length >= 8) score++;
  if(/[A-Z]/.test(value)) score++;
  if(/[0-9]/.test(value)) score++;
  if(/[^A-Za-z0-9]/.test(value)) score++;
  const colors = ['#EF4444','#F97316','#EAB308','#22C55E'];
  const labels = ['Weak','Fair','Good','Strong'];
  bar.style.width = (score * 25) + '%';
  bar.style.background = colors[score - 1] || '#EF4444';
  txt.textContent = score > 0 ? labels[score - 1] : '';
  txt.style.color = colors[score - 1] || 'var(--text-light)';
}
function checkRegForm() {
  const fn = document.getElementById('reg-fn');
  const ln = document.getElementById('reg-ln');
  const em = document.getElementById('reg-email');
  const pw = document.getElementById('reg-pw');
  const cp = document.getElementById('reg-cpw');
  if(!fn || !ln || !em || !pw || !cp) return;
  const pwMatch = pw.value === cp.value && cp.value.length > 0;
  const pwMatchErr = document.getElementById('pw-match-err');
  if(pwMatchErr) pwMatchErr.style.display = (cp.value.length > 0 && !pwMatch) ? 'block' : 'none';
  const valid = fn.value.trim() && ln.value.trim() && /\S+@\S+\.\S+/.test(em.value.trim()) && pw.value.length >= 8 && /[A-Z]/.test(pw.value) && /[0-9]/.test(pw.value) && pwMatch;
  const registerButton = document.getElementById('regBtn');
  if(registerButton) registerButton.disabled = !valid;
}
function dashSection(event, type, section) {
  event.preventDefault();
  const nav = document.querySelectorAll(`#page-${type}-dash .sidebar-nav a`);
  nav.forEach(link => link.classList.toggle('active', link.dataset.section === section));
  if(type === 'patient') renderPatientDash(section);
  else renderProviderDash(section);
}
function renderPatientDash(section) {
  const el = document.getElementById('patient-dash-content');
  if(!el) return;
  if(section === 'overview' || !section) {
    el.innerHTML = `
    <div class="dash-header">
      <div><h2>Good morning, Rahul 👋</h2><p>Here's your health overview for today</p></div>
      <button class="btn btn-primary btn-sm" onclick="window.location.href='services.html'" style="padding:10px 20px;font-size:0.85rem;">Book Appointment</button>
    </div>
    <div class="metrics-grid">
      <div class="metric-card"><span class="metric-icon">📅</span><div class="label">Upcoming Appointments</div><div class="value">3</div><div class="change up">↑ 1 this week</div></div>
      <div class="metric-card"><span class="metric-icon">📋</span><div class="label">Medical Records</div><div class="value">12</div><div class="change up">↑ 2 new</div></div>
      <div class="metric-card"><span class="metric-icon">💊</span><div class="label">Active Prescriptions</div><div class="value">2</div><div class="change">Renew in 7 days</div></div>
      <div class="metric-card"><span class="metric-icon">❤️</span><div class="label">Health Score</div><div class="value">87</div><div class="change up">↑ 3 pts</div></div>
    </div>
    <div class="dash-grid">
      <div class="dash-card">
        <h3>Health Activity (Last 6 Months)</h3>
        <div class="chart-area"><canvas id="patientLineChart"></canvas></div>
      </div>
      <div class="dash-card">
        <h3>Next Appointments</h3>
        <div class="appt-item"><div class="appt-avatar">AK</div><div><h4>Dr. Aryan Kapoor</h4><span>Cardiology · Follow-up</span></div><div class="appt-time">Jun 8</div></div>
        <div class="appt-item"><div class="appt-avatar">PS</div><div><h4>Dr. Priya Sharma</h4><span>Neurology · Consultation</span></div><div class="appt-time">Jun 15</div></div>
        <div class="appt-item"><div class="appt-avatar">AN</div><div><h4>Dr. Anjali Nair</h4><span>Pediatrics · Check-up</span></div><div class="appt-time">Jun 22</div></div>
      </div>
    </div>
    <div class="dash-grid">
      <div class="dash-card">
        <h3>Health Distribution</h3>
        <div class="chart-area" style="height:180px;"><canvas id="patientPieChart"></canvas></div>
      </div>
      <div class="dash-card">
        <h3>Notifications</h3>
        <div class="notif-item info">🔵 Appointment reminder: Dr. Kapoor on Jun 8 at 10:00 AM</div>
        <div class="notif-item success">✅ Lab results from May 28 are now available</div>
        <div class="notif-item warn">⚠️ Prescription renewal due in 7 days</div>
        <div class="notif-item info">🔵 New blog article: Heart Health Tips from Dr. Kapoor</div>
      </div>
    </div>`;
    setTimeout(drawPatientCharts, 100);
  } else if(section === 'settings') {
    el.innerHTML = renderSettings('patient');
  } else {
    el.innerHTML = `<div class="dash-header"><div><h2>${section.charAt(0).toUpperCase()+section.slice(1)}</h2><p>Content coming soon</p></div></div><div style="text-align:center;padding:80px;color:var(--text-light);">🏗️ This section is under development.</div>`;
  }
}
function renderProviderDash(section) {
  const el = document.getElementById('provider-dash-content');
  if(!el) return;
  if(section === 'overview' || !section) {
    el.innerHTML = `
    <div class="dash-header">
      <div><h2>Provider Dashboard 👨‍⚕️</h2><p>Performance overview for Dr. Aryan Kapoor</p></div>
      <button class="btn btn-teal" style="padding:10px 20px;font-size:0.85rem;" onclick="dashSection(event, 'provider', 'analytics')">View Analytics</button>
    </div>
    <div class="metrics-grid">
      <div class="metric-card"><span class="metric-icon">👥</span><div class="label">Total Patients</div><div class="value">2.4K</div><div class="change up">↑ 12% this month</div></div>
      <div class="metric-card"><span class="metric-icon">📅</span><div class="label">Today's Appointments</div><div class="value">18</div><div class="change up">↑ 3 vs yesterday</div></div>
      <div class="metric-card"><span class="metric-icon">💰</span><div class="label">Monthly Revenue</div><div class="value">₹4.2L</div><div class="change up">↑ 8% MoM</div></div>
      <div class="metric-card"><span class="metric-icon">⭐</span><div class="label">Patient Rating</div><div class="value">4.9</div><div class="change up">↑ 0.1 pts</div></div>
    </div>
    <div class="dash-grid">
      <div class="dash-card">
        <h3>Revenue & Patients (2025)</h3>
        <div class="chart-area"><canvas id="providerBarChart"></canvas></div>
      </div>
      <div class="dash-card">
        <h3>Today's Schedule</h3>
        <div class="appt-item"><div class="appt-avatar" style="background:linear-gradient(135deg,#F97316,#EAB308);">RK</div><div><h4>Rajesh Kumar</h4><span>Follow-up · Cardiology</span></div><div class="appt-time">9:00 AM</div></div>
        <div class="appt-item"><div class="appt-avatar" style="background:linear-gradient(135deg,#8B5CF6,#EC4899);">SM</div><div><h4>Sunita Mehta</h4><span>New Patient · ECG</span></div><div class="appt-time">10:30 AM</div></div>
        <div class="appt-item"><div class="appt-avatar" style="background:linear-gradient(135deg,#10B981,#3B82F6);">VP</div><div><h4>Vijay Patel</h4><span>Post-op Check · BP</span></div><div class="appt-time">12:00 PM</div></div>
        <div class="appt-item"><div class="appt-avatar">KA</div><div><h4>Kavita Agarwal</h4><span>Consultation · Chest Pain</span></div><div class="appt-time">2:30 PM</div></div>
      </div>
    </div>
    <div class="dash-grid">
      <div class="dash-card">
        <h3>Performance Reports</h3>
        <div class="chart-area" style="height:180px;"><canvas id="providerDoughnut"></canvas></div>
      </div>
      <div class="dash-card">
        <h3>Notifications</h3>
        <div class="notif-item success">✅ 18 appointments confirmed for today</div>
        <div class="notif-item info">🔵 New patient referral from Dr. Sharma</div>
        <div class="notif-item warn">⚠️ Lab report pending for patient RK-1042</div>
        <div class="notif-item success">✅ Monthly performance report ready</div>
      </div>
    </div>`;
    setTimeout(drawProviderCharts, 100);
  } else if(section === 'settings') {
    el.innerHTML = renderSettings('provider');
  } else {
    el.innerHTML = `<div class="dash-header"><div><h2>${section.charAt(0).toUpperCase()+section.slice(1)}</h2><p>Content coming soon</p></div></div><div style="text-align:center;padding:80px;color:var(--text-light);">🏗️ This section is under development.</div>`;
  }
}
function renderSettings(type) {
  return `<div class="dash-header"><div><h2>Settings</h2><p>Manage your account preferences</p></div></div>
  <div class="settings-section">
    <h3>Profile Information</h3>
    <div class="form-row"><div class="form-group"><label>Full Name</label><input type="text" value="${type==='patient'?'Rahul Gupta':'Dr. Aryan Kapoor'}"></div><div class="form-group"><label>Email</label><input type="email" value="${type==='patient'?'rahul@email.com':'aryan.kapoor@medicareplus.in'}"></div></div>
    <div class="form-row"><div class="form-group"><label>Phone</label><input type="tel" value="+91 98765 43210"></div><div class="form-group"><label>Location</label><input type="text" value="Bengaluru, Karnataka"></div></div>
    <button class="btn btn-primary" style="margin-top:8px;">Save Changes</button>
  </div>
  <div class="settings-section">
    <h3>Notifications</h3>
    <div class="settings-row"><label>Email Notifications</label><div class="toggle on" onclick="this.classList.toggle('on')"></div></div>
    <div class="settings-row"><label>SMS Reminders</label><div class="toggle on" onclick="this.classList.toggle('on')"></div></div>
    <div class="settings-row"><label>Appointment Alerts</label><div class="toggle on" onclick="this.classList.toggle('on')"></div></div>
    <div class="settings-row"><label>Marketing Emails</label><div class="toggle" onclick="this.classList.toggle('on')"></div></div>
  </div>
  <div class="settings-section">
    <h3>Security</h3>
    <div class="form-group"><label>Current Password</label><input type="password" placeholder="••••••••"></div>
    <div class="form-row"><div class="form-group"><label>New Password</label><input type="password" placeholder="••••••••"></div><div class="form-group"><label>Confirm Password</label><input type="password" placeholder="••••••••"></div></div>
    <button class="btn btn-outline" style="margin-top:8px;">Update Password</button>
  </div>`;
}
function drawPatientCharts() {
  const lc = document.getElementById('patientLineChart');
  if(lc) {
    const ctx = lc.getContext('2d');
    lc.width = lc.offsetWidth; lc.height = lc.offsetHeight;
    drawLineChart(ctx, lc.width, lc.height, ['Jan','Feb','Mar','Apr','May','Jun'], [60,72,65,80,75,87], '#0A6EBD');
  }
  const pc = document.getElementById('patientPieChart');
  if(pc) {
    const ctx2 = pc.getContext('2d');
    pc.width = pc.offsetWidth; pc.height = pc.offsetHeight;
    drawPieChart(ctx2, pc.width, pc.height, ['Cardiology','General','Dental','Lab Tests'], [35,25,20,20], ['#0A6EBD','#00A99D','#FF6B35','#8B5CF6']);
  }
}
function drawProviderCharts() {
  const bc = document.getElementById('providerBarChart');
  if(bc) {
    const ctx = bc.getContext('2d');
    bc.width = bc.offsetWidth; bc.height = bc.offsetHeight;
    drawBarChart(ctx, bc.width, bc.height, ['Jan','Feb','Mar','Apr','May','Jun'], [2.8,3.1,2.9,3.6,4.0,4.2], '#00A99D');
  }
  const dc = document.getElementById('providerDoughnut');
  if(dc) {
    const ctx3 = dc.getContext('2d');
    dc.width = dc.offsetWidth; dc.height = dc.offsetHeight;
    drawPieChart(ctx3, dc.width, dc.height, ['Consultations','Procedures','Follow-ups','Emergency'], [40,25,25,10], ['#0A6EBD','#00A99D','#8B5CF6','#FF6B35'], true);
  }
}
function drawLineChart(ctx, W, H, labels, data, color) {
  const pad = {t:20,r:20,b:36,l:44};
  const w = W - pad.l - pad.r, h = H - pad.t - pad.b;
  const max = Math.max(...data) * 1.15, min = 0;
  const sx = i => pad.l + i * (w / (data.length - 1));
  const sy = v => pad.t + h - ((v - min) / (max - min)) * h;
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle = '#E2E8F0'; ctx.lineWidth = 1;
  for(let i=0;i<=4;i++){ const y = pad.t + i * (h/4); ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(pad.l+w,y); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(sx(0), sy(data[0])); data.forEach((v,i)=>{ if(i>0) ctx.lineTo(sx(i), sy(v)); }); ctx.lineTo(sx(data.length-1), pad.t+h); ctx.lineTo(pad.l, pad.t+h); ctx.closePath(); ctx.fillStyle='rgba(10,110,189,0.08)'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(sx(0), sy(data[0])); data.forEach((v,i)=>{ if(i>0) ctx.lineTo(sx(i), sy(v)); }); ctx.strokeStyle=color; ctx.lineWidth=2.5; ctx.stroke();
  data.forEach((v,i)=>{ ctx.beginPath(); ctx.arc(sx(i), sy(v), 4, 0, Math.PI*2); ctx.fillStyle='#fff'; ctx.fill(); ctx.strokeStyle=color; ctx.lineWidth=2; ctx.stroke(); });
  ctx.fillStyle='#6B7C93'; ctx.font='11px DM Sans,sans-serif'; ctx.textAlign='center'; labels.forEach((l,i)=>ctx.fillText(l, sx(i), H-8));
  ctx.textAlign='right'; for(let i=0;i<=4;i++){ const v=Math.round(min+(max-min)*(4-i)/4); ctx.fillText(v, pad.l-6, pad.t+i*(h/4)+4); }
}
function drawBarChart(ctx, W, H, labels, data, color) {
  const pad = {t:20,r:20,b:36,l:44};
  const w = W - pad.l - pad.r, h = H - pad.t - pad.b;
  const max = Math.max(...data) * 1.2;
  const bw = (w / data.length) * 0.55;
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle = '#E2E8F0'; ctx.lineWidth = 1;
  for(let i=0;i<=4;i++){ const y=pad.t+i*(h/4); ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(pad.l+w,y); ctx.stroke(); }
  data.forEach((v,i)=>{
    const x = pad.l + i*(w/data.length) + (w/data.length - bw)/2;
    const bh = (v/max)*h; const y = pad.t + h - bh;
    const grad = ctx.createLinearGradient(0,y,0,y+bh);
    grad.addColorStop(0,color); grad.addColorStop(1,color+'66');
    ctx.fillStyle = grad;
    ctx.beginPath();
    if(ctx.roundRect) ctx.roundRect(x,y,bw,bh,4);
    else ctx.rect(x,y,bw,bh);
    ctx.fill();
    ctx.fillStyle='#2C3E50'; ctx.font='bold 10px DM Sans,sans-serif'; ctx.textAlign='center'; ctx.fillText('₹'+v+'L', x + bw/2, y - 6);
  });
  ctx.fillStyle='#6B7C93'; ctx.font='11px DM Sans,sans-serif'; ctx.textAlign='center'; labels.forEach((l,i)=>ctx.fillText(l, pad.l + i*(w/data.length) + w/data.length/2, H-8));
  ctx.textAlign='right'; for(let i=0;i<=4;i++){ const v=(max*(4-i)/4).toFixed(1); ctx.fillText('₹'+v+'L', pad.l-4, pad.t + i*(h/4) + 4); }
}
function drawPieChart(ctx, W, H, labels, data, colors, doughnut=false) {
  ctx.clearRect(0,0,W,H);
  const total = data.reduce((sum,v)=>sum+v,0);
  const cx = W * 0.38, cy = H / 2, r = Math.min(W * 0.3, H * 0.42);
  let angle = -Math.PI/2;
  data.forEach((value, index) => {
    const slice = (value / total) * Math.PI * 2;
    ctx.beginPath();
    if(doughnut) {
      ctx.arc(cx, cy, r, angle, angle + slice);
      ctx.arc(cx, cy, r*0.55, angle + slice, angle, true);
    } else {
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + slice);
    }
    ctx.closePath();
    ctx.fillStyle = colors[index];
    ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    angle += slice;
  });
  const lx = W * 0.72, ly = cy - ((labels.length - 1) * 18) / 2;
  labels.forEach((label, index) => {
    ctx.fillStyle = colors[index];
    ctx.fillRect(lx, ly + index*22 - 8, 12, 12);
    ctx.fillStyle = '#2C3E50'; ctx.font = '11px DM Sans,sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(`${label} (${data[index]}%)`, lx + 16, ly + index*22 + 2);
  });
}
document.addEventListener('DOMContentLoaded', ()=>{
  setActiveNav();
  initAOS();
  initCounters();
  setTimeout(()=>{
    const loader = document.getElementById('loader');
    if(loader) {
      loader.classList.add('out');
      setTimeout(()=>loader.style.display='none', 600);
    }
  }, 800);
});
