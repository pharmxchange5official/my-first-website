const API_URL = "https://script.google.com/macros/s/AKfycbz4xmPNpOaoq5FpnqdWHd-mYcbFQMgbHpBwcbag1ND7taSEE-fiJ-99Lo-gFNZLvWBFCw/exec";
const WHATSAPP_NUMBER = "918320765392";

const galleryImages = [
  {
    src: "https://thecoworkcapital.com/wp-content/uploads/elementor/thumbs/SRP_0396-scaled-q2yoopflhhy0z8n5wbxf6gbzts0h6883nvw3djsh0g.jpg",
    kicker: "Workspace Operating System",
    title: "Cabins, desks, meeting rooms and studio energy.",
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
  ["05", "16000 Sq. Ft. Empire", "Large flexible office capacity in Ocean Building, Sarabhai Campus, Vadodara."]
];

const serviceMap = {
  "daypass": {
    title: "Book Quick Day Pass",
    mini: "Fast access",
    intro: "Reserve a desk for the day. Visit reception, confirm availability and start working.",
    selectedService: "Hot Desks / Quick Day Pass",
    serviceType: "daypass",
    peopleLabel: "Passes",
    submit: "Submit Day Pass Request"
  },
  "tour": {
    title: "Book a Workspace Tour",
    mini: "Visit request",
    intro: "Share your preferred date and the team will help you experience the space.",
    selectedService: "Workspace Tour",
    serviceType: "standard",
    peopleLabel: "People",
    submit: "Submit Tour Request"
  },
  "dedicated": {
    title: "Dedicated Desk Availability",
    mini: "Monthly workspace",
    intro: "Check availability for a fixed desk in a premium coworking environment.",
    selectedService: "Dedicated Desks",
    serviceType: "standard",
    peopleLabel: "Seats",
    submit: "Check Availability"
  },
  "private-cabin": {
    title: "Private Cabin Tour",
    mini: "Cabin enquiry",
    intro: "Tell us your team size and preferred start date for private cabin options.",
    selectedService: "Private Cabin",
    serviceType: "standard",
    peopleLabel: "Seats",
    submit: "Request Cabin Options"
  },
  "conference": {
    title: "Conference Room Request",
    mini: "Meeting room",
    intro: "Share your date, time and guest count. Team will confirm availability.",
    selectedService: "Conference Room",
    serviceType: "conference",
    peopleLabel: "Guests",
    submit: "Submit Conference Request"
  },
  "event": {
    title: "Event Space Request",
    mini: "Workshops & sessions",
    intro: "Plan a workshop, seminar or inside business event.",
    selectedService: "Event Space",
    serviceType: "event",
    peopleLabel: "Guests",
    submit: "Submit Event Request"
  },
  "studio": {
    title: "Studio Space Request",
    mini: "Creative booking",
    intro: "Tell us about your shoot, podcast, interview or content requirement.",
    selectedService: "Studio Space",
    serviceType: "event",
    peopleLabel: "People",
    submit: "Submit Studio Request"
  }
};

const state = {
  sessionId: "S-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
  user: { name: "", mobile: "", email: "" },
  currentService: "tour",
  lastTicket: "",
  lastWhatsAppMessage: ""
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
});

function setupYear(){
  const year = document.getElementById("year");
  if(year) year.textContent = new Date().getFullYear();
}

function setupLeadGate(){
  const gate = document.getElementById("leadGate");
  const form = document.getElementById("welcomeForm");

  const saved = JSON.parse(sessionStorage.getItem("tcc_user_session") || "null");
  if(saved && saved.name && saved.mobile && saved.email){
    state.user = saved;
    gate.classList.add("hide");
    prefillModalUser();
  } else {
    document.body.classList.add("no-scroll");
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
    if(!ok) return;

    state.user = { name, mobile, email };
    sessionStorage.setItem("tcc_user_session", JSON.stringify(state.user));
    prefillModalUser();

    await apiCall("logEarlyLead", {
      sessionId: state.sessionId,
      name,
      mobile,
      email,
      sourcePath: "premium_website_entry_gate",
      userAgent: navigator.userAgent
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
  const modal = document.getElementById("formModal");
  const form = document.getElementById("enquiryForm");
  const gst = document.getElementById("hasGst");
  const whatsAppBtn = document.getElementById("whatsAppBtn");

  document.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeEnquiry));
  document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeEnquiry(); });

  gst.addEventListener("change", () => {
    document.getElementById("gstFields").classList.toggle("show", gst.checked);
  });

  form.addEventListener("submit", handleEnquirySubmit);

  whatsAppBtn.addEventListener("click", () => {
    if(state.lastWhatsAppMessage){
      window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(state.lastWhatsAppMessage), "_blank");
    }
  });
}

