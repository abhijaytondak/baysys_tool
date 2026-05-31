import { useState, useEffect } from "react";

const CURRENCIES = ["AED","USD","GBP","EUR","INR"];
const SYM = { AED:"AED", USD:"USD", GBP:"GBP", EUR:"EUR", INR:"INR" };
function fmt(n, c) { return (SYM[c]||c||"AED") + " " + Math.round(n).toLocaleString(); }
function pct(n) { return Math.round(n) + "%"; }

const FIRST_NAMES = ["Tariq","Priya","James","Fatima","Ravi","Sara","Noor","Daniel","Aisha","Karim","Maya","Omar","Layla","Hassan","Zara","Ibrahim","Anjali","Yusuf","Leila","Arjun"];
const LAST_INITIALS = ["M.","S.","O.","A.","K.","N.","R.","T.","H.","B.","D.","J.","P.","V."];
function hashStr(s) { var h=0; for (var i=0;i<s.length;i++) { h = ((h<<5)-h) + s.charCodeAt(i); h |= 0; } return Math.abs(h); }
function lookupAccount(phoneDigits) {
  if (!phoneDigits || phoneDigits.length < 7) return null;
  var h = hashStr(phoneDigits);
  var name = FIRST_NAMES[h % FIRST_NAMES.length] + " " + LAST_INITIALS[(h>>3) % LAST_INITIALS.length];
  var balance = 4000 + ((h % 96) * 500);    // 4,000 – 51,500
  var months  = 1 + ((h>>5) % 14);          // 1 – 14
  return { name:name, balance:balance, months:months };
}

const SOCIAL = [
  { name:"Tariq M.",  city:"Dubai",     msg:"cleared AED 34,000 in 18 months and is now debt-free." },
  { name:"Priya S.",  city:"Abu Dhabi", msg:"negotiated a 40% reduction and closed her account in 3 weeks." },
  { name:"James O.",  city:"Sharjah",   msg:"settled AED 12,500 in a single payment — saved AED 4,200." },
  { name:"Fatima A.", city:"Ajman",     msg:"set up a 12-month plan she could actually afford." },
  { name:"Ravi K.",   city:"Dubai",     msg:"paid off his balance 2 years early after restructuring." },
  { name:"Sara N.",   city:"Abu Dhabi", msg:"resolved a 14-month-overdue account without going to court." },
];

var PM = {
  social_proof:         { label:"Social Proof",         color:"#059669", note:"Rotating peer outcomes lower anxiety at form entry. Conversion lift ~12-18% vs. no social proof." },
  loss_aversion:        { label:"Loss Aversion",         color:"#dc2626", note:"Balance is asked first. Seeing the full debt primes users to anchor capacity higher." },
  anchoring:            { label:"Anchoring",             color:"#7c3aed", note:"Placeholder 'e.g. 6' sets a mid-range anchor. Anchored fields are ~30% more accurate." },
  goal_gradient:        { label:"Goal Gradient",         color:"#0891b2", note:"'Comfortably pay' frames capacity as progress, not commitment. Reduces sandbagging ~18%." },
  default_effect:       { label:"Default Effect",        color:"#b45309", note:"AED is the default. Defaults are chosen ~77% of the time even when alternatives are visible." },
  trust_signals:        { label:"Trust Signals",         color:"#6b7280", note:"Confidentiality copy placed directly under the CTA at the exact moment of hesitation." },
  progress:             { label:"Status and Progress",   color:"#be185d", note:"Greyed CTA only activates when all fields are filled. Users who unlock it are 2.3x more likely to submit." },
  no_action:            { label:"Loss Aversion",         color:"#dc2626", note:"Worst-case shown before options. Framing status quo as loss is the most reliable trigger for action." },
  scarcity:             { label:"Scarcity / Urgency",    color:"#7c3aed", note:"14-day window prevents the 'deal with it later' loop while staying non-coercive." },
  gain_framing:         { label:"Gain Framing",          color:"#059669", note:"Savings shown as absolute and percentage. Dual framing outperforms either alone." },
  smart_push:           { label:"Smart Push",            color:"#0891b2", note:"Most popular follows the algorithm: lump sum if within 1.5x monthly capacity, else shortest affordable plan. Social proof only goes where the nudge is honest." },
  social_page2:         { label:"Social Proof",          color:"#b45309", note:"68% stat only on the recommended card — honest social proof, not blanket application." },
  endowment:            { label:"Endowment Effect",      color:"#be185d", note:"Showing saving % before commitment creates ownership. Users feel they'd be giving it up by not selecting." },
  layout_choice:        { label:"Layout rationale",      color:"#6366f1", note:"Facts (balance, overdue) are muted — not decisions. Capacity is bold and editable because it's the one variable the user controls." },
  card_hierarchy:       { label:"Card hierarchy",        color:"#6366f1", note:"Total cost is the primary number. Users must understand the full commitment first. Monthly is secondary." },
  advisor_nudge:        { label:"Soft escalation",       color:"#6366f1", note:"'None of these feel right?' captures near-abandoners without pulling focus from the three main options." },
  long_tenure:          { label:"Complexity escalation", color:"#6366f1", note:"Plans over 60 months have genuine complexity. Routing to an advisor is better UX and better risk management." },
  math_transparency:    { label:"Math transparency",     color:"#6366f1", note:"Showing the full calculation builds trust at the moment of commitment. Users who understand the numbers are 40% less likely to abandon post-confirmation." },
  confirmation_framing: { label:"Confirmation framing",  color:"#059669", note:"'Good choice.' is deliberate positive reinforcement. Users who feel validated at confirmation are significantly less likely to call back to cancel." },
  plan_summary:         { label:"Receipt psychology",    color:"#6366f1", note:"Showing a full plan summary mirrors the receipt pattern from e-commerce. It reduces post-purchase doubt by making the commitment feel concrete and transparent." },
  avoided_cost:         { label:"Loss Aversion",         color:"#dc2626", note:"Showing what was avoided reframes the payment as a win, not a loss. Users re-anchor to the worst case they escaped rather than the amount they're committing to." },
  next_steps:           { label:"Anxiety reduction",     color:"#0891b2", note:"The 3-step 'what happens next' breakdown eliminates the most common post-confirmation anxiety. Named steps with human language reduce support contact rates by ~25%." },
};

function PMBadge({ id, active, onToggle }) {
  var p = PM[id];
  return (
    <button
      onClick={function(e) { e.stopPropagation(); onToggle(id); }}
      style={{
        display:"inline-flex", alignItems:"center", gap:5,
        background: active ? p.color : "transparent",
        border:"1.5px solid " + p.color, borderRadius:999,
        padding:"2px 10px", fontSize:11, fontWeight:600,
        color: active ? "#fff" : p.color, cursor:"pointer",
        fontFamily:"system-ui,sans-serif", letterSpacing:"0.02em",
        whiteSpace:"nowrap", flexShrink:0, transition:"all 0.15s"
      }}
    >
      <span style={{ width:5, height:5, borderRadius:"50%", background: active ? "#fff" : p.color, display:"inline-block" }}/>
      {p.label}
    </button>
  );
}

function PMNote({ id, onClose }) {
  if (!id || !PM[id]) return null;
  var p = PM[id];
  return (
    <div style={{ background:"#fff", border:"1px solid " + p.color + "33", borderRadius:10, padding:"12px 14px", marginTop:8 }}>
      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6 }}>
        <span style={{ width:6, height:6, borderRadius:"50%", background:p.color, display:"inline-block" }}/>
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:p.color, fontFamily:"system-ui,sans-serif" }}>PM note - {p.label}</span>
        <button onClick={onClose} style={{ marginLeft:"auto", background:"none", border:"none", fontSize:14, color:"#bbb", cursor:"pointer", lineHeight:1, padding:0 }}>x</button>
      </div>
      <p style={{ fontSize:13, color:"#555", lineHeight:1.7, margin:0, fontFamily:"system-ui,sans-serif" }}>{p.note}</p>
    </div>
  );
}

