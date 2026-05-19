const API_URL = "https://script.google.com/macros/s/AKfycbz4xmPNpOaoq5FpnqdWHd-mYcbFQMgbHpBwcbag1ND7taSEE-fiJ-99Lo-gFNZLvWBFCw/exec";
const WHATSAPP_NUMBER = "918320765392";
const SITE_URL = "https://thecoworkcapital.netlify.app/";

const galleryImages = [
  {
    src: "https://thecoworkcapital.com/wp-content/uploads/elementor/thumbs/SRP_0396-scaled-q2yoopflhhy0z8n5wbxf6gbzts0h6883nvw3djsh0g.jpg",
    kicker: "Workspace Operating System",
    title: "Cabins, desks, meetings and creative energy.",
    copy: "A complete professional atmosphere for serious work, sharp meetings and flexible growth."
  },
  {
    src: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAF4uERP-DO6Eszhlkq784a8f6YGSBWw6f3LWpNr2Y8oxNVkkOzI8tuQGRBV-2VUcc4cd_BZcxxkBBIA-AiBpXGKeXmKsaGOWvYg41h_vrNoS7WsOFzBXcK2Teqk00QEQWUs2HO1=w1200-h800-k-no",
    kicker: "Premium address",
    title: "A polished space before the meeting even begins.",
    copy: "Professional interiors, reception energy and a strong environment for client-facing work."
  },
  {
    src: "https://thecoworkcapital.com/wp-content/uploads/2023/03/SRP_0401-300x200.jpg",
    kicker: "Meeting Ready",
    title: "Conference rooms for decisions, pitches and reviews.",
    copy: "Book focused meeting spaces with a professional setup and better conversation flow."
  },
  {
    src: "https://thecoworkcapital.com/wp-content/uploads/elementor/thumbs/8b5fc045-f3d9-411f-b876-5506d038bf9e-oxprzi8lz9md5zirh3esq4g7kjphq4pkzh03umps40.jpg",
    kicker: "Events & learning",
    title: "A place for workshops, seminars and community energy.",
    copy: "Host learning sessions, small events, team days and entrepreneurial gatherings."
  },
  {
    src: "https://thecoworkcapital.com/wp-content/uploads/2021/01/02-300x199.jpg",
    kicker: "Creative Space",
    title: "Studio-friendly space for shoots and interviews.",
    copy: "A flexible space for creators, content teams, podcasts and interview setups."
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
  daypass: {
    title: "Book Quick Day Pass",
    mini: "Fast desk access",
    intro: "Reserve a desk for the day. Visit reception, confirm availability and start working.",
    selectedService: "Hot Desks / Quick Day Pass",
    serviceType: "daypass",
    submit: "Submit Day Pass Request"
  },
  tour: {
    title: "Book a Workspace Tour",
    mini: "Visit request",
    intro: "Share your preferred date and the team will help you experience the space.",
    selectedService: "Workspace Tour",
    serviceType: "standard",
    submit: "Submit Tour Request"
  },
  dedicated: {
    title: "Dedicated Desk Availability",
    mini: "Monthly workspace",
    intro: "Check availability for a fixed desk in a premium coworking environment.",
    selectedService: "Dedicated Desks",
    serviceType: "standard",
    submit: "Check Availability"
  },
  "private-cabin": {
    title: "Private Cabin Tour",
    mini: "Cabin enquiry",
    intro: "Tell us your team size and preferred start date for private cabin options.",
    selectedService: "Private Cabin",
    serviceType: "standard",
    submit: "Request Cabin Options"
  },
  conference: {
    title: "Conference Room Request",
    mini: "Meeting room",
    intro: "Share your date, time and guest count. Team will confirm availability.",
    selectedService: "Conference Room",
    serviceType: "conference",
    submit: "Submit Conference Request"
  },
  event: {
    title: "Event Space Request",
    mini: "Workshops & sessions",
    intro: "Plan a workshop, seminar or inside business event.",
    selectedService: "Event Space",
    serviceType: "event",
    submit: "Submit Event Request"
  },
  studio: {
    title: "Studio Space Request",
    mini: "Creative booking",
    intro: "Tell us about your shoot, podcast, interview or content requirement.",
    selectedService: "Studio Space",
    serviceType: "event",
    submit: "Submit Studio Request"
  }
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
  setupModal();
  setupReveal();
  setupCursor();
  setupScrollProgress();
  setupHeroCarousel();
  setupAmenityShowcase();
  setupTilt();
  setupMobileMasks();
  logEvent("page_loaded", "Website opened");
});