function openEnquiry(type = "tour"){
  state.currentService = serviceMap[type] ? type : "tour";
  const config = serviceMap[state.currentService];

  document.getElementById("modalMini").textContent = config.mini;
  document.getElementById("modalTitle").textContent = config.title;
  document.getElementById("modalIntro").textContent = config.intro;
  document.getElementById("serviceType").value = config.serviceType;
  document.getElementById("selectedService").value = config.selectedService;
  document.querySelector(".submit-btn").textContent = config.submit;
  document.querySelector('label[for="formPeople"]');

  document.getElementById("ticketId").value = generateTicketId(config.serviceType);
  document.getElementById("successPanel").classList.remove("show");
  document.getElementById("enquiryForm").style.display = "grid";
  document.getElementById("formModal").classList.add("show");
  document.getElementById("formModal").setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");

  prefillModalUser();

  const today = new Date();
  today.setDate(today.getDate() + 1);
  document.getElementById("formDate").min = today.toISOString().split("T")[0];
  document.getElementById("formNote").placeholder = state.currentService === "daypass"
    ? "Example: I want to visit tomorrow and work for the day."
    : "Tell us about your requirement.";
}

function closeEnquiry(){
  document.getElementById("formModal").classList.remove("show");
  document.getElementById("formModal").setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

function prefillModalUser(){
  const map = [
    ["formName", state.user.name],
    ["formMobile", state.user.mobile],
    ["formEmail", state.user.email]
  ];
  map.forEach(([id, val]) => {
    const el = document.getElementById(id);
    if(el && val) el.value = val;
  });
}

async function handleEnquirySubmit(e){
  e.preventDefault();
  const form = e.currentTarget;
  clearErrors(form);

  const data = Object.fromEntries(new FormData(form).entries());
  data.name = cleanName(data.name);
  data.mobile = onlyDigits(data.mobile);
  data.email = cleanEmail(data.email);
  data.ticketId = document.getElementById("ticketId").value || generateTicketId(data.serviceType);
  data.sessionId = state.sessionId;
  data.sourcePath = "premium_frontend";
  data.userAgent = navigator.userAgent;
  data.referrer = document.referrer || "";
  data.hasGst = document.getElementById("hasGst").checked ? "Yes" : "No";
  data.gstNumber = cleanText(document.getElementById("gstNumber").value).toUpperCase();
  data.gstFirm = cleanText(document.getElementById("gstFirm").value);

  let ok = true;
  if(data.name.length < 2){ setError("formName", "Please enter full name."); ok = false; }
  if(!isValidIndianMobile(data.mobile)){ setError("formMobile", "Enter a valid 10 digit mobile number."); ok = false; }
  if(!isValidEmail(data.email)){ setError("formEmail", "Enter a valid email address."); ok = false; }
  if(!data.date){ setError("formDate", "Please select preferred date."); ok = false; }
  if(!ok) return;

  state.user = { name: data.name, mobile: data.mobile, email: data.email };
  sessionStorage.setItem("tcc_user_session", JSON.stringify(state.user));

  const action = data.serviceType === "conference" ? "submitConference" : "submitInquiry";
  const submitBtn = form.querySelector(".submit-btn");
  const original = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending to team...";

  await apiCall(action, data);

  state.lastTicket = data.ticketId;
  state.lastWhatsAppMessage = createWhatsAppMessage(data);

  form.style.display = "none";
  document.getElementById("ticketDisplay").textContent = data.ticketId;
  document.getElementById("successTitle").textContent = data.serviceType === "daypass"
    ? "Your Day Pass request is created."
    : "Your enquiry is created.";
  document.getElementById("successCopy").textContent = "We have shared your enquiry with The Co•Work Capital team. You can also open WhatsApp with a ready message.";
  document.getElementById("successPanel").classList.add("show");

  submitBtn.disabled = false;
  submitBtn.textContent = original;
}

function createWhatsAppMessage(data){
  return [
    "Hello The Co•Work Capital team,",
    "",
    "I have submitted a workspace enquiry from the website.",
    "",
    "Ticket ID: " + data.ticketId,
    "Requirement: " + data.selectedService,
    "Name: " + data.name,
    "Mobile: +91 " + data.mobile,
    "Email: " + data.email,
    data.company ? "Company: " + data.company : "",
    "People/Passes: " + (data.people || "1"),
    "Preferred Date: " + data.date,
    data.preferredTime ? "Preferred Time: " + data.preferredTime : "",
    data.note ? "Message: " + data.note : "",
    "",
    "Please guide me with availability and next steps."
  ].filter(Boolean).join("\n");
}

async function apiCall(action, data){
  if(!API_URL) return false;
  try{
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, data })
    });
    return true;
  }catch(err){
    console.warn("Backend call failed", err);
    return false;
  }
}