function Header({ pmMode, setPmMode }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"26px 0 0" }}>
      <div>
        <div style={{ fontSize:20, fontWeight:700, letterSpacing:"-0.01em", color:"#1a1a1a", fontFamily:"Georgia,serif" }}>baysys</div>
        <div style={{ fontSize:10, letterSpacing:"0.18em", color:"#999", textTransform:"uppercase", fontFamily:"system-ui,sans-serif", marginTop:1 }}>Debt Resolution</div>
      </div>
      <button
        onClick={function() { setPmMode(function(m) { return !m; }); }}
        style={{
          display:"flex", alignItems:"center", gap:6,
          background: pmMode ? "#fff3f0" : "#fff",
          border: pmMode ? "1.5px solid #e85d3e" : "1px solid #ddd",
          borderRadius:999, padding:"7px 14px", fontSize:12,
          color: pmMode ? "#e85d3e" : "#555", cursor:"pointer",
          fontFamily:"system-ui,sans-serif", transition:"all 0.15s"
        }}
      >
        <span style={{ fontSize:13 }}>{pmMode ? "🔍" : "💡"}</span>
        {pmMode ? "PM Mode ON" : "PM Mode"}
      </button>
    </div>
  );
}

function FieldMsg({ err, warn, hint }) {
  var msg = err || warn || hint;
  if (!msg) return null;
  var bg, border, icon, color;
  if (err)       { bg="#fff5f5"; border="#fecaca"; icon="⚠"; color="#dc2626"; }
  else if (warn) { bg="#fffbeb"; border="#fde68a"; icon="⚠"; color="#92400e"; }
  else           { bg="#f0f9ff"; border="#bae6fd"; icon="ℹ"; color="#0c4a6e"; }
  return (
    <div style={{ display:"flex", gap:6, alignItems:"flex-start", marginTop:5, padding:"7px 11px", background:bg, border:"1px solid " + border, borderRadius:7 }}>
      <span style={{ color:color, fontSize:12, marginTop:1, flexShrink:0 }}>{icon}</span>
      <span style={{ fontSize:12, color:color, fontFamily:"system-ui,sans-serif", lineHeight:1.55 }}>{msg}</span>
    </div>
  );
}

function computeNoAction(b, mo) {
  return Math.round(b * (1 + 0.24 * Math.max(mo, 1) / 12) + 500);
}

function buildPlans(b, mo, mc, cur) {
  var discount = Math.min(0.42, 0.05 + mo * 0.015);

  var lumpTotal   = Math.round(b * (1 - discount));
  var lumpSave    = b - lumpTotal;
  var lumpSavePct = Math.round((lumpSave / b) * 100);

  var rawM      = mc > 0 ? Math.ceil(b / mc) : 24;
  var popM      = Math.max(6, rawM);
  var popFee    = popM <= 12 ? 0 : popM <= 24 ? 0.04 : 0.07;
  var popTotal  = Math.round(b * (1 + popFee));
  var popMonthly = Math.ceil(popTotal / popM);

  var longM       = Math.round(popM * 1.4);
  var longFee     = 0.10;
  var longTotal   = Math.round(b * (1 + longFee));
  var longMonthly = Math.ceil(longTotal / longM);

  // no-action must always be the worst-case — ensure it exceeds the most expensive plan
  var maxPlanTotal = Math.max(lumpTotal, popTotal, longTotal);
  var noAction = Math.max(computeNoAction(b, mo), Math.round(maxPlanTotal * 1.18) + 500);

  var lumpCalcRows = [
    { label:"Outstanding balance",                              value:fmt(b, cur),           note:"" },
    { label:"Negotiated reduction (" + pct(discount*100) + ")",value:"- " + fmt(lumpSave, cur), note:mo + " month" + (mo!==1?"s":"") + " overdue", highlight:true },
    { label:"Settlement amount",                                value:fmt(lumpTotal, cur),   note:"Paid once. Account closed.", bold:true },
    { label:"vs. no-action cost",                               value:"Save " + fmt(noAction - lumpTotal, cur), note:"Avoids interest + legal fees", green:true },
  ];

  var popSaveVsNA = Math.max(0, noAction - popTotal);
  var popSavePct  = Math.round((popSaveVsNA / noAction) * 100);
  var popCalcRows = [
    { label:"Outstanding balance",                        value:fmt(b, cur),           note:"" },
    { label:"Arrangement fee (" + pct(popFee*100) + ")",  value: popFee > 0 ? "+ " + fmt(Math.round(b*popFee), cur) : "None", note: popFee === 0 ? "Waived for short plans" : "Standard plan fee", highlight: popFee === 0 },
    { label:"Total to repay",                             value:fmt(popTotal, cur),    note:"Spread across all months", bold:true },
    { label:"Monthly payment",                            value:fmt(popMonthly, cur) + "/mo", note:popM + " equal payments" },
    { label:"vs. no-action cost (" + fmt(noAction, cur) + ")", value: popSaveVsNA > 0 ? "Save " + fmt(popSaveVsNA, cur) : "Comparable to no-action", note:"Avoids compounding interest + legal", green: popSaveVsNA > 0 },
  ];

  var longSaveVsNA = Math.max(0, noAction - longTotal);
  var longSavePct  = Math.round((longSaveVsNA / noAction) * 100);
  var longCalcRows = [
    { label:"Outstanding balance",                         value:fmt(b, cur),           note:"" },
    { label:"Arrangement fee (" + pct(longFee*100) + ")",  value:"+ " + fmt(Math.round(b*longFee), cur), note:"Extended plan fee" },
    { label:"Total to repay",                              value:fmt(longTotal, cur),   note:"Spread across all months", bold:true },
    { label:"Monthly payment",                             value:fmt(longMonthly, cur) + "/mo", note:longM + " equal payments" },
    { label:"vs. no-action cost (" + fmt(noAction, cur) + ")",  value: longSaveVsNA > 0 ? "Save " + fmt(longSaveVsNA, cur) : "Similar to no-action", note:"Structured vs. legal route", green: longSaveVsNA > 0 },
  ];

  var plans = [
    { id:"lump", isLump:true,  months:0,     monthly:0,          total:lumpTotal,  saveVsNA:noAction-lumpTotal,  savePct:lumpSavePct, calcRows:lumpCalcRows },
    { id:"pop",  isLump:false, months:popM,  monthly:popMonthly, total:popTotal,   saveVsNA:popSaveVsNA,         savePct:popSavePct,  calcRows:popCalcRows  },
    { id:"long", isLump:false, months:longM, monthly:longMonthly,total:longTotal,  saveVsNA:longSaveVsNA,        savePct:longSavePct, calcRows:longCalcRows },
  ];

  var recommendedId = "pop";
  if (mc > 0 && lumpTotal <= mc * 1.5) recommendedId = "lump";
  else if (mc > 0 && popMonthly >= lumpTotal * 0.8) recommendedId = "lump";

  var showAdvisorCard = longM > 60;
  return { plans:plans, recommendedId:recommendedId, showAdvisorCard:showAdvisorCard, noAction:noAction };
}

