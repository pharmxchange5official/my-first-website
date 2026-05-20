const API_URL = "https://script.google.com/macros/s/AKfycbz4xmPNpOaoq5FpnqdWHd-mYcbFQMgbHpBwcbag1ND7taSEE-fiJ-99Lo-gFNZLvWBFCw/exec";
const WHATSAPP_NUMBER = "918320765392";
const SITE_URL = "https://thecoworkcapital.netlify.app/";

const galleryImages = [
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAF4uERP-DO6Eszhlkq784a8f6YGSBWw6f3LWpNr2Y8oxNVkkOzI8tuQGRBV-2VUcc4cd_BZcxxkBBIA-AiBpXGKeXmKsaGOWvYg41h_vrNoS7WsOFzBXcK2Teqk00QEQWUs2HO1=w1200-h800-k-no",
    kicker: "Premium address",
    title: "A polished space before the meeting even begins.",
    copy: "Professional interiors, reception energy and a strong environment for client-facing work."
  },
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGJ6AkjrVs6LAhdsMcoI72VIzxPSUbRc3I5AGSpBDd_6AUiogaGuT_vNWg5PBQoIrzGOHF9aSHcSEq2kDxr_F1MQQPAF_ebb6eVDwiooYHIkVvdwKRbD7on4pVR49KzoCaArP5b=s1360-w1360-h1020-rw",
    kicker: "Focused work",
    title: "Cabins and desks with a calm business rhythm.",
    copy: "A complete professional atmosphere for serious work, sharp meetings and flexible growth."
  },
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEWwlTNk3oMK-0NMMjrEPruJjjJefAC8Evb53K_BjFZIsgHAuvINA7atZFXJFW4ok__t1zg4xApkoEm5tHigRYnEeBIeuMEOC6kyhHW_0RqOQY5Jps44xfs7UNlXd3BWS9NQ1mCOA=s1360-w1360-h1020-rw",
    kicker: "Desk ready",
    title: "A workday that feels structured from the first hour.",
    copy: "Use premium desk infrastructure, WiFi, pantry support and a proper professional setting."
  },
  {
    src: "https://thecoworkcapital.com/wp-content/uploads/elementor/thumbs/co-work-scaled-p0x1vliejv0a2op8mbf9jwjns7f39c6mab2cn4v8dc.jpg",
    kicker: "Community space",
    title: "Work close to entrepreneurial energy.",
    copy: "Meet, collaborate, take breaks and build stronger daily momentum."
  }
];

const amenities = [
  ["01", "Pool Table Breaks", "A new pool table facility for entrepreneurs to refresh their mind and start better conversations."],
  ["02", "Tournaments & Screenings", "Cricket championships, inside cowork tournaments and match screenings on demand."],
  ["03", "Private Calling Zones", "Phone booths and quiet corners for private calls, sales conversations and client work."],
  ["04", "Unlimited Tea & Coffee", "Cafeteria support with unlimited tea and coffee for daily working comfort."],
  ["05", "16000 Sq. Ft. Empire", "Large flexible office capacity in Ocean Building, Sarabhai Campus, Vadodara."],
  ["06", "Games That Network", "Pool, table tennis, carrom and chess create natural moments for founders to connect."],
  ["07", "Flexible Work Rhythm", "Day and night service, multiple cabin sizes and seat options for different work patterns."]
];

const serviceMap = {
  daypass: { title: "Book Quick Day Pass", mini: "Fast desk access", intro: "Reserve a desk for the day. Visit reception, confirm availability and start working.", selectedService: "Hot Desks / Quick Day Pass", serviceType: "daypass", submit: "Submit Day Pass Request" },
  tour: { title: "Book a Workspace Tour", mini: "Visit request", intro: "Share your preferred date and the team will help you experience the space.", selectedService: "Workspace Tour", serviceType: "standard", submit: "Submit Tour Request" },
  dedicated: { title: "Dedicated Desk Availability", mini: "Monthly workspace", intro: "Check availability for a fixed desk in a premium coworking environment.", selectedService: "Dedicated Desks", serviceType: "standard", submit: "Check Availability" },
  "private-cabin": { title: "Private Cabin Tour", mini: "Cabin enquiry", intro: "Tell us your team size and preferred start date for private cabin options.", selectedService: "Private Cabin", serviceType: "standard", submit: "Request Cabin Options" },
  conference: { title: "Conference Room Request", mini: "Meeting room", intro: "Share your date, time and guest count. Team will confirm availability.", selectedService: "Conference Room", serviceType: "conference", submit: "Submit Conference Request" },
  event: { title: "Event Space Request", mini: "Workshops & sessions", intro: "Plan a workshop, seminar or inside business event.", selectedService: "Event Space", serviceType: "event", submit: "Submit Event Request" },
  studio: { title: "Studio Space Request", mini: "Creative booking", intro: "Tell us about your shoot, podcast, interview or content requirement.", selectedService: "Studio Space", serviceType: "event", submit: "Submit Studio Request" }
};

