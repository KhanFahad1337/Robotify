/* ══════════════════════════════════════════════
   ROBOTIFY CHATBOT WIDGET
   Custom-built — no third party, no monthly fees.
   Leads go directly to WhatsApp +923337085256
══════════════════════════════════════════════ */
(function(){

const WA_NUM = '923337085256';
const BOT_COLOR = '#00d4ff';

// ─── Questions flow ───
const FLOW = {
  start: {
    msg: "👋 Hi! I'm Robotify's assistant.\n\nWhat can I help you with today?",
    opts: [
      { label: '🤖 AI Robotics / Automation', next: 'robotics' },
      { label: '☀️ Solar Energy', next: 'solar' },
      { label: '🎓 Final Year Project (FYP)', next: 'fyp' },
      { label: '📡 IoT / Arduino / ESP32', next: 'iot' },
      { label: '⚡ Digital Logic Design', next: 'dld' },
      { label: '📦 Other / General Inquiry', next: 'other' },
    ]
  },
  robotics: {
    msg: "Great! For Robotics & Automation:\n\nWhat are you looking to build?",
    opts: [
      { label: '🦾 Robotic Arm', next: 'contact_robotics' },
      { label: '🚗 Autonomous Vehicle / RC Car', next: 'contact_robotics' },
      { label: '👁️ Computer Vision System', next: 'contact_robotics' },
      { label: '🏭 Industrial Automation', next: 'contact_robotics' },
      { label: '🔙 Go Back', next: 'start' },
    ]
  },
  solar: {
    msg: "☀️ Solar Energy Services:\n\nWhat type of solar project do you need?",
    opts: [
      { label: '🏠 Residential (Home)', next: 'solar_size' },
      { label: '🏢 Commercial / Office', next: 'solar_size' },
      { label: '🔋 Off-Grid / Hybrid System', next: 'solar_size' },
      { label: '📊 Energy Monitoring Only', next: 'contact_solar' },
      { label: '🔙 Go Back', next: 'start' },
    ]
  },
  solar_size: {
    msg: "What is your approximate electricity bill per month?",
    opts: [
      { label: '💡 Under Rs. 5,000', next: 'contact_solar' },
      { label: '💡 Rs. 5,000 – 15,000', next: 'contact_solar' },
      { label: '💡 Rs. 15,000 – 30,000', next: 'contact_solar' },
      { label: '💡 Over Rs. 30,000', next: 'contact_solar' },
    ]
  },
  fyp: {
    msg: "🎓 Final Year Project Support:\n\nWhich best describes your FYP?",
    opts: [
      { label: '🤖 Robotics / Hardware FYP', next: 'fyp_detail' },
      { label: '💻 Software / App FYP', next: 'fyp_detail' },
      { label: '🧠 AI / Machine Learning FYP', next: 'fyp_detail' },
      { label: '⚡ Electronics / Circuit FYP', next: 'fyp_detail' },
      { label: '🔙 Go Back', next: 'start' },
    ]
  },
  fyp_detail: {
    msg: "How far along is your FYP?",
    opts: [
      { label: '🌱 Just starting — need idea', next: 'contact_fyp' },
      { label: '📐 Have idea, need help building', next: 'contact_fyp' },
      { label: '🔧 Half done, need to finish', next: 'contact_fyp' },
      { label: '🚨 Defence is soon — urgent!', next: 'contact_fyp' },
    ]
  },
  iot: {
    msg: "📡 IoT & Embedded Systems:\n\nWhat type of project?",
    opts: [
      { label: '🏠 Home Automation', next: 'contact_iot' },
      { label: '🌱 Smart Agriculture / Environment', next: 'contact_iot' },
      { label: '⚡ Energy Monitoring', next: 'contact_iot' },
      { label: '🚪 Security / Access Control', next: 'contact_iot' },
      { label: '🔙 Go Back', next: 'start' },
    ]
  },
  dld: {
    msg: "⚡ Digital Logic Design:\n\nWhat do you need?",
    opts: [
      { label: '🧩 Logic Circuit Design', next: 'contact_dld' },
      { label: '💾 FPGA / Verilog / VHDL', next: 'contact_dld' },
      { label: '📊 Proteus / Multisim Simulation', next: 'contact_dld' },
      { label: '📝 DLD Assignment / Lab Help', next: 'contact_dld' },
      { label: '🔙 Go Back', next: 'start' },
    ]
  },
  other: {
    msg: "No problem! Tell us more about what you need and we'll connect you with the right team member.",
    opts: [
      { label: '💬 Chat on WhatsApp', next: '__wa__' },
      { label: '📧 Send Email Instead', next: '__email__' },
      { label: '🔙 Go Back', next: 'start' },
    ]
  },
  contact_robotics: { msg: "Perfect! Let's connect you with our Robotics Engineer.\n\nPlease share your name and requirement on WhatsApp and we'll get back to you within 1 hour! 🤖", opts:[{label:'💬 Open WhatsApp',next:'__wa_robotics__'},{label:'🔙 Start Over',next:'start'}] },
  contact_solar:    { msg: "Excellent! Our Solar Engineer will prepare a custom quote for you.\n\nPlease share your location in Karachi on WhatsApp for a site visit! ☀️",   opts:[{label:'💬 Open WhatsApp',next:'__wa_solar__'},{label:'🔙 Start Over',next:'start'}] },
  contact_fyp:      { msg: "We've helped 50+ students ace their FYP defence! 🎓\n\nShare your university, department and deadline on WhatsApp and we'll start immediately.",  opts:[{label:'💬 Open WhatsApp',next:'__wa_fyp__'},{label:'🔙 Start Over',next:'start'}] },
  contact_iot:      { msg: "Great project idea! Our IoT team is ready.\n\nChat with us on WhatsApp with your requirements and we'll send you a quote within 2 hours 📡", opts:[{label:'💬 Open WhatsApp',next:'__wa_iot__'},{label:'🔙 Start Over',next:'start'}] },
  contact_dld:      { msg: "No problem! Our Digital Logic experts are here.\n\nSend us your assignment or circuit details on WhatsApp ⚡",                                   opts:[{label:'💬 Open WhatsApp',next:'__wa_dld__'},{label:'🔙 Start Over',next:'start'}] },
};

const WA_MSGS = {
  '__wa__':          `Hi Robotify! I have a general inquiry.`,
  '__email__':       null,
  '__wa_robotics__': `Hi Robotify! I'm interested in a Robotics/Automation project. Please assist me.`,
  '__wa_solar__':    `Hi Robotify! I'm interested in a Solar Energy installation. Please send me a quote.`,
  '__wa_fyp__':      `Hi Robotify! I need help with my Final Year Project (FYP). Please guide me.`,
  '__wa_iot__':      `Hi Robotify! I need an IoT/Arduino project. Please assist me.`,
  '__wa_dld__':      `Hi Robotify! I need help with Digital Logic Design. Please assist me.`,
};

// ─── Build widget HTML ───
const style = document.createElement('style');
style.textContent = `
#rb-chat-btn{
  position:fixed;bottom:28px;right:28px;z-index:8000;
  width:60px;height:60px;border-radius:50%;
  background:var(--bg2,#040c10);border:2px solid ${BOT_COLOR};
  box-shadow:0 0 20px rgba(0,212,255,0.35),0 4px 24px rgba(0,0,0,0.6);
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  transition:transform .3s,box-shadow .3s;
  animation:rb-pulse 2.5s ease-in-out infinite;
}
#rb-chat-btn:hover{transform:scale(1.1);box-shadow:0 0 32px rgba(0,212,255,0.5);}
@keyframes rb-pulse{0%,100%{box-shadow:0 0 20px rgba(0,212,255,0.35),0 4px 24px rgba(0,0,0,0.6);}50%{box-shadow:0 0 36px rgba(0,212,255,0.6),0 4px 24px rgba(0,0,0,0.6);}}
#rb-chat-btn svg{transition:transform .3s;}
#rb-chat-btn.open svg{transform:rotate(45deg);}
.rb-notif{
  position:absolute;top:-4px;right:-4px;width:18px;height:18px;
  border-radius:50%;background:#ff6b35;border:2px solid #020608;
  display:flex;align-items:center;justify-content:center;
  font-size:10px;font-weight:700;color:#fff;font-family:sans-serif;
  animation:rb-pulse 1.5s ease-in-out infinite;
}
#rb-chat-box{
  position:fixed;bottom:100px;right:28px;z-index:7999;
  width:340px;max-height:520px;
  background:#040c12;border:1px solid rgba(0,212,255,0.2);
  border-radius:12px;overflow:hidden;
  box-shadow:0 24px 64px rgba(0,0,0,0.8),0 0 32px rgba(0,212,255,0.08);
  display:flex;flex-direction:column;
  transform:scale(0.85) translateY(20px);opacity:0;pointer-events:none;
  transition:transform .3s ease,opacity .3s ease;transform-origin:bottom right;
}
#rb-chat-box.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all;}
.rb-header{
  background:linear-gradient(135deg,#061828,#040c12);
  border-bottom:1px solid rgba(0,212,255,0.15);
  padding:16px 18px;display:flex;align-items:center;gap:12px;flex-shrink:0;
}
.rb-avatar{
  width:40px;height:40px;border-radius:50%;background:rgba(0,212,255,0.1);
  border:1.5px solid ${BOT_COLOR};display:flex;align-items:center;justify-content:center;
  font-size:18px;flex-shrink:0;
}
.rb-hinfo{flex:1;}
.rb-hname{font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:700;color:#edf5fa;letter-spacing:.04em;}
.rb-hstatus{font-family:'Rajdhani',sans-serif;font-size:11px;color:#39ff14;letter-spacing:.08em;display:flex;align-items:center;gap:5px;}
.rb-hstatus::before{content:'';width:6px;height:6px;border-radius:50%;background:#39ff14;animation:rb-pulse 1.5s infinite;}
.rb-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth;}
.rb-messages::-webkit-scrollbar{width:4px;}
.rb-messages::-webkit-scrollbar-track{background:transparent;}
.rb-messages::-webkit-scrollbar-thumb{background:rgba(0,212,255,0.2);border-radius:2px;}
.rb-msg{max-width:88%;animation:rb-msg-in .3s ease both;}
@keyframes rb-msg-in{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
.rb-msg.bot .rb-bubble{
  background:#061828;border:1px solid rgba(0,212,255,0.12);
  border-radius:12px 12px 12px 2px;
  padding:10px 14px;font-family:'Rajdhani',sans-serif;font-size:13px;
  color:#c8d8e4;line-height:1.65;white-space:pre-line;
}
.rb-msg.user .rb-bubble{
  background:rgba(0,212,255,0.12);border:1px solid rgba(0,212,255,0.2);
  border-radius:12px 12px 2px 12px;
  padding:10px 14px;font-family:'Rajdhani',sans-serif;font-size:13px;
  color:#edf5fa;text-align:right;
}
.rb-msg.user{align-self:flex-end;}
.rb-opts{display:flex;flex-direction:column;gap:6px;margin-top:4px;}
.rb-opt{
  font-family:'Rajdhani',sans-serif;font-size:12px;font-weight:600;
  letter-spacing:.05em;padding:8px 14px;
  background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.18);
  border-radius:8px;color:#00d4ff;cursor:pointer;text-align:left;
  transition:all .2s;
}
.rb-opt:hover{background:rgba(0,212,255,0.12);border-color:rgba(0,212,255,0.4);}
.rb-footer{
  border-top:1px solid rgba(0,212,255,0.1);
  padding:10px 16px;display:flex;align-items:center;justify-content:space-between;
  flex-shrink:0;
}
.rb-footer-txt{font-family:'Rajdhani',sans-serif;font-size:10px;color:#2a4050;letter-spacing:.08em;text-transform:uppercase;}
.rb-wa-btn{
  display:flex;align-items:center;gap:6px;
  font-family:'Rajdhani',sans-serif;font-size:11px;font-weight:700;
  color:#25d366;letter-spacing:.08em;text-decoration:none;
  border:1px solid rgba(37,211,102,.25);padding:5px 10px;border-radius:6px;
  transition:all .2s;
}
.rb-wa-btn:hover{background:rgba(37,211,102,.08);}
.rb-typing{display:flex;align-items:center;gap:4px;padding:8px 0;}
.rb-typing span{width:6px;height:6px;border-radius:50%;background:rgba(0,212,255,0.5);animation:rb-type .8s ease-in-out infinite;}
.rb-typing span:nth-child(2){animation-delay:.15s;}
.rb-typing span:nth-child(3){animation-delay:.3s;}
@keyframes rb-type{0%,100%{transform:translateY(0);opacity:.4;}50%{transform:translateY(-5px);opacity:1;}}
@media(max-width:400px){
  #rb-chat-box{width:calc(100vw - 20px);right:10px;bottom:90px;}
  #rb-chat-btn{right:16px;bottom:16px;}
}`;
document.head.appendChild(style);

// ─── Widget markup ───
const widget = document.createElement('div');
widget.innerHTML = `
<button id="rb-chat-btn" aria-label="Open Robotify Chat">
  <span class="rb-notif">1</span>
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${BOT_COLOR}" stroke-width="1.8">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    <circle cx="9" cy="10" r="1" fill="${BOT_COLOR}"/>
    <circle cx="12" cy="10" r="1" fill="${BOT_COLOR}"/>
    <circle cx="15" cy="10" r="1" fill="${BOT_COLOR}"/>
  </svg>
</button>
<div id="rb-chat-box">
  <div class="rb-header">
    <div class="rb-avatar">🤖</div>
    <div class="rb-hinfo">
      <div class="rb-hname">Robotify Assistant</div>
      <div class="rb-hstatus">Online — replies instantly</div>
    </div>
  </div>
  <div class="rb-messages" id="rb-msgs"></div>
  <div class="rb-footer">
    <span class="rb-footer-txt">Powered by Robotify</span>
    <a class="rb-wa-btn" href="https://wa.me/${WA_NUM}" target="_blank">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
      WhatsApp
    </a>
  </div>
</div>`;
document.body.appendChild(widget);

const btn = document.getElementById('rb-chat-btn');
const box = document.getElementById('rb-chat-box');
const msgs = document.getElementById('rb-msgs');
let isOpen = false;
let currentStep = 'start';
let hasOpened = false;

btn.addEventListener('click', function(){
  isOpen = !isOpen;
  box.classList.toggle('open', isOpen);
  btn.classList.toggle('open', isOpen);
  btn.querySelector('.rb-notif').style.display = 'none';
  if(!hasOpened){ hasOpened = true; setTimeout(()=>showStep('start'), 300); }
});

function showStep(key){
  currentStep = key;
  const step = FLOW[key];
  if(!step) return;
  // Show typing indicator
  const typing = document.createElement('div');
  typing.className = 'rb-msg bot';
  typing.innerHTML = '<div class="rb-bubble"><div class="rb-typing"><span></span><span></span><span></span></div></div>';
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;
  setTimeout(()=>{
    msgs.removeChild(typing);
    // Bot message
    const msgEl = document.createElement('div');
    msgEl.className = 'rb-msg bot';
    let optsHtml = step.opts.map(o=>`<button class="rb-opt" data-next="${o.next}">${o.label}</button>`).join('');
    msgEl.innerHTML = `<div class="rb-bubble">${step.msg}</div><div class="rb-opts">${optsHtml}</div>`;
    msgs.appendChild(msgEl);
    msgs.scrollTop = msgs.scrollHeight;
    // Bind option clicks
    msgEl.querySelectorAll('.rb-opt').forEach(b=>{
      b.addEventListener('click', function(){
        const next = this.dataset.next;
        const label = this.textContent;
        // Disable all options in this step
        msgEl.querySelectorAll('.rb-opt').forEach(x=>{x.disabled=true;x.style.opacity='.4';});
        // Show user choice
        const userEl = document.createElement('div');
        userEl.className = 'rb-msg user';
        userEl.innerHTML = `<div class="rb-bubble">${label}</div>`;
        msgs.appendChild(userEl);
        msgs.scrollTop = msgs.scrollHeight;
        // Handle special actions
        if(next.startsWith('__wa')){
          const waMsg = WA_MSGS[next] || WA_MSGS['__wa__'];
          if(next === '__email__'){
            window.location.href = 'mailto:info@robotify.pk?subject=Robotify Inquiry';
          } else {
            window.open(`https://wa.me/${WA_NUM}?text=${encodeURIComponent(waMsg)}`, '_blank');
          }
          // Show a final message
          setTimeout(()=>{
            const fin = document.createElement('div');
            fin.className = 'rb-msg bot';
            fin.innerHTML = `<div class="rb-bubble">✅ Opening WhatsApp...\n\nWe'll respond within 1 hour!\n\nFeel free to also reach us at:\n📞 +92 333 708 5256</div>`;
            msgs.appendChild(fin);
            msgs.scrollTop = msgs.scrollHeight;
          }, 400);
        } else {
          setTimeout(()=>showStep(next), 400);
        }
      });
    });
  }, 800);
}

// Auto-open greeting after 5 seconds on first visit
setTimeout(()=>{
  if(!isOpen && !hasOpened){
    const notif = btn.querySelector('.rb-notif');
    if(notif) notif.style.display = 'flex';
  }
}, 5000);

})();