function CalcPopup({ plan, planTitle, cur, onClose }) {
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={function(e) { e.stopPropagation(); }} style={{ background:"#fff", borderRadius:"16px 16px 0 0", padding:"24px 24px 36px", maxWidth:480, width:"100%", boxShadow:"0 -4px 32px rgba(0,0,0,0.12)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <div>
            <div style={{ fontSize:12, color:"#aaa", fontFamily:"system-ui,sans-serif", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:2 }}>How we calculated</div>
            <div style={{ fontSize:17, fontWeight:700, color:"#111" }}>{planTitle}</div>
          </div>
          <button onClick={onClose} style={{ background:"#f7f4f0", border:"none", borderRadius:"50%", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:16, color:"#888" }}>x</button>
        </div>
        {plan.calcRows.map(function(row, i) {
          return (
            <div key={i} style={{
              display:"flex", justifyContent:"space-between", alignItems:"flex-start",
              padding: row.highlight ? "10px 24px" : "10px 0",
              margin: row.highlight ? "0 -24px" : "0",
              background: row.highlight ? "#f0fdf4" : "transparent",
              borderBottom: i < plan.calcRows.length - 1 ? "1px solid #f0ece6" : "none"
            }}>
              <div>
                <div style={{ fontSize:13, fontWeight: row.bold ? 600 : 400, color: row.green ? "#059669" : "#333", fontFamily:"system-ui,sans-serif" }}>{row.label}</div>
                {row.note ? <div style={{ fontSize:11, color:"#aaa", fontFamily:"system-ui,sans-serif", marginTop:2 }}>{row.note}</div> : null}
              </div>
              <div style={{ fontSize:14, fontWeight: row.bold ? 700 : 500, color: row.green ? "#059669" : row.highlight ? "#059669" : "#111", fontFamily:"system-ui,sans-serif", textAlign:"right", flexShrink:0, marginLeft:16 }}>{row.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Page1({ onSubmit, saved }) {
  var [pmMode, setPmMode]       = useState(false);
  var [openNote, setOpenNote]   = useState(null);
  var [step, setStep]           = useState("A");
  var [otp, setOtp]             = useState(["0","0","0","0"]);
  var [stepVis, setStepVis]     = useState(true);
  var [currency, setCurrency]   = useState((saved && saved.currency) || "AED");
  var [phone, setPhone]         = useState((saved && saved.phone) || "");
  var [name, setName]           = useState((saved && saved.name) || "");
  var [autoFilled, setAutoFilled] = useState(false);
  var [balance, setBalance]     = useState(saved && saved.balance  != null ? String(saved.balance)  : "");
  var [months, setMonths]       = useState(saved && saved.months   != null ? String(saved.months)   : "");
  var [capacity, setCapacity]   = useState(saved && saved.capacity != null ? String(saved.capacity) : "");
  var [touched, setTouched]     = useState({});
  var [submitted, setSubmitted] = useState(false);
  var [proofIdx, setProofIdx]   = useState(0);
  var [proofVis, setProofVis]   = useState(true);

  function goToStep(next) {
    setStepVis(false);
    setTimeout(function() { setStep(next); setStepVis(true); }, 180);
  }

  function maskedPhone() {
    if (!phone) return "";
    return "•••• ••" + phone.slice(-2);
  }

  function handleOtpChange(idx, val) {
    var d = val.replace(/[^0-9]/g, "").slice(-1);
    var next = otp.slice();
    next[idx] = d || "";
    setOtp(next);
    if (d && idx < 3) {
      var el = document.getElementById("otp-" + (idx+1));
      if (el) el.focus();
    }
    if (d && idx === 3 && next.every(function(x) { return x !== ""; })) {
      setTimeout(function() { goToStep("C"); }, 150);
    }
  }
  function handleOtpKey(idx, e) {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      var el = document.getElementById("otp-" + (idx-1));
      if (el) el.focus();
    }
  }

  function onPhoneChange(v) {
    var digits = v.replace(/[^0-9]/g, "").slice(0, 12);
    setPhone(digits);
    var acct = lookupAccount(digits);
    if (acct && digits.length >= 9) {
      setName(acct.name);
      setBalance(String(acct.balance));
      setMonths(String(acct.months));
      setAutoFilled(true);
    } else {
      setName("");
      setAutoFilled(false);
    }
  }

  function toggleNote(id) { setOpenNote(function(n) { return n === id ? null : id; }); }

  useEffect(function() {
    var t = setInterval(function() {
      setProofVis(false);
      setTimeout(function() { setProofIdx(function(i) { return (i+1) % SOCIAL.length; }); setProofVis(true); }, 350);
    }, 4200);
    return function() { clearInterval(t); };
  }, []);

  var b  = parseFloat(balance);
  var mo = parseInt(months);
  var mc = parseFloat(capacity);

  function getErr(f) {
    if (f === "phone") {
      if (!phone.trim()) return "Please enter your phone number.";
      if (phone.length < 9) return "Enter at least 9 digits.";
    }
    if (f === "balance") {
      if (!balance.trim()) return "Please enter your outstanding balance.";
      if (isNaN(b) || b <= 0) return "Enter an amount greater than zero.";
      if (b > 50000000) return "That looks unusually high — please double-check.";
    }
    if (f === "months") {
      if (!months.trim()) return "Enter 0 if your account is current.";
      if (isNaN(mo) || mo < 0) return "Can't be negative.";
      if (mo > 120) return "More than 10 years overdue — please double-check.";
    }
    if (f === "capacity") {
      if (!capacity.trim()) return "Enter 0 if you have no capacity right now.";
      if (isNaN(mc) || mc < 0) return "Can't be negative.";
      if (!isNaN(b) && b > 0 && !isNaN(mc) && mc > b * 3) return "Monthly capacity seems higher than the balance — double-check.";
    }
    return null;
  }

  var moWarn  = !isNaN(mo) && mo > 60 && mo <= 120 ? "That's over 5 years — just checking this is right." : null;
  var capHint = !isNaN(b) && b > 0 && !isNaN(mc) && mc > 0 && mc < b*0.015 && !getErr("capacity")
    ? "At this rate, full repayment takes ~" + Math.ceil(b/mc) + " months. Make sure this is accurate." : null;
  var allZero = !isNaN(b) && b===0 && !isNaN(mo) && !isNaN(mc) && mc===0;
  var allOk   = !getErr("phone") && !getErr("balance") && !getErr("months") && !getErr("capacity") && phone.trim() && balance.trim() && months.trim() && capacity.trim() && !allZero;

  function touch(f) { setTouched(function(t) { var n = Object.assign({}, t); n[f] = true; return n; }); }
  function se(f) { return (touched[f] || submitted) && getErr(f); }
  function sw(f) { return (touched[f] || submitted) && !getErr(f) && (f === "months" ? moWarn : null); }
  function sh(f) { return touched[f] && !getErr(f) && (f === "capacity" ? capHint : null); }

  var lbl = { display:"block", fontSize:11, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:"#666", fontFamily:"system-ui,sans-serif" };
  function inp(err) {
    return { width:"100%", boxSizing:"border-box", padding:"13px 15px", fontSize:15, border:"1.5px solid " + (err ? "#fca5a5" : "#e0dbd4"), borderRadius:10, background: err ? "#fff8f8" : "#faf9f7", color:"#111", outline:"none", fontFamily:"system-ui,sans-serif", appearance:"none" };
  }
  var p = SOCIAL[proofIdx];

  var cardShadow = "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)";
  var cardStyle = { background:"#fff", borderRadius:16, padding:"28px 22px 26px", margin:"18px 0 40px", boxShadow:cardShadow };
  function ctaStyle(active) {
    return { width:"100%", padding:"14px", fontSize:15, fontWeight:500, fontFamily:"system-ui,sans-serif", borderRadius:10, border:"none", background: active ? "#2a2a2a" : "#c8c3bc", color:"#fff", cursor: active ? "pointer" : "default", transition:"background 0.2s" };
  }

  var phoneOk = phone.length >= 9;
  var otpOk = otp.every(function(x) { return x !== ""; });
  var stepOrder = { A:0, B:1, C:2 };
  function dot(s) {
    var active = s === step;
    var done = stepOrder[s] < stepOrder[step];
    return (
      <div key={s} style={{
        width: active ? 24 : 8, height:8, borderRadius:999,
        background: active || done ? "#2a2a2a" : "#e8e2db",
        transition:"all 0.25s ease"
      }} />
    );
  }

  return (
    <div style={{ background:"#eae4dc", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", fontFamily:"Georgia,serif" }}>
      <style>{"input::placeholder{color:#bbb} input:focus,select:focus{border-color:#aaa!important;background:#fff!important;outline:none} .otp-box:focus{border-color:#2a2a2a!important;box-shadow:0 0 0 4px rgba(42,42,42,0.08);background:#fff!important}"}</style>
      <div style={{ width:"100%", maxWidth:500, padding:"0 16px", boxSizing:"border-box" }}>
        <Header pmMode={pmMode} setPmMode={setPmMode} />

        <div style={{ display:"flex", gap:6, justifyContent:"center", marginTop:16 }}>
          {["A","B","C"].map(dot)}
        </div>

        <div style={{ marginTop:18 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, background:"#fff", borderRadius:10, padding:"11px 16px", border:"1px solid #e8e2db", opacity: proofVis ? 1 : 0, transition:"opacity 0.35s" }}>
            <span style={{ fontSize:15, flexShrink:0 }}>👤</span>
            <span style={{ fontSize:13, color:"#777", fontFamily:"system-ui,sans-serif", lineHeight:1.5, flex:1, minWidth:0 }}>
              <span style={{ color:"#333", fontWeight:500 }}>{p.name}</span> from {p.city} {p.msg}
            </span>
            {pmMode && <PMBadge id="social_proof" active={openNote==="social_proof"} onToggle={toggleNote} />}
          </div>
          {pmMode && openNote==="social_proof" && <PMNote id="social_proof" onClose={function() { setOpenNote(null); }} />}
        </div>

        <div style={{ opacity: stepVis ? 1 : 0, transform: stepVis ? "translateY(0)" : "translateY(6px)", transition:"opacity 0.22s ease, transform 0.22s ease" }}>

        {step === "A" && (
        <div style={cardStyle}>
          <h1 style={{ fontSize:32, fontWeight:700, lineHeight:1.15, color:"#111", margin:"0 0 10px", letterSpacing:"-0.02em" }}>Let's find a<br/>path forward.</h1>
          <p style={{ fontSize:14, color:"#999", lineHeight:1.7, margin:"0 0 26px", fontFamily:"system-ui,sans-serif" }}>Start with your phone number — we'll check if you already have an account with us.</p>

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <label style={lbl}>Phone number</label>
          </div>
          <input style={inp(se("phone"))} type="tel" inputMode="numeric" placeholder="e.g. 0501234567" value={phone} onChange={function(e) { onPhoneChange(e.target.value); }} onBlur={function() { touch("phone"); }} autoFocus />
          <FieldMsg err={se("phone")} warn={null} hint={null} />

          <div style={{ marginTop:24 }}>
            <button
              onClick={function() { touch("phone"); if (phoneOk) goToStep("B"); }}
              style={ctaStyle(phoneOk)}
            >
              Continue →
            </button>
            <p style={{ fontSize:12, color:"#bbb", fontFamily:"system-ui,sans-serif", margin:"12px 0 0", textAlign:"center" }}>This is a confidential simulation. Your data is not stored or shared.</p>
          </div>
        </div>
        )}

        {step === "B" && (
        <div style={cardStyle}>
          <h1 style={{ fontSize:26, fontWeight:700, lineHeight:1.2, color:"#111", margin:"0 0 6px", letterSpacing:"-0.02em" }}>Verify your number</h1>
          <p style={{ fontSize:14, color:"#999", lineHeight:1.6, margin:"0 0 26px", fontFamily:"system-ui,sans-serif" }}>Code sent to <span style={{ color:"#555", fontWeight:500 }}>{maskedPhone()}</span></p>

          <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:14 }}>
            {[0,1,2,3].map(function(i) {
              return (
                <input
                  key={i}
                  id={"otp-" + i}
                  className="otp-box"
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[i]}
                  onChange={function(e) { handleOtpChange(i, e.target.value); }}
                  onKeyDown={function(e) { handleOtpKey(i, e); }}
                  onFocus={function(e) { e.target.select(); }}
                  style={{
                    width:56, height:56, textAlign:"center",
                    fontSize:28, fontWeight:600,
                    fontFamily:"ui-monospace,SFMono-Regular,Menlo,monospace",
                    color:"#111",
                    border:"2px solid #e0dbd4", borderRadius:12,
                    background:"#faf9f7", outline:"none",
                    boxSizing:"border-box", padding:0,
                    transition:"border-color 0.15s, box-shadow 0.15s, background 0.15s"
                  }}
                />
              );
            })}
          </div>

          <p style={{ fontSize:12, color:"#bbb", fontFamily:"system-ui,sans-serif", textAlign:"center", margin:"0 0 22px" }}>Resend in 30s</p>

          <button
            onClick={function() { if (otpOk) goToStep("C"); }}
            style={ctaStyle(otpOk)}
          >
            Verify →
          </button>

          <div style={{ textAlign:"center", marginTop:14 }}>
            <button
              onClick={function() { goToStep("A"); }}
              style={{ background:"none", border:"none", fontSize:13, color:"#888", fontFamily:"system-ui,sans-serif", cursor:"pointer", textDecoration:"underline", padding:0 }}
            >
              ← Change number
            </button>
          </div>
        </div>
        )}

        {step === "C" && (
        <div style={cardStyle}>
          <h1 style={{ fontSize:32, fontWeight:700, lineHeight:1.15, color:"#111", margin:"0 0 10px", letterSpacing:"-0.02em" }}>Let's find a<br/>path forward.</h1>
          <p style={{ fontSize:14, color:"#999", lineHeight:1.7, margin:"0 0 22px", fontFamily:"system-ui,sans-serif" }}>Tell us about your situation — we'll build options designed around your real capacity to pay.</p>

          {autoFilled && name && (
            <div style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:20, padding:"11px 14px", background:"#ecfdf5", border:"1px solid #a7f3d0", borderRadius:10 }}>
              <span style={{ fontSize:14, color:"#047857", lineHeight:1.1, marginTop:1 }}>✓</span>
              <span style={{ fontSize:13, color:"#047857", fontFamily:"system-ui,sans-serif", lineHeight:1.55 }}>
                Welcome back, <strong style={{ color:"#065f46" }}>{name}</strong>. We pre-filled your details — verify or edit below.
              </span>
            </div>
          )}

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <label style={lbl}>Currency</label>
            {pmMode && <PMBadge id="default_effect" active={openNote==="default_effect"} onToggle={toggleNote} />}
          </div>
          <select value={currency} onChange={function(e) { setCurrency(e.target.value); }} style={Object.assign({}, inp(false), { backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat:"no-repeat", backgroundPosition:"right 13px center", paddingRight:34, cursor:"pointer" })}>
            {CURRENCIES.map(function(c) { return <option key={c}>{c}</option>; })}
          </select>
          {pmMode && openNote==="default_effect" && <PMNote id="default_effect" onClose={function() { setOpenNote(null); }} />}
          <div style={{ height:18 }} />

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <label style={lbl}>Outstanding balance ({currency})</label>
            {pmMode && <PMBadge id="loss_aversion" active={openNote==="loss_aversion"} onToggle={toggleNote} />}
          </div>
          <input style={inp(se("balance"))} type="number" min="0" placeholder="e.g. 15,000" value={balance} onChange={function(e) { setBalance(e.target.value); }} onBlur={function() { touch("balance"); }} />
          <FieldMsg err={se("balance")} warn={null} hint={null} />
          {pmMode && openNote==="loss_aversion" && <PMNote id="loss_aversion" onClose={function() { setOpenNote(null); }} />}
          <div style={{ height:16 }} />

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <label style={lbl}>Months overdue</label>
            {pmMode && <PMBadge id="anchoring" active={openNote==="anchoring"} onToggle={toggleNote} />}
          </div>
          <input style={inp(se("months"))} type="number" min="0" placeholder="e.g. 6 — enter 0 if current" value={months} onChange={function(e) { setMonths(e.target.value); }} onBlur={function() { touch("months"); }} />
          <FieldMsg err={se("months")} warn={sw("months")} hint={null} />
          {pmMode && openNote==="anchoring" && <PMNote id="anchoring" onClose={function() { setOpenNote(null); }} />}
          <div style={{ height:16 }} />

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <label style={lbl}>Monthly repayment capacity ({currency})</label>
            {pmMode && <PMBadge id="goal_gradient" active={openNote==="goal_gradient"} onToggle={toggleNote} />}
          </div>
          <input style={inp(se("capacity"))} type="number" min="0" placeholder="What can you comfortably pay / mo?" value={capacity} onChange={function(e) { setCapacity(e.target.value); }} onBlur={function() { touch("capacity"); }} />
          <FieldMsg err={se("capacity")} warn={null} hint={sh("capacity")} />
          {pmMode && openNote==="goal_gradient" && <PMNote id="goal_gradient" onClose={function() { setOpenNote(null); }} />}

          <div style={{ marginTop:24 }}>
            {pmMode && <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:6 }}><PMBadge id="progress" active={openNote==="progress"} onToggle={toggleNote} /></div>}
            {pmMode && openNote==="progress" && <PMNote id="progress" onClose={function() { setOpenNote(null); }} />}
            <button
              onClick={function() {
                setSubmitted(true);
                setTouched({ balance:true, months:true, capacity:true });
                if (allOk) onSubmit({ currency:currency, balance:b, months:mo, capacity:mc, phone:phone, name:name || (lookupAccount(phone) && lookupAccount(phone).name) || "there" });
              }}
              style={ctaStyle(allOk)}
            >
              See My Options →
            </button>
            {submitted && allZero && <div style={{ marginTop:10, padding:"9px 13px", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:8, fontSize:13, color:"#92400e", fontFamily:"system-ui,sans-serif", lineHeight:1.6 }}>All zeros don't give us enough to work with. Please enter your actual figures.</div>}
            {submitted && !allOk && !allZero && <div style={{ marginTop:10, padding:"9px 13px", background:"#fff5f5", border:"1px solid #fecaca", borderRadius:8, fontSize:13, color:"#dc2626", fontFamily:"system-ui,sans-serif" }}>Please fix the highlighted fields above before continuing.</div>}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12 }}>
              <p style={{ fontSize:12, color:"#bbb", fontFamily:"system-ui,sans-serif", margin:0, flex:1, textAlign:"center" }}>This is a confidential simulation. Your data is not stored or shared.</p>
              {pmMode && <PMBadge id="trust_signals" active={openNote==="trust_signals"} onToggle={toggleNote} />}
            </div>
            {pmMode && openNote==="trust_signals" && <PMNote id="trust_signals" onClose={function() { setOpenNote(null); }} />}
          </div>
        </div>
        )}

        </div>
      </div>
    </div>
  );
}

function Page2({ data, onBack, onConfirm }) {
  var b  = data.balance;
  var mo = data.months;
  var [cur, setCur]             = useState(data.currency);
  var [capacity, setCapacity]   = useState(data.capacity);
  var [editingCap, setEditingCap] = useState(false);
  var [capDraft, setCapDraft]   = useState(String(data.capacity));
  var [pmMode, setPmMode]       = useState(false);
  var [openNote, setOpenNote]   = useState(null);
  var [calcPlan, setCalcPlan]   = useState(null);

  function toggleNote(id) { setOpenNote(function(n) { return n === id ? null : id; }); }

  var result = buildPlans(b, mo, capacity, cur);
  var plans           = result.plans;
  var recommendedId   = result.recommendedId;
  var showAdvisorCard = result.showAdvisorCard;
  var noAction        = result.noAction;

  var [selected, setSelected] = useState(recommendedId);
  useEffect(function() { setSelected(recommendedId); }, [recommendedId]);

  var selectedPlan = plans.find(function(p) { return p.id === selected; }) || plans[1];

  var popMonths  = plans[1].months;
  var longMonths = plans[2].months;

  function getPlanTitle(id) {
    if (id === "lump") return "One-Time Settlement";
    if (id === "pop")  return popMonths  + "-Month Plan";
    return                    longMonths + "-Month Plan";
  }
  function getPlanSub(id) {
    if (id === "lump") return "Single payment. Case closed in 48 hours.";
    if (id === "pop")  return popMonths  + " equal monthly payments. Fees waived.";
    return                    longMonths + " monthly payments. Lowest possible.";
  }

  function getTag(id) {
    if (id === recommendedId) return { text:"Most popular",    bg:"#1c1c1e", color:"#d1d5db" };
    if (id === "lump")        return { text:"Best savings",    bg:"#ecfdf5", color:"#059669" };
    if (id === "pop")         return { text:"Structured plan", bg:"#eff6ff", color:"#1d4ed8" };
    return                           { text:"Lowest monthly",  bg:"#ede9fe", color:"#7c3aed" };
  }

  function commitCap() {
    var v = parseFloat(capDraft);
    if (!isNaN(v) && v >= 0) setCapacity(v);
    setEditingCap(false);
  }

  return (
    <div style={{ background:"#eae4dc", minHeight:"100vh", fontFamily:"Georgia,serif" }}>
      <style>{".pcard{transition:box-shadow 0.12s} .pcard:hover{box-shadow:0 4px 20px rgba(0,0,0,0.08)} input:focus{outline:none} select{cursor:pointer}"}</style>

      {calcPlan && <CalcPopup plan={calcPlan} planTitle={getPlanTitle(calcPlan.id)} cur={cur} onClose={function() { setCalcPlan(null); }} />}

      <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ width:"100%", maxWidth:540, padding:"0 16px", boxSizing:"border-box", paddingBottom:112 }}>
          <Header pmMode={pmMode} setPmMode={setPmMode} />

          {/* Inputs */}
          <div style={{ marginTop:20, background:"#fff", borderRadius:14, padding:"16px 20px", border:"1px solid #e8e2db" }}>
            {pmMode && <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:8 }}><PMBadge id="layout_choice" active={openNote==="layout_choice"} onToggle={toggleNote} /></div>}
            {pmMode && openNote==="layout_choice" && <PMNote id="layout_choice" onClose={function() { setOpenNote(null); }} />}
            <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", paddingBottom:12, marginBottom:12, borderBottom:"1px solid #f0ece6", gap:"8px 0" }}>
              <div style={{ flex:"1 1 90px", minWidth:90 }}>
                <div style={{ fontSize:10, color:"#aaa", fontFamily:"system-ui,sans-serif", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:2 }}>Balance</div>
                <div style={{ fontSize:15, fontWeight:600, color:"#555", fontFamily:"system-ui,sans-serif" }}>{fmt(b, cur)}</div>
              </div>
              <div style={{ width:1, background:"#f0ece6", margin:"0 10px", alignSelf:"stretch" }} />
              <div style={{ flex:"1 1 70px", minWidth:70 }}>
                <div style={{ fontSize:10, color:"#aaa", fontFamily:"system-ui,sans-serif", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:2 }}>Overdue</div>
                <div style={{ fontSize:15, fontWeight:600, color:"#555", fontFamily:"system-ui,sans-serif" }}>{mo === 0 ? "Current" : mo + " mo"}</div>
              </div>
              <div style={{ width:1, background:"#f0ece6", margin:"0 10px", alignSelf:"stretch" }} />
              <div style={{ flex:"1 1 70px", minWidth:70 }}>
                <div style={{ fontSize:10, color:"#aaa", fontFamily:"system-ui,sans-serif", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:2 }}>Currency</div>
                <select value={cur} onChange={function(e) { setCur(e.target.value); }} style={{ fontSize:15, fontWeight:600, color:"#555", background:"transparent", border:"none", outline:"none", fontFamily:"system-ui,sans-serif", padding:0, appearance:"none" }}>
                  {CURRENCIES.map(function(c) { return <option key={c}>{c}</option>; })}
                </select>
              </div>
              <button onClick={onBack} style={{ background:"none", border:"none", fontSize:12, color:"#bbb", cursor:"pointer", fontFamily:"system-ui,sans-serif", padding:"0 0 0 10px", textDecoration:"underline", whiteSpace:"nowrap", alignSelf:"flex-end" }}>← Change</button>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4 }}>
                  <div style={{ fontSize:10, color:"#555", fontFamily:"system-ui,sans-serif", letterSpacing:"0.08em", textTransform:"uppercase", fontWeight:600 }}>Monthly capacity</div>
                  <span style={{ fontSize:10, background:"#fef9ec", color:"#92400e", border:"1px solid #fde68a", borderRadius:20, padding:"1px 8px", fontFamily:"system-ui,sans-serif", fontWeight:500 }}>adjustable</span>
                </div>
                {editingCap ? (
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:13, color:"#999", fontFamily:"system-ui,sans-serif" }}>{SYM[cur]}</span>
                    <input autoFocus type="number" value={capDraft}
                      onChange={function(e) { setCapDraft(e.target.value); }}
                      onBlur={commitCap}
                      onKeyDown={function(e) { if (e.key === "Enter") commitCap(); }}
                      style={{ fontSize:22, fontWeight:700, color:"#111", border:"none", borderBottom:"2px solid #2a2a2a", outline:"none", background:"transparent", fontFamily:"system-ui,sans-serif", padding:"2px 0", width:"100%", maxWidth:160, minWidth:80, letterSpacing:"-0.01em" }}
                    />
                  </div>
                ) : (
                  <div style={{ fontSize:22, fontWeight:700, color:"#111", fontFamily:"system-ui,sans-serif", letterSpacing:"-0.01em" }}>
                    {fmt(capacity, cur)}<span style={{ fontSize:13, color:"#aaa", fontWeight:400, marginLeft:4 }}>/mo</span>
                  </div>
                )}
              </div>
              <button
                onClick={function() { if (editingCap) { commitCap(); } else { setCapDraft(String(capacity)); setEditingCap(true); } }}
                style={{ display:"flex", alignItems:"center", gap:5, background: editingCap ? "#2a2a2a" : "#f7f4f0", border: editingCap ? "none" : "1px solid #e8e2db", borderRadius:8, padding:"7px 13px", fontSize:12, color: editingCap ? "#fff" : "#555", cursor:"pointer", fontFamily:"system-ui,sans-serif", fontWeight:500, flexShrink:0, marginTop:2 }}
              >
                {editingCap ? "Done" : "Edit"}
              </button>
            </div>
          </div>

          {/* No action */}
          <div style={{ marginTop:12 }}>
            <div style={{ background:"#fff", borderRadius:12, overflow:"hidden", border:"1px solid #fecaca" }}>
              <div style={{ background:"#dc2626", padding:"6px 16px", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(255,255,255,0.9)", fontFamily:"system-ui,sans-serif" }}>If no action is taken</span>
                {pmMode && <span style={{ marginLeft:"auto" }}><PMBadge id="no_action" active={openNote==="no_action"} onToggle={toggleNote} /></span>}
              </div>
              <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:14 }}>
                <span style={{ fontSize:24, fontWeight:700, color:"#dc2626", letterSpacing:"-0.02em", fontFamily:"system-ui,sans-serif" }}>{fmt(noAction, cur)}</span>
                <span style={{ fontSize:12, color:"#f87171", fontFamily:"system-ui,sans-serif", lineHeight:1.4 }}>balance + accruing interest + legal fees</span>
              </div>
            </div>
            {pmMode && openNote==="no_action" && <PMNote id="no_action" onClose={function() { setOpenNote(null); }} />}
          </div>

          {/* Heading */}
          <div style={{ marginTop:22, marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <h2 style={{ fontSize:24, fontWeight:700, margin:"0 0 10px", letterSpacing:"-0.02em" }}>{data.name && data.name !== "there" ? data.name.split(" ")[0] + ", your settlement options" : "Your settlement options"}</h2>
              {pmMode && <PMBadge id="smart_push" active={openNote==="smart_push"} onToggle={toggleNote} />}
            </div>
            {pmMode && openNote==="smart_push" && <PMNote id="smart_push" onClose={function() { setOpenNote(null); }} />}
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"#fef9ec", border:"1px solid #fde68a", borderRadius:20, padding:"4px 12px" }}>
                <span style={{ fontSize:11, color:"#92400e", fontFamily:"system-ui,sans-serif", fontWeight:500 }}>All offers valid for 14 days</span>
              </div>
              {pmMode && <PMBadge id="scarcity" active={openNote==="scarcity"} onToggle={toggleNote} />}
            </div>
            {pmMode && openNote==="scarcity" && <PMNote id="scarcity" onClose={function() { setOpenNote(null); }} />}
          </div>

          {pmMode && <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:8 }}><PMBadge id="card_hierarchy" active={openNote==="card_hierarchy"} onToggle={toggleNote} /></div>}
          {pmMode && openNote==="card_hierarchy" && <PMNote id="card_hierarchy" onClose={function() { setOpenNote(null); }} />}

          {/* Plan cards */}
          {plans.map(function(plan) {
            var isRec  = plan.id === recommendedId;
            var isSel  = plan.id === selected;
            var dark   = isRec;
            var bg     = dark ? "#1c1c1e" : "#fff";
            var txtPri = dark ? "#fff"    : "#111";
            var txtSec = dark ? "#9ca3af" : "#999";
            var txtMut = dark ? "#6b7280" : "#bbb";
            var savClr = dark ? "#6ee7b7" : "#059669";
            var savBg  = dark ? "#064e3b" : "#f0fdf4";
            var tag    = getTag(plan.id);

            return (
              <div key={plan.id} style={{ marginBottom:12 }}>
                <div
                  className="pcard"
                  onClick={function() { setSelected(plan.id); }}
                  style={{ background:bg, borderRadius:14, padding:"20px 18px", cursor:"pointer", border:"2px solid " + (isSel ? (dark ? "#fff" : "#2a2a2a") : "transparent"), position:"relative" }}
                >
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                    <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", background:tag.bg, color:tag.color, padding:"3px 9px", borderRadius:5, fontFamily:"system-ui,sans-serif" }}>{tag.text}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      {pmMode && <PMBadge id={plan.isLump ? "gain_framing" : "endowment"} active={openNote===(plan.isLump ? "gain_framing" : "endowment")} onToggle={toggleNote} />}
                      {isSel ? (
                        <span style={{ display:"inline-flex", alignItems:"center", gap:4 }}>
                          <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:18, height:18, borderRadius:"50%", background: dark ? "#fff" : "#2a2a2a" }}>
                            <span style={{ fontSize:10, color: dark ? "#111" : "#fff", fontWeight:700, lineHeight:1 }}>✓</span>
                          </span>
                          <span style={{ fontSize:12, fontWeight:600, color: dark ? "#d1d5db" : "#333", fontFamily:"system-ui,sans-serif" }}>Selected</span>
                        </span>
                      ) : (
                        <span style={{ color:txtMut, fontSize:15 }}>→</span>
                      )}
                    </div>
                  </div>

                  <h3 style={{ fontSize:20, fontWeight:700, color:txtPri, margin:"0 0 3px", letterSpacing:"-0.01em" }}>{getPlanTitle(plan.id)}</h3>
                  <p style={{ fontSize:13, color:txtSec, margin:"0 0 16px", fontFamily:"system-ui,sans-serif" }}>{getPlanSub(plan.id)}</p>

                  {plan.isLump ? (
                    <div style={{ display:"flex", alignItems:"flex-end", gap:16, marginBottom:14 }}>
                      <div>
                        <div style={{ fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:txtMut, fontFamily:"system-ui,sans-serif", marginBottom:4 }}>One-time payment</div>
                        <div style={{ fontSize:32, fontWeight:700, color:txtPri, letterSpacing:"-0.02em", lineHeight:1 }}>{fmt(plan.total, cur)}</div>
                      </div>
                      {plan.saveVsNA > 0 && (
                        <div style={{ paddingBottom:4 }}>
                          <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:savBg, borderRadius:20, padding:"5px 12px" }}>
                            <span style={{ fontSize:13, fontWeight:600, color:savClr }}>Save {fmt(plan.saveVsNA, cur)}</span>
                            <span style={{ fontSize:11, color:savClr, opacity:0.75 }}>vs. no action ({plan.savePct}%)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ marginBottom:14 }}>
                      <div style={{ display:"flex", alignItems:"flex-end", gap:16, marginBottom:8 }}>
                        <div>
                          <div style={{ fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:txtMut, fontFamily:"system-ui,sans-serif", marginBottom:4 }}>Total to repay</div>
                          <div style={{ fontSize:32, fontWeight:700, color:txtPri, letterSpacing:"-0.02em", lineHeight:1 }}>{fmt(plan.total, cur)}</div>
                        </div>
                        {plan.saveVsNA > 0 && (
                          <div style={{ paddingBottom:4 }}>
                            <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:savBg, borderRadius:20, padding:"5px 12px" }}>
                              <span style={{ fontSize:13, fontWeight:600, color:savClr }}>Save {fmt(plan.saveVsNA, cur)}</span>
                              <span style={{ fontSize:11, color:savClr, opacity:0.75 }}>vs. no action ({plan.savePct}%)</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{ display:"inline-flex", alignItems:"center", gap:4, background: dark ? "#2d2d2d" : "#f7f4f0", borderRadius:8, padding:"5px 12px" }}>
                        <span style={{ fontSize:12, color:txtMut, fontFamily:"system-ui,sans-serif" }}>Monthly</span>
                        <span style={{ fontSize:15, fontWeight:700, color:txtPri, fontFamily:"system-ui,sans-serif", letterSpacing:"-0.01em" }}>{fmt(plan.monthly, cur)}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={function(e) { e.stopPropagation(); setCalcPlan(plan); }}
                    style={{ background:"none", border:"none", fontSize:12, color: dark ? "#6b7280" : "#bbb", fontFamily:"system-ui,sans-serif", cursor:"pointer", padding:0, textDecoration:"underline", display:"block", marginBottom: isRec ? 12 : 0 }}
                  >
                    How is this calculated?
                  </button>

                  {isRec && (
                    <div>
                      <div style={{ borderTop:"1px solid " + (dark ? "#374151" : "#f0f0f0"), margin:"0 0 10px" }} />
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:12, color:txtSec, fontFamily:"system-ui,sans-serif" }}>👥 68% of borrowers in similar situations chose this plan</span>
                        {pmMode && <PMBadge id="social_page2" active={openNote==="social_page2"} onToggle={toggleNote} />}
                      </div>
                    </div>
                  )}
                </div>
                {pmMode && openNote===(plan.isLump ? "gain_framing" : "endowment") && <PMNote id={plan.isLump ? "gain_framing" : "endowment"} onClose={function() { setOpenNote(null); }} />}
                {pmMode && isRec && openNote==="social_page2" && <PMNote id="social_page2" onClose={function() { setOpenNote(null); }} />}
              </div>
            );
          })}

          {showAdvisorCard && (
            <div style={{ marginBottom:12 }}>
              <div style={{ background:"#fff", borderRadius:14, padding:"20px 24px", border:"1px solid #e8e2db" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", background:"#fef3c7", color:"#92400e", padding:"3px 9px", borderRadius:5, fontFamily:"system-ui,sans-serif" }}>Complex case</span>
                  {pmMode && <PMBadge id="long_tenure" active={openNote==="long_tenure"} onToggle={toggleNote} />}
                </div>
                <h3 style={{ fontSize:18, fontWeight:700, color:"#111", margin:"0 0 4px", letterSpacing:"-0.01em" }}>Your case may need a custom plan</h3>
                <p style={{ fontSize:13, color:"#888", margin:"0 0 14px", fontFamily:"system-ui,sans-serif", lineHeight:1.6 }}>Based on your balance and capacity, a standard plan would exceed 5 years. A specialist can often negotiate better terms.</p>
                <button
                  onClick={function() { onConfirm({ plan:{ id:"advisor", title:"Advisor consultation", total:0, saveVsNA:0, savePct:0, isLump:false, months:0, monthly:0, calcRows:[] }, currency:cur, isAdvisor:true }); }}
                  style={{ background:"#2a2a2a", color:"#fff", border:"none", borderRadius:8, padding:"10px 18px", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"system-ui,sans-serif" }}
                >
                  Speak to an advisor →
                </button>
              </div>
              {pmMode && openNote==="long_tenure" && <PMNote id="long_tenure" onClose={function() { setOpenNote(null); }} />}
            </div>
          )}

          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"12px" }}>
            <span style={{ fontSize:13, color:"#bbb", fontFamily:"system-ui,sans-serif" }}>None of these feel right?</span>
            <button
              onClick={function() { onConfirm({ plan:{ id:"advisor", title:"Advisor consultation", total:0, saveVsNA:0, savePct:0, isLump:false, months:0, monthly:0, calcRows:[] }, currency:cur, isAdvisor:true }); }}
              style={{ background:"none", border:"none", fontSize:13, color:"#888", fontFamily:"system-ui,sans-serif", cursor:"pointer", textDecoration:"underline", padding:0 }}
            >
              Talk to an advisor
            </button>
            {pmMode && <PMBadge id="advisor_nudge" active={openNote==="advisor_nudge"} onToggle={toggleNote} />}
          </div>
          {pmMode && openNote==="advisor_nudge" && <PMNote id="advisor_nudge" onClose={function() { setOpenNote(null); }} />}
        </div>
      </div>

      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"linear-gradient(to top, #eae4dc 65%, transparent)", padding:"20px 24px 24px", display:"flex", justifyContent:"center", zIndex:100 }}>
        <button
          onClick={function() { onConfirm({ plan:selectedPlan, currency:cur, isAdvisor:false }); }}
          style={{ width:"100%", maxWidth:492, padding:"15px", background:"#2a2a2a", color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:500, cursor:"pointer", fontFamily:"system-ui,sans-serif" }}
        >
          Confirm — {getPlanTitle(selected)} →
        </button>
      </div>
    </div>
  );
}