function setupHeroCarousel(){
  const frame = document.querySelector(".device-frame");
  const img = document.getElementById("heroCarouselImage");
  const kicker = document.getElementById("heroCarouselKicker");
  const title = document.getElementById("heroCarouselTitle");
  const copy = document.getElementById("heroCarouselCopy");
  let index = 0;

  setInterval(() => {
    index = (index + 1) % galleryImages.length;
    const item = galleryImages[index];
    frame.classList.add("switching");
    setTimeout(() => {
      img.src = item.src;
      kicker.textContent = item.kicker;
      title.textContent = item.title;
      copy.textContent = item.copy;
      frame.classList.remove("switching");
    }, 260);
  }, 3600);
}

function setupAmenityShowcase(){
  const no = document.getElementById("amenityNumber");
  const title = document.getElementById("amenityTitle");
  const copy = document.getElementById("amenityCopy");
  let index = 0;
  setInterval(() => {
    index = (index + 1) % amenities.length;
    const item = amenities[index];
    no.textContent = item[0];
    title.textContent = item[1];
    copy.textContent = item[2];
  }, 3100);
}

function setupReveal(){
  const els = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("in");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold:.12, rootMargin:"0px 0px -40px 0px" });
  els.forEach((el, i) => {
    el.style.transitionDelay = Math.min(i * 35, 240) + "ms";
    obs.observe(el);
  });
}

function setupCursor(){
  const orb = document.getElementById("cursorOrb");
  if(!orb || window.matchMedia("(max-width: 700px)").matches) return;
  let x = 0, y = 0, tx = 0, ty = 0;
  document.addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; }, { passive:true });
  function loop(){
    x += (tx - x) * 0.12;
    y += (ty - y) * 0.12;
    orb.style.transform = `translate(${x - 180}px, ${y - 180}px)`;
    requestAnimationFrame(loop);
  }
  loop();
}

function setupScrollProgress(){
  const line = document.getElementById("progressLine");
  let ticking = false;
  window.addEventListener("scroll", () => {
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? (window.scrollY / max) * 100 : 0;
      line.style.width = p + "%";
      ticking = false;
    });
  }, { passive:true });
}

function setupTilt(){
  if(window.matchMedia("(max-width: 900px)").matches) return;
  document.querySelectorAll(".tilt").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = ((y / r.height) - .5) * -6;
      const ry = ((x / r.width) - .5) * 6;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function setupMobileMasks(){
  ["welcomeMobile","formMobile"].forEach(id => {
    const el = document.getElementById(id);
    if(!el) return;
    el.addEventListener("input", () => { el.value = onlyDigits(el.value).slice(0,10); });
  });
}

function cleanName(v){ return cleanText(v).replace(/\s+/g, " ").trim(); }
function cleanText(v){ return String(v || "").replace(/[<>]/g, "").trim(); }
function cleanEmail(v){ return String(v || "").trim().toLowerCase(); }
function onlyDigits(v){ return String(v || "").replace(/\D/g, ""); }
function isValidIndianMobile(v){ return /^[6-9]\d{9}$/.test(v); }
function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

function setError(id,msg){
  const input = document.getElementById(id);
  if(!input) return;
  const label = input.closest("label") || input.closest(".phone-field")?.closest("label");
  const small = label ? label.querySelector(".field-error") : null;
  if(small) small.textContent = msg;
}
function clearErrors(form){
  form.querySelectorAll(".field-error").forEach(s => s.textContent = "");
}
function generateTicketId(type){
  const prefix = type === "conference" ? "CONF" : type === "daypass" ? "DAY" : "INQ";
  return "TCC-" + prefix + "-" + Math.floor(1000 + Math.random() * 9000);
}