window.addEventListener("beforeunload", () => {
  logSession("page_exit");
});

function setupYear(){
  const year = document.getElementById("year");
  if(year) year.textContent = new Date().getFullYear();
}

function setupLeadGate(){
  const gate = document.getElementById("leadGate");
  const form = document.getElementById("welcomeForm");
  if(!gate || !form) return;

  const saved = safeParse(sessionStorage.getItem("tcc_user_session"));
  if(saved && saved.name && saved.mobile && saved.email){
    state.user = saved;
    gate.classList.add("hide");
    document.body.classList.remove("no-scroll");
    prefillModalUser();
  } else {
    document.body.classList.add("no-scroll");
    setTimeout(() => document.getElementById("welcomeName")?.focus(), 500);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = cleanName(document.getElementById("welcomeName").value);
    const mobile = onlyDigits(document.getElementById("welcomeMobile").value);
    const email = cleanEmail(document.getElementById("welcomeEmail").value);

    clearErrors(form);
    let ok = true;
    if(name.length < 2){ setError("welcomeName", "Please enter your full name."); ok = false; }
    if(!isValidIndianMobile(mobile)){ setError("welcomeMobile", "Enter a valid 10 digit Indian mobile number."); ok = false; }
    if(!isValidEmail(email)){ setError("welcomeEmail", "Enter a valid email address."); ok = false; }
    if(!ok){ state.validationErrors++; return; }

    state.user = { name, mobile, email };
    sessionStorage.setItem("tcc_user_session", JSON.stringify(state.user));
    prefillModalUser();
    logEvent("entry_details_submitted", "First 3 details captured");

    await apiCall("logEarlyLead", {
      sessionId: state.sessionId,
      name,
      mobile: "+91" + mobile,
      email,
      sourcePath: SITE_URL + "#entry-gate",
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`
    });

    gate.classList.add("hide");
    document.body.classList.remove("no-scroll");
  });
}

function setupButtons(){
  document.querySelectorAll("[data-open-form]").forEach(btn => {
    btn.addEventListener("click", () => openEnquiry(btn.dataset.openForm || "tour"));
  });
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
  clearErrors(document.getElementById("enquiryForm"));
  document.getElementById("successPanel")?.classList.remove("show");
  document.getElementById("enquiryForm")?.classList.remove("hide");

  document.getElementById("formModal")?.classList.add("show");
  document.getElementById("formModal")?.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");

  apiCall("logIntent", {
    sessionId: state.sessionId,
    intent: config.selectedService,
    sourcePath: SITE_URL + "#" + type
  });
  logEvent("form_opened", config.selectedService);
}

function closeEnquiry(){
  document.getElementById("formModal")?.classList.remove("show");
  document.getElementById("formModal")?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

function prefillModalUser(){
  setVal("formName", state.user.name || "");
  setVal("formMobile", state.user.mobile || "");
  setVal("formEmail", state.user.email || "");
}

async function handleEnquirySubmit(e){
  e.preventDefault();
  const form = e.currentTarget;
  clearErrors(form);

  const data = Object.fromEntries(new FormData(form).entries());
  const name = cleanName(data.name || "");
  const mobile = onlyDigits(data.mobile || "");
  const email = cleanEmail(data.email || "");
  const date = data.date || "";
  const people = Math.max(Number(data.people || 1), 1);
  const serviceType = data.serviceType || "standard";
  const selectedService = data.selectedService || "Workspace Enquiry";
  const ticketId = data.ticketId || generateTicketId(serviceType);
  const hasGst = document.getElementById("hasGst")?.checked ? "Yes" : "No";
  const gstNumber = cleanText(document.getElementById("gstNumber")?.value || "").toUpperCase();

  let ok = true;
  if(name.length < 2){ setError("formName", "Please enter your full name."); ok = false; }
  if(!isValidIndianMobile(mobile)){ setError("formMobile", "Enter a valid 10 digit Indian mobile number."); ok = false; }
  if(!isValidEmail(email)){ setError("formEmail", "Enter a valid email address."); ok = false; }
  if(!date){ setError("formDate", "Please select your preferred date."); ok = false; }
  if(hasGst === "Yes" && gstNumber && !isValidGstin(gstNumber)){ alert("GSTIN format looks incorrect. Please check or leave GST blank for now."); ok = false; }
  if(!ok){ state.validationErrors++; return; }

  state.user = { name, mobile, email };
  sessionStorage.setItem("tcc_user_session", JSON.stringify(state.user));
  state.lastTicket = ticketId;

  const payload = {
    ticketId,
    sessionId: state.sessionId,
    name,
    mobile: "+91" + mobile,
    email,
    company: cleanText(data.company || ""),
    selectedService,
    serviceType,
    people,
    date,
    preferredDate: date,
    preferredTime: cleanText(data.preferredTime || ""),
    note: cleanText(data.note || ""),
    hasGst,
    gstNumber,
    gstFirm: cleanText(document.getElementById("gstFirm")?.value || ""),
    sourcePath: SITE_URL + "#enquiry-form",
    userAgent: navigator.userAgent,
    referrer: document.referrer || "direct",
    screenSize: `${window.innerWidth}x${window.innerHeight}`
  };

  const submitBtn = form.querySelector(".submit-btn");
  const oldText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting safely...";

  const action = serviceType === "conference" ? "submitConference" : "submitInquiry";
  await apiCall(action, payload);
  await apiCall("logSession", buildSessionPayload("form_submit_success", true, payload));

  state.converted = true;
  state.lastWhatsAppMessage = buildWhatsAppMessage(payload);
  form.classList.add("hide");
  setText("ticketDisplay", ticketId);
  setText("successTitle", selectedService + " request created.");
  setText("successCopy", "Your request has been captured. Our team will review it and connect with you shortly. You can also open a ready WhatsApp message now.");
  document.getElementById("successPanel")?.classList.add("show");
  submitBtn.disabled = false;
  submitBtn.textContent = oldText;
  logEvent("enquiry_submitted", selectedService);
}

function buildWhatsAppMessage(d){
  return [
    "Hello The Co•Work Capital team,",
    "",
    "I have submitted a workspace enquiry from your website.",
    "Ticket ID: " + d.ticketId,
    "Requirement: " + d.selectedService,
    "Name: " + d.name,
    "Mobile: " + d.mobile,
    "Email: " + d.email,
    "People/Passes: " + d.people,
    "Preferred Date: " + d.date,
    d.preferredTime ? "Preferred Time: " + d.preferredTime : "",
    d.note ? "Message: " + d.note : "",
    "",
    "Please guide me with availability and next steps."
  ].filter(Boolean).join("\n");
}

async function apiCall(action, data = {}){
  if(!API_URL) return false;
  try{
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, data, payload: data, source: "tcc-netlify-white-v3" })
    });
    return true;
  }catch(err){
    console.warn("Backend request failed:", action, err);
    return false;
  }
}

function setupReveal(){
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .14, rootMargin: "0px 0px -60px 0px" });
  items.forEach(el => observer.observe(el));
}

function setupCursor(){
  const orb = document.getElementById("cursorOrb");
  if(!orb || window.matchMedia("(max-width: 800px)").matches) return;
  let x = 0, y = 0, tx = 0, ty = 0;
  window.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; }, { passive:true });
  function raf(){
    x += (tx - x) * .12;
    y += (ty - y) * .12;
    orb.style.left = x + "px";
    orb.style.top = y + "px";
    requestAnimationFrame(raf);
  }
  raf();
}

function setupScrollProgress(){
  const line = document.getElementById("progressLine");
  if(!line) return;
  let ticking = false;
  window.addEventListener("scroll", () => {
    if(!ticking){
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const p = h > 0 ? (window.scrollY / h) * 100 : 0;
        line.style.width = p + "%";
        ticking = false;
      });
      ticking = true;
    }
  }, { passive:true });
}

function setupHeroCarousel(){
  const img = document.getElementById("heroCarouselImage");
  if(!img) return;
  let i = 0;
  setInterval(() => {
    i = (i + 1) % galleryImages.length;
    const g = galleryImages[i];
    img.style.opacity = "0";
    setTimeout(() => {
      img.src = g.src;
      setText("heroCarouselKicker", g.kicker);
      setText("heroCarouselTitle", g.title);
      setText("heroCarouselCopy", g.copy);
      img.style.opacity = "1";
    }, 260);
  }, 4200);
}

function setupAmenityShowcase(){
  let i = 0;
  setInterval(() => {
    i = (i + 1) % amenities.length;
    const [num, title, copy] = amenities[i];
    const box = document.querySelector(".amenity-spotlight");
    if(!box) return;
    box.style.transform = "translateY(10px)";
    box.style.opacity = ".65";
    setTimeout(() => {
      setText("amenityNumber", num);
      setText("amenityTitle", title);
      setText("amenityCopy", copy);
      box.style.transform = "";
      box.style.opacity = "";
    }, 180);
  }, 3200);
}

function setupTilt(){
  if(window.matchMedia("(max-width: 900px)").matches) return;
  document.querySelectorAll(".tilt").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = ((y / r.height) - .5) * -7;
      const ry = ((x / r.width) - .5) * 7;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
}

function setupMobileMasks(){
  ["welcomeMobile", "formMobile"].forEach(id => {
    const input = document.getElementById(id);
    if(!input) return;
    input.addEventListener("input", () => {
      input.value = onlyDigits(input.value).slice(0, 10);
    });
  });
  const gst = document.getElementById("gstNumber");
  gst?.addEventListener("input", () => { gst.value = gst.value.toUpperCase().replace(/[^0-9A-Z]/g, "").slice(0,15); });
}

function logEvent(name, value = ""){
  state.eventStream.push({ t: Math.round((Date.now() - state.startedAt) / 1000), name, value });
  if(state.eventStream.length > 40) state.eventStream.shift();
}

function logSession(reason = "heartbeat"){
  apiCall("logSession", buildSessionPayload(reason, state.converted));
}

function buildSessionPayload(reason, converted = false, extra = {}){
  return {
    sessionId: state.sessionId,
    ticketId: state.lastTicket,
    firstSeen: new Date(state.startedAt).toISOString(),
    lastSeen: new Date().toISOString(),
    totalDurationSeconds: Math.round((Date.now() - state.startedAt) / 1000),
    deviceType: window.innerWidth < 700 ? "mobile" : window.innerWidth < 1020 ? "tablet" : "desktop",
    browser: navigator.userAgent,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    referrer: document.referrer || "direct",
    userAgent: navigator.userAgent,
    formStarted: state.formStarted,
    converted,
    completionStatus: converted ? "Converted" : "Not Converted",
    lastStep: reason,
    sourcePath: SITE_URL,
    validationErrorCount: state.validationErrors,
    eventStream: JSON.stringify(state.eventStream),
    serviceSelected: extra.selectedService || "",
    serviceType: extra.serviceType || ""
  };
}

function generateTicketId(type){
  const prefix = type === "conference" ? "CONF" : type === "daypass" ? "DAY" : type === "event" ? "EVT" : "INQ";
  const date = new Date();
  const stamp = String(date.getFullYear()).slice(2) + String(date.getMonth()+1).padStart(2,"0") + String(date.getDate()).padStart(2,"0");
  const rand = Math.random().toString(36).slice(2,5).toUpperCase();
  return `TCC-${prefix}-${stamp}-${rand}`;
}

function cleanName(v){ return cleanText(v).replace(/[^a-zA-Z .'-]/g, "").trim(); }
function cleanEmail(v){ return String(v || "").trim().toLowerCase(); }
function cleanText(v){ return String(v || "").replace(/[<>]/g, "").trim(); }
function onlyDigits(v){ return String(v || "").replace(/\D/g, ""); }
function isValidIndianMobile(v){ return /^[6-9]\d{9}$/.test(v); }
function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
function isValidGstin(v){ return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(v); }
function safeParse(v){ try { return JSON.parse(v); } catch(e){ return null; } }
function setVal(id, value){ const el = document.getElementById(id); if(el) el.value = value; }
function setText(id, value){ const el = document.getElementById(id); if(el) el.textContent = value; }
function clearErrors(scope){
  if(!scope) return;
  scope.querySelectorAll(".field-error").forEach(el => el.textContent = "");
  scope.querySelectorAll(".has-error").forEach(el => el.classList.remove("has-error"));
}
function setError(inputId, message){
  const input = document.getElementById(inputId);
  const wrap = input?.closest("label");
  if(wrap){
    wrap.classList.add("has-error");
    const small = wrap.querySelector(".field-error");
    if(small) small.textContent = message;
  }
}