const state = {
  sessionId: "S-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9),
  user: { name: "", mobile: "", email: "" },
  currentService: "tour",
  lastTicket: "",
  lastWhatsAppMessage: "",
  startedAt: Date.now(),
  formStarted: false,
  converted: false,
  validationErrors: 0,
  eventStream: []
};

document.addEventListener("DOMContentLoaded", () => {
  setupYear();
  setupLeadGate();
  setupButtons();
  setupMobileNav();
  setupModal();
  setupReveal();
  setupCursor();
  setupScrollProgress();
  setupHeroCarousel();
  setupAmenityShowcase();
  setupVisitFaq();
  setupTilt();
  setupMobileMasks();
  setTimeout(syncPageLock, 500);
  setTimeout(syncPageLock, 2000);
  logEvent("page_loaded", "Website opened");
});

window.addEventListener("beforeunload", () => logSession("page_exit"));

function setupYear(){
  const year = document.getElementById("year");
  if(year) year.textContent = new Date().getFullYear();
}

function setupLeadGate(){
  const gate = document.getElementById("leadGate");
  const form = document.getElementById("welcomeForm");
  if(!gate || !form) {
    unlockPage();
    return;
  }

  const saved = safeParse(localStorage.getItem("tcc_user_session"));
  const savedAt = Number(localStorage.getItem("tcc_user_session_time") || 0);
  const fiveMinutes = 5 * 60 * 1000;
  const stillFresh = savedAt && Date.now() - savedAt < fiveMinutes;

  if(saved && saved.name && saved.mobile && saved.email && stillFresh){
    state.user = {
      name: cleanName(saved.name),
      mobile: onlyDigits(saved.mobile).slice(-10),
      email: cleanEmail(saved.email)
    };
    hideLeadGate();
    prefillModalUser();
  } else {
    showLeadGate();
    setTimeout(() => document.getElementById("welcomeName")?.focus(), 450);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = cleanName(document.getElementById("welcomeName").value);
    const mobile = onlyDigits(document.getElementById("welcomeMobile").value).slice(-10);
    const email = cleanEmail(document.getElementById("welcomeEmail").value);

    clearErrors(form);
    let ok = true;
    if(name.length < 2){ setError("welcomeName", "Please enter your full name."); ok = false; }
    if(!isValidIndianMobile(mobile)){ setError("welcomeMobile", "Enter a valid 10 digit Indian mobile number."); ok = false; }
    if(!isValidEmail(email)){ setError("welcomeEmail", "Enter a valid email address."); ok = false; }
    if(!ok){ state.validationErrors++; return; }

    state.user = { name, mobile, email };
    localStorage.setItem("tcc_user_session", JSON.stringify(state.user));
    localStorage.setItem("tcc_user_session_time", String(Date.now()));
    sessionStorage.setItem("tcc_user_session", JSON.stringify(state.user));
    prefillModalUser();
    logEvent("entry_details_submitted", "First 3 details captured");

    // Important: unlock the homepage immediately. The visitor should never wait for the connection.
    hideLeadGate();

    apiCall("logEarlyLead", {
      sessionId: state.sessionId,
      name,
      mobile: "+91" + mobile,
      email,
      sourcePath: location.href,
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`
    });
  });
}

function showLeadGate(){
  const gate = document.getElementById("leadGate");
  if(gate) gate.classList.remove("hide");
  lockPage();
}

function hideLeadGate(){
  const gate = document.getElementById("leadGate");
  if(gate) {
    gate.classList.add("hide");
    gate.setAttribute("aria-hidden", "true");
  }
  unlockPage();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function lockPage(){
  document.body.classList.add("no-scroll");
}

function unlockPage(){
  document.body.classList.remove("no-scroll");
  document.documentElement.style.overflowY = "auto";
  document.body.style.overflowY = "auto";
}

function syncPageLock(){
  const gateVisible = document.getElementById("leadGate") && !document.getElementById("leadGate").classList.contains("hide");
  const modalVisible = document.getElementById("enquiryModal")?.classList.contains("show");
  if(gateVisible || modalVisible) lockPage();
  else unlockPage();
}

function setupButtons(){
  document.querySelectorAll("[data-open-form]").forEach(btn => {
    btn.addEventListener("click", () => openEnquiry(btn.dataset.openForm || "tour"));
  });
  document.querySelectorAll(".solution-card[data-open-form]").forEach(card => {
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.addEventListener("keydown", (e) => { if(e.key === "Enter") openEnquiry(card.dataset.openForm); });
  });
}

function setupMobileNav(){
  const btn = document.getElementById("mobileNavBtn");
  const nav = document.getElementById("navPill");
  if(!btn || !nav) return;
  btn.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
}

function setupModal(){
  const form = document.getElementById("enquiryForm");
  const gst = document.getElementById("hasGst");
  const whatsAppBtn = document.getElementById("whatsAppBtn");
  if(!form) return;

  document.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeEnquiry));
  document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeEnquiry(); });

  gst?.addEventListener("change", () => {
    document.getElementById("gstFields")?.classList.toggle("show", gst.checked);
  });

  form.addEventListener("submit", handleEnquirySubmit);

  whatsAppBtn?.addEventListener("click", () => {
    if(state.lastWhatsAppMessage){
      window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(state.lastWhatsAppMessage), "_blank");
      logEvent("whatsapp_opened", state.lastTicket || "");
    }
  });
}

function openEnquiry(type = "tour"){
  state.currentService = serviceMap[type] ? type : "tour";
  const config = serviceMap[state.currentService];
  state.formStarted = true;

  setText("modalMini", config.mini);
  setText("modalTitle", config.title);
  setText("modalIntro", config.intro);
  setVal("serviceType", config.serviceType);
  setVal("selectedService", config.selectedService);
  const submit = document.querySelector(".submit-btn");
  if(submit) submit.textContent = config.submit;

  const ticket = generateTicketId(config.serviceType);
  setVal("ticketId", ticket);
  state.lastTicket = ticket;

  prefillModalUser();
  resetEnquiryFormByService(config);
  clearErrors(document.getElementById("enquiryForm"));
  document.getElementById("successPanel")?.classList.remove("show");
  document.getElementById("enquiryForm")?.classList.remove("hide");

  document.getElementById("enquiryModal")?.classList.add("show");
  lockPage();
  logEvent("form_opened", config.selectedService);
}

function resetEnquiryFormByService(config){
  setVal("people", config.serviceType === "conference" ? "4" : "1");
  setVal("city", "Vadodara");
  setVal("message", "");
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().slice(0,10);
  const date = document.getElementById("preferredDate");
  if(date){ date.min = new Date().toISOString().slice(0,10); if(!date.value) date.value = minDate; }
}

function closeEnquiry(){
  document.getElementById("enquiryModal")?.classList.remove("show");
  syncPageLock();
}

async function handleEnquirySubmit(e){
  e.preventDefault();
  const form = e.currentTarget;
  clearErrors(form);

  const name = cleanName(document.getElementById("leadName").value);
  const mobile = onlyDigits(document.getElementById("leadMobile").value);
  const email = cleanEmail(document.getElementById("leadEmail").value);
  const date = document.getElementById("preferredDate").value;
  const gstChecked = document.getElementById("hasGst").checked;
  const gstNumber = (document.getElementById("gstNumber").value || "").trim().toUpperCase();

  let ok = true;
  if(name.length < 2){ setError("leadName", "Please enter your name."); ok = false; }
  if(!isValidIndianMobile(mobile)){ setError("leadMobile", "Enter a valid 10 digit mobile number."); ok = false; }
  if(!isValidEmail(email)){ setError("leadEmail", "Enter a valid email."); ok = false; }
  if(!date){ setError("preferredDate", "Please choose a date."); ok = false; }
  if(gstChecked && !isValidGSTIN(gstNumber)){ setError("gstNumber", "Enter valid 15 character GSTIN."); ok = false; }
  if(!ok){ state.validationErrors++; logEvent("form_validation_failed", state.currentService); return; }

  state.user = { name, mobile, email };
  sessionStorage.setItem("tcc_user_session", JSON.stringify(state.user));
  localStorage.setItem("tcc_user_session", JSON.stringify(state.user));
  localStorage.setItem("tcc_user_session_time", String(Date.now()));

  const config = serviceMap[state.currentService];
  const payload = {
    sessionId: state.sessionId,
    ticketId: document.getElementById("ticketId").value || generateTicketId(config.serviceType),
    name,
    mobile: "+91" + mobile,
    email,
    company: val("company"),
    selectedService: config.selectedService,
    serviceType: config.serviceType,
    priceDisplay: priceForService(config.serviceType, config.selectedService),
    people: val("people") || "1",
    city: val("city") || "Vadodara",
    date,
    preferredTime: val("preferredTime"),
    purpose: config.selectedService,
    note: val("message"),
    hasGst: gstChecked ? "Yes" : "No",
    gstNumber: gstChecked ? gstNumber : "",
    gstFirm: gstChecked ? val("gstFirm") : "",
    sourcePath: location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    eventStream: JSON.stringify(state.eventStream.slice(-25))
  };

  const submitBtn = form.querySelector(".submit-btn");
  const original = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  const action = config.serviceType === "conference" ? "submitConference" : "submitInquiry";
  await apiCall(action, payload);
  state.converted = true;
  state.lastTicket = payload.ticketId;
  state.lastWhatsAppMessage = buildWhatsAppMessage(payload);
  logEvent("form_submitted", payload.ticketId);
  logSession("converted");

  submitBtn.disabled = false;
  submitBtn.textContent = original;
  showSuccess(payload);
}

function showSuccess(payload){
  document.getElementById("enquiryForm")?.classList.add("hide");
  document.getElementById("successPanel")?.classList.add("show");
  setText("ticketDisplay", payload.ticketId);
  setText("successTitle", `Thank you, ${payload.name.split(" ")[0]}.`);
  setText("successCopy", `Your ${payload.selectedService} request has been received. Our team will review it and connect with you shortly. A WhatsApp message is ready if you want faster coordination.`);
}

function buildWhatsAppMessage(p){
  return `Hello The Co Work Capital,

My enquiry ticket is ${p.ticketId}.

Requirement: ${p.selectedService}
Name: ${p.name}
Mobile: ${p.mobile}
Email: ${p.email}
People/Passes: ${p.people}
Date: ${p.date}
Time: ${p.preferredTime || "Flexible"}
Message: ${p.note || "Please guide me."}`;
}

function setupReveal(){
  const items = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting){
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
  items.forEach(el => io.observe(el));
}

function setupCursor(){
  const orb = document.getElementById("cursorOrb");
  if(!orb || matchMedia("(pointer: coarse)").matches) return;
  let x = 0, y = 0, tx = 0, ty = 0;
  window.addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  function loop(){
    x += (tx - x) * .12;
    y += (ty - y) * .12;
    orb.style.left = x + "px";
    orb.style.top = y + "px";
    requestAnimationFrame(loop);
  }
  loop();
}

function setupScrollProgress(){
  const line = document.getElementById("progressLine");
  if(!line) return;
  let ticking = false;
  window.addEventListener("scroll", () => {
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const h = document.documentElement.scrollHeight - innerHeight;
      line.style.width = (h ? scrollY / h * 100 : 0) + "%";
      ticking = false;
    });
  }, { passive: true });
}

function setupHeroCarousel(){
  const img = document.getElementById("heroCarouselImage");
  const kicker = document.getElementById("heroCarouselKicker");
  const title = document.getElementById("heroCarouselTitle");
  const copy = document.getElementById("heroCarouselCopy");
  const dots = document.getElementById("carouselDots");
  if(!img || !dots) return;

  galleryImages.forEach((_, i) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `Show image ${i+1}`);
    button.addEventListener("click", () => setSlide(i, true));
    dots.appendChild(button);
  });

  let index = 0;
  let timer = null;
  function setSlide(i, manual = false){
    index = (i + galleryImages.length) % galleryImages.length;
    const slide = galleryImages[index];
    img.style.opacity = "0";
    setTimeout(() => {
      img.src = slide.src;
      kicker.textContent = slide.kicker;
      title.textContent = slide.title;
      copy.textContent = slide.copy;
      img.style.opacity = "1";
      [...dots.children].forEach((d, idx) => d.classList.toggle("active", idx === index));
    }, 180);
    if(manual){ clearInterval(timer); timer = setInterval(() => setSlide(index + 1), 5200); }
  }
  setSlide(0);
  timer = setInterval(() => setSlide(index + 1), 5200);
}

function setupAmenityShowcase(){
  const number = document.getElementById("amenityNumber");
  const title = document.getElementById("amenityTitle");
  const copy = document.getElementById("amenityCopy");
  if(!number || !title || !copy) return;
  let i = 0;
  setInterval(() => {
    i = (i + 1) % amenities.length;
    [number, title, copy].forEach(el => el.style.opacity = "0");
    setTimeout(() => {
      number.textContent = amenities[i][0];
      title.textContent = amenities[i][1];
      copy.textContent = amenities[i][2];
      [number, title, copy].forEach(el => el.style.opacity = "1");
    }, 220);
  }, 3200);
}


function setupVisitFaq(){
  const section = document.querySelector("[data-visit-faq]");
  if(!section) return;

  const cards = [...section.querySelectorAll(".visit-faq-card")];

  function closeCard(card){
    card.classList.remove("active");
    const btn = card.querySelector(".visit-faq-q");
    const answer = card.querySelector(".visit-faq-a");
    if(btn) btn.setAttribute("aria-expanded", "false");
    if(answer) answer.style.maxHeight = null;
  }

  function openCard(card){
    card.classList.add("active");
    const btn = card.querySelector(".visit-faq-q");
    const answer = card.querySelector(".visit-faq-a");
    if(btn) btn.setAttribute("aria-expanded", "true");
    if(answer) answer.style.maxHeight = answer.scrollHeight + "px";
  }

  cards.forEach((card, index) => {
    const button = card.querySelector(".visit-faq-q");
    if(!button) return;
    if(card.classList.contains("active")) openCard(card);

    button.addEventListener("click", () => {
      const isActive = card.classList.contains("active");
      cards.forEach(closeCard);
      if(!isActive) openCard(card);
      logEvent("faq_clicked", button.innerText.trim());
    });

    if(index === 0) openCard(card);
  });
}

function setupTilt(){
  if(matchMedia("(pointer: coarse)").matches) return;
  document.querySelectorAll(".tilt, .tilt-soft").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const strength = card.classList.contains("tilt-soft") ? 5 : 8;
      const rx = ((y / r.height) - .5) * -strength;
      const ry = ((x / r.width) - .5) * strength;
      card.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
}

function setupMobileMasks(){
  ["welcomeMobile", "leadMobile"].forEach(id => {
    const input = document.getElementById(id);
    input?.addEventListener("input", () => input.value = onlyDigits(input.value).slice(0, 10));
  });
  const gst = document.getElementById("gstNumber");
  gst?.addEventListener("input", () => gst.value = gst.value.toUpperCase().replace(/[^0-9A-Z]/g, "").slice(0, 15));
}

function prefillModalUser(){
  setVal("leadName", state.user.name || "");
  setVal("leadMobile", state.user.mobile || "");
  setVal("leadEmail", state.user.email || "");
}

async function apiCall(action, data = {}){
  if(!API_URL) return false;
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeout = controller ? setTimeout(() => controller.abort(), 4500) : null;
  try{
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({ action, data }),
      signal: controller ? controller.signal : undefined,
      keepalive: JSON.stringify({ action, data }).length < 60000
    });
    return true;
  }catch(err){
    console.warn("Connection note", action, err && err.message ? err.message : err);
    return false;
  }finally{
    if(timeout) clearTimeout(timeout);
  }
}

function logSession(reason){
  const data = {
    sessionId: state.sessionId,
    name: state.user.name,
    mobile: state.user.mobile ? "+91" + state.user.mobile : "",
    email: state.user.email,
    totalDurationSeconds: Math.round((Date.now() - state.startedAt) / 1000),
    converted: state.converted,
    formStarted: state.formStarted,
    validationErrorCount: state.validationErrors,
    lastStep: reason,
    heartbeatReason: reason,
    sourcePath: location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    deviceType: matchMedia("(max-width: 700px)").matches ? "Mobile" : "Desktop",
    eventStream: JSON.stringify(state.eventStream.slice(-35))
  };
  if(navigator.sendBeacon){
    try{
      navigator.sendBeacon(API_URL, JSON.stringify({action:"logSession", data}));
      return;
    }catch(e){}
  }
  apiCall("logSession", data);
}

function logEvent(name, value){
  state.eventStream.push({ time: new Date().toISOString(), name, value });
  if(state.eventStream.length > 70) state.eventStream.shift();
}

function generateTicketId(type){
  const prefix = type === "conference" ? "CONF" : type === "daypass" ? "DAY" : type === "event" ? "EVT" : "INQ";
  return `TCC-${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}
function priceForService(type, service){
  if(type === "daypass") return "₹500/day + GST";
  if(type === "conference") return "As per room/hour availability";
  if(service.includes("Dedicated")) return "From ₹6,000/month + GST";
  return "As discussed with team + GST";
}
function cleanName(v){ return String(v || "").replace(/\s+/g," ").trim(); }
function cleanEmail(v){ return String(v || "").trim().toLowerCase(); }
function onlyDigits(v){ return String(v || "").replace(/\D/g,""); }
function isValidIndianMobile(v){ return /^[6-9]\d{9}$/.test(v); }
function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
function isValidGSTIN(v){ return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(v); }
function setVal(id, value){ const el = document.getElementById(id); if(el) el.value = value; }
function val(id){ return (document.getElementById(id)?.value || "").trim(); }
function setText(id, value){ const el = document.getElementById(id); if(el) el.textContent = value; }
function clearErrors(scope){ scope?.querySelectorAll(".field-error").forEach(el => el.textContent = ""); }
function setError(id, message){
  const el = document.getElementById(id);
  const wrap = el?.closest("label") || el?.parentElement?.closest("label");
  const small = wrap?.querySelector(".field-error");
  if(small) small.textContent = message;
}
function safeParse(v){ try{return JSON.parse(v)}catch{return null} }


/* ===== Premium V5 behaviour upgrades ===== */
document.addEventListener("DOMContentLoaded", () => {
  setupPremiumPointerField();
  setupNavigationMotion();
  setupSolutionCardMotion();
});

function setupPremiumPointerField(){
  if(matchMedia("(pointer: coarse)").matches) return;
  let ticking = false;
  window.addEventListener("pointermove", (e) => {
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty("--cursor-x", e.clientX + "px");
      document.documentElement.style.setProperty("--cursor-y", e.clientY + "px");
      ticking = false;
    });
  }, { passive:true });
}

function setupNavigationMotion(){
  const clickable = document.querySelectorAll('a[href^="#"], [data-open-form], .nav-pill a, .btn');
  clickable.forEach(el => {
    el.addEventListener("click", () => {
      document.body.classList.add("is-clicking");
      setTimeout(() => document.body.classList.remove("is-clicking"), 560);
    });
  });
}

function setupSolutionCardMotion(){
  document.querySelectorAll(".solution-card").forEach(card => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--card-x", (e.clientX - r.left) + "px");
      card.style.setProperty("--card-y", (e.clientY - r.top) + "px");
    }, { passive:true });
    card.addEventListener("mouseenter", () => card.classList.add("peek"));
    card.addEventListener("mouseleave", () => card.classList.remove("peek"));
    card.addEventListener("focus", () => card.classList.add("peek"));
    card.addEventListener("blur", () => card.classList.remove("peek"));
  });
}