var PM3 = {
  confirmation_framing: { label:"Confirmation framing",  color:"#059669", note:"'Good choice.' is deliberate positive reinforcement — not neutral. Users who feel validated at confirmation are significantly less likely to call back to cancel." },
  plan_summary:         { label:"Receipt psychology",    color:"#6366f1", note:"Showing a full plan summary on the confirmation screen mirrors the receipt pattern from e-commerce. It reduces post-purchase doubt by making the commitment feel concrete and transparent." },
  avoided_cost:         { label:"Loss Aversion",         color:"#dc2626", note:"Showing what was avoided (the no-action figure) reframes the payment as a win, not a loss. Users re-anchor to the worst case they escaped rather than the amount they're committing to." },
  next_steps:           { label:"Anxiety reduction",     color:"#0891b2", note:"The 3-step 'what happens next' breakdown eliminates the most common post-confirmation anxiety: 'what do I do now?' Named steps with human language reduce support contact rates by ~25%." },
};

function Page3({ plan, currency, isAdvisor, formData, onReset }) {
  var [pmMode, setPmMode]     = useState(false);
  var [openNote, setOpenNote] = useState(null);
  function toggleNote(id) { setOpenNote(function(n) { return n === id ? null : id; }); }

  var noAction = formData ? computeNoAction(formData.balance, formData.months) : 0;

  return (
    <div style={{ background:"#eae4dc", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", fontFamily:"Georgia,serif" }}>
      <div style={{ width:"100%", maxWidth:500, padding:"0 16px", boxSizing:"border-box" }}>
        <Header pmMode={pmMode} setPmMode={setPmMode} />
        <div style={{ margin:"28px 0 40px" }}>

          {/* Hero */}
          <div style={{ background:"#fff", borderRadius:16, padding:"36px 32px 28px", marginBottom:12, textAlign:"center" }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background: isAdvisor ? "#eff6ff" : "#f0fdf4", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:26 }}>
              {isAdvisor ? "📞" : "✓"}
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:10 }}>
              <h2 style={{ fontSize:26, fontWeight:700, margin:0, letterSpacing:"-0.02em" }}>
                {isAdvisor ? "We'll be in touch" + (formData && formData.name && formData.name !== "there" ? ", " + formData.name.split(" ")[0] : "") + "." : "Good choice" + (formData && formData.name && formData.name !== "there" ? ", " + formData.name.split(" ")[0] : "") + "."}
              </h2>
              {pmMode && <PMBadge id="confirmation_framing" active={openNote==="confirmation_framing"} onToggle={toggleNote} />}
            </div>
            {pmMode && openNote==="confirmation_framing" && <PMNote id="confirmation_framing" onClose={function() { setOpenNote(null); }} />}
            <p style={{ fontSize:14, color:"#888", lineHeight:1.75, margin:0, fontFamily:"system-ui,sans-serif" }}>
              {isAdvisor
                ? "A resolution specialist will contact you within 24 hours to explore the best possible terms. No commitment needed."
                : "You've selected the " + plan.title + ". A specialist will contact you within 24 hours."
              }
            </p>
          </div>

          {/* Plan summary */}
          {!isAdvisor && (
            <div style={{ background:"#fff", borderRadius:14, overflow:"hidden", marginBottom:12, border:"1px solid #f0ece6" }}>
              <div style={{ background:"#f7f4f0", padding:"10px 20px", borderBottom:"1px solid #f0ece6", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#888", fontFamily:"system-ui,sans-serif" }}>Your plan summary</span>
                {pmMode && <PMBadge id="plan_summary" active={openNote==="plan_summary"} onToggle={toggleNote} />}
              </div>
              {pmMode && openNote==="plan_summary" && <div style={{ padding:"0 20px" }}><PMNote id="plan_summary" onClose={function() { setOpenNote(null); }} /></div>}
              <div style={{ padding:"0 20px" }}>
                {plan.isLump ? (
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0", borderBottom:"1px solid #f7f4f0" }}>
                    <span style={{ fontSize:13, color:"#888", fontFamily:"system-ui,sans-serif" }}>One-time settlement</span>
                    <span style={{ fontSize:18, fontWeight:700, color:"#111", fontFamily:"system-ui,sans-serif" }}>{fmt(plan.total, currency)}</span>
                  </div>
                ) : (
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid #f7f4f0" }}>
                      <span style={{ fontSize:13, color:"#888", fontFamily:"system-ui,sans-serif" }}>Total to repay</span>
                      <span style={{ fontSize:18, fontWeight:700, color:"#111", fontFamily:"system-ui,sans-serif" }}>{fmt(plan.total, currency)}</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid #f7f4f0" }}>
                      <span style={{ fontSize:13, color:"#888", fontFamily:"system-ui,sans-serif" }}>Monthly payment</span>
                      <span style={{ fontSize:16, fontWeight:600, color:"#111", fontFamily:"system-ui,sans-serif" }}>{fmt(plan.monthly, currency)}/mo</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid #f7f4f0" }}>
                      <span style={{ fontSize:13, color:"#888", fontFamily:"system-ui,sans-serif" }}>Duration</span>
                      <span style={{ fontSize:14, fontWeight:500, color:"#555", fontFamily:"system-ui,sans-serif" }}>{plan.months} months</span>
                    </div>
                  </div>
                )}
                {formData && (
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid #f7f4f0" }}>
                    <span style={{ fontSize:13, color:"#888", fontFamily:"system-ui,sans-serif" }}>Original balance</span>
                    <span style={{ fontSize:14, fontWeight:500, color:"#888", fontFamily:"system-ui,sans-serif" }}>{fmt(formData.balance, currency)}</span>
                  </div>
                )}
                {plan.saveVsNA > 0 && (
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0" }}>
                    <span style={{ fontSize:13, color:"#059669", fontFamily:"system-ui,sans-serif" }}>You save vs. no action</span>
                    <span style={{ fontSize:16, fontWeight:700, color:"#059669", fontFamily:"system-ui,sans-serif" }}>{fmt(plan.saveVsNA, currency)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Avoided cost */}
          {!isAdvisor && noAction > 0 && (
            <div style={{ background:"#fff5f5", borderRadius:12, padding:"14px 20px", marginBottom:12, border:"1px solid #fecaca" }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                <div style={{ fontSize:20, flexShrink:0 }}>🛡</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:2 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:"#dc2626", fontFamily:"system-ui,sans-serif" }}>What you avoided</div>
                    {pmMode && <PMBadge id="avoided_cost" active={openNote==="avoided_cost"} onToggle={toggleNote} />}
                  </div>
                  <div style={{ fontSize:13, color:"#888", fontFamily:"system-ui,sans-serif", lineHeight:1.5 }}>
                    Without a plan, this could have reached <strong style={{ color:"#dc2626" }}>{fmt(noAction, currency)}</strong> with interest and legal costs.
                  </div>
                </div>
              </div>
              {pmMode && openNote==="avoided_cost" && <PMNote id="avoided_cost" onClose={function() { setOpenNote(null); }} />}
            </div>
          )}

          {/* Next steps */}
          <div style={{ background:"#fff", borderRadius:12, padding:"16px 20px", marginBottom:16, border:"1px solid #f0ece6" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#aaa", fontFamily:"system-ui,sans-serif" }}>What happens next</div>
              {pmMode && <PMBadge id="next_steps" active={openNote==="next_steps"} onToggle={toggleNote} />}
            </div>
            {pmMode && openNote==="next_steps" && <PMNote id="next_steps" onClose={function() { setOpenNote(null); }} />}
            {[
              { icon:"📬", step:"Within 24 hours",  detail:"A resolution specialist will reach out to confirm your selection." },
              { icon:"📄", step:"Agreement review", detail:"You'll receive the formal settlement agreement to review at your own pace." },
              { icon:"✅", step:"Account closed",   detail:"Once confirmed and paid, your account is marked as resolved." },
            ].map(function(s, i) {
              return (
                <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom: i < 2 ? 12 : 0 }}>
                  <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:"#333", fontFamily:"system-ui,sans-serif", marginBottom:2 }}>{s.step}</div>
                    <div style={{ fontSize:12, color:"#aaa", fontFamily:"system-ui,sans-serif", lineHeight:1.5 }}>{s.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={onReset} style={{ width:"100%", padding:"14px", background:"#2a2a2a", color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:500, cursor:"pointer", fontFamily:"system-ui,sans-serif" }}>
            Run another simulation
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  var [page, setPage]         = useState(1);
  var [formData, setFormData] = useState(null);
  var [chosen, setChosen]     = useState(null);

  if (page === 1) return <Page1 saved={formData} onSubmit={function(d) { setFormData(d); setPage(2); }} />;
  if (page === 2) return <Page2 data={formData} onBack={function() { setPage(1); }} onConfirm={function(c) { setChosen(c); setPage(3); }} />;
  return <Page3 plan={chosen.plan} currency={chosen.currency} isAdvisor={chosen.isAdvisor} formData={formData} onReset={function() { setFormData(null); setChosen(null); setPage(1); }} />;
}
