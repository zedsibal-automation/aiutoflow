"use strict";
(function () {
  /* ---- hero carousel: one problem per slide, built from your real projects ---- */
  /* 1. DATA: one object per hero slide. ghost=optional ghost image (falls back to the giant word w if missing), c=accent color, t=title, d=description, img=diagram, tools=chips, r=result chip, id=case study to open */
  /* Each slide has its own color-coded ghost diagram (ghost:) and a matching accent color (c:) */
  /* Set to true to show the clickable workflow examples under the ghost image again */
  var SHOW_EXAMPLES = false;
  var S = [
    {
      w: "LEADS",
      ghost: "images/ghost-leads.webp",
      c: "#e11d2e",
      t: "Leads go cold because follow-up is manual",
      d: "New leads get timed emails and texts automatically, and the sequence stops the moment they reply.",
      img: "images/Lead Follow-up System That Stops When They Reply.png",
      tools: ["GoHighLevel", "Email + SMS"],
      r: "Stops automatically on reply",
      rs: "Lead follow-up system",
      id: "lead-followup-stops-on-reply",
    },
    {
      w: "INVOICES",
      ghost: "images/ghost-invoices.webp",
      c: "#16a34a",
      t: "Invoices get paid without being checked",
      d: "AI reads each invoice, matches it to the purchase order and delivery record, and sends only the exceptions to a person.",
      img: "images/AI-Powered Invoice 3-Way Match Automation.png",
      tools: ["n8n", "OCR + AI"],
      r: "Mismatches and duplicates flagged",
      rs: "Invoice 3-way match",
      id: "ai-invoice-3way-match",
    },
    {
      w: "STORE",
      ghost: "images/ghost-store.webp",
      c: "#c2760a",
      t: "A Shopify store that runs on manual work",
      d: "Abandoned carts, restocks, VIP tiers and supplier reorders handled by workflows that check the facts before they act.",
      img: "images/Shopify Abandoned Cart Recovery Automation (n8n).png",
      tools: ["n8n", "Shopify", "Google Sheets"],
      r: "Re-checks every cart before emailing",
      rs: "Abandoned cart recovery",
      id: "shopify-abandoned-cart-recovery",
    },
    {
      w: "SUPPORT",
      ghost: "images/ghost-support.webp",
      c: "#0ea5e9",
      t: "Angry emails and bad reviews sit unseen",
      d: "AI filters out the noise and turns real complaints into prioritized cases with a VIP flag and a deadline.",
      img: "images/support-email-escalation-case-management.png",
      tools: ["n8n", "monday.com", "Shopify"],
      r: "VIP flag and SLA on every case",
      rs: "Support email escalation",
      id: "support-email-escalation",
    },
    {
      w: "HIRING",
      ghost: "images/ghost-hiring.webp",
      c: "#8b3cf5",
      t: "Hiring admin eats the week",
      d: "Job posts, resume screening and decisions run in one pipeline, with one-click choices in Slack.",
      img: "images/AI-Powered HR Recruiting Automation Job Posting to Candidate Evaluation & Hiring Decision (n8n).png",
      tools: ["n8n", "Airtable", "Slack"],
      r: "Two AI scorers rate every candidate",
      rs: "AI recruiting automation",
      id: "ai-hr-recruiting-automation",
    },
    {
      w: "ONBOARDING",
      ghost: "images/ghost-onboarding.webp",
      c: "#2548ff",
      t: "Onboarding a new client takes too many emails",
      d: "Inquiry, verification, welcome package and account activation run as one flow, and missing details are requested automatically.",
      img: "images/ghost-onboarding.webp",
      tools: ["n8n", "Email"],
      r: "Asks for missing info automatically",
      rs: "Client onboarding",
      id: "",
    },
    {
      w: "PROPOSALS",
      ghost: "images/ghost-proposals.webp",
      c: "#f26a0f",
      t: "Proposals and contracts slow down closing",
      d: "When a deal is won, AI drafts the proposal, sends it, tracks the response and sends the contract for e-signature.",
      img: "images/Proposals, Contracts & Invoices Generation — n8n Workflow.png",
      tools: ["n8n", "HubSpot", "DocuSeal"],
      r: "Revision loop until approved",
      rs: "Proposals and contracts",
      id: "proposals-contracts-invoices",
    },
    {
      w: "CHATBOT",
      ghost: "images/ghost-chatbot.webp",
      c: "#eab308",
      t: "Customers wait for answers you already have",
      d: "An AI chatbot understands the question, replies from your own docs, updates the CRM and opens tickets when needed.",
      img: "images/ai_Fb_chatbot.png",
      tools: ["n8n", "Gemini", "Messenger"],
      r: "Answers from your own docs",
      rs: "AI chatbot",
      id: "ai-fb-chatbot-calendar-booking",
    },
    {
      w: "BOOKING",
      ghost: "images/ghost-booking.webp",
      c: "#ec2f9a",
      t: "No-shows and back-and-forth scheduling",
      d: "Bookings are confirmed instantly, reminders go out by email and SMS, and no-shows get a reschedule offer.",
      img: "images/Appointment Confirmation + Reminder.png",
      tools: ["GoHighLevel", "Email + SMS"],
      r: "24-hour, 1-hour and 5-minute reminders",
      rs: "Appointment reminders",
      id: "appointment-confirmation-reminder",
    },
  ];
  /* 2. EXAMPLES: workflows shown under each ghost word. Format: [name, one-line description, project id from projects.js] */
  var L = {
    LEADS: [
      [
        "Lead follow-up that stops on reply",
        "Timed emails that end the moment a lead responds.",
        "lead-followup-stops-on-reply",
      ],
      [
        "Missed call text back",
        "Texts every missed caller within a minute.",
        "missed-call-text-back",
      ],
      [
        "Lead reactivation",
        "Three-email win-back for dormant contacts.",
        "lead-reactivation-workflow",
      ],
      [
        "New lead routing",
        "Tags, pipeline and a drip tailored to the service requested.",
        "new-lead-automation-hvac",
      ],
    ],
    INVOICES: [
      [
        "Invoice 3-way match",
        "Checks each invoice against its PO and delivery record.",
        "ai-invoice-3way-match",
      ],
      [
        "Invoice management system",
        "Form to branded PDF, filed in Drive and emailed.",
        "invoice-management-system",
      ],
      [
        "Proposals, contracts and invoices",
        "From form submission to signed contract and invoice.",
        "proposals-contracts-invoices",
      ],
    ],
    STORE: [
      [
        "Abandoned cart recovery",
        "Two timed emails, re-checked before each send.",
        "shopify-abandoned-cart-recovery",
      ],
      [
        "Low-stock supplier reorder",
        "Emails the right supplier, never twice.",
        "shopify-low-stock-supplier-reorder",
      ],
      [
        "Back-in-stock alerts",
        "Notifies waiting customers when an item returns.",
        "shopify-out-of-stock-back-in-stock",
      ],
      [
        "VIP loyalty tiers",
        "Assigns tiers as lifetime spend crosses thresholds.",
        "shopify-vip-loyalty-tier",
      ],
    ],
    SUPPORT: [
      [
        "Support email escalation",
        "Filters noise and turns complaints into prioritized cases.",
        "support-email-escalation",
      ],
      [
        "Review escalation",
        "Bad reviews become cases with a VIP flag and deadline.",
        "judgeme-review-escalation",
      ],
      [
        "Messenger booking chatbot",
        "Answers from your docs and books calls.",
        "ai-fb-chatbot-calendar-booking",
      ],
      [
        "Instagram DM menus",
        "Button replies route leads to the right offer.",
        "instagram-interactive-dm-workflow",
      ],
    ],
    HIRING: [
      [
        "AI recruiting pipeline",
        "Job post, resume screening and Slack decisions in one flow.",
        "ai-hr-recruiting-automation",
      ],
      [
        "Job scraper and resume optimizer",
        "A Slack bot that finds roles and tailors resumes.",
        "ai-job-scraper-resume-optimizer",
      ],
    ],
  };
  var bbList = document.getElementById("bbList"),
    li = 0;
  function light() {
    var g = bbList.querySelectorAll(".gi");
    [].forEach.call(g, function (x, i) {
      x.classList.toggle("lit", i === li % g.length);
    });
  }
  setInterval(function () {
    li++;
    light();
  }, 1800);
  /* 3. STATE + ELEMENT REFERENCES: cur = active slide index, t = autoplay timer */
  var cur = 0,
    t,
    bb = document.getElementById("billboard"),
    rail = document.getElementById("rail"),
    bbCopy = document.getElementById("bbCopy"),
    bbImg = document.getElementById("bbImg");
  S.forEach(function (s, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "rcard";
    b.innerHTML =
      '<img src="' +
      (s.ghost || s.img) +
      '" alt="" loading="lazy" onerror="this.style.visibility=\'hidden\'"><b>' +
      s.w.charAt(0) +
      s.w.slice(1).toLowerCase() +
      "</b><i></i>";
    b.setAttribute("aria-label", "Show " + s.rs);
    b.onclick = function () {
      go(i);
      auto();
    };
    rail.appendChild(b);
  });
  /* 4. HELPERS: restartBar re-runs the thumbnail progress animation; pop re-plays the entrance animation; light highlights one ghost example */
  function restartBar() {
    var c = rail.children;
    [].forEach.call(c, function (x) {
      x.classList.remove("on");
    });
    void rail.offsetWidth;
    c[cur].classList.add("on");
    /* carousel: keep the active thumbnail centered in the swipeable row */
    var a = c[cur];
    rail.scrollTo({
      left: a.offsetLeft - (rail.clientWidth - a.offsetWidth) / 2,
      behavior: "smooth",
    });
  }
  function pop(el) {
    el.classList.remove("in");
    void el.offsetWidth;
    el.classList.add("in");
  }
  /* 5. RENDER ONE SLIDE: sets the accent color, diagram, title, buttons and ghost word + examples for slide i */
  function go(i) {
    cur = (i + S.length) % S.length;
    var s = S[cur];
    document.documentElement.style.setProperty("--c", s.c);
    /* a slide with a ghost diagram shows only that one; the extra backdrop image is used only when there is no ghost */
    if (s.ghost) {
      bbImg.style.display = "none";
      bbImg.removeAttribute("src");
    } else {
      bbImg.style.display = "";
      bbImg.style.visibility = "visible";
      bbImg.src = s.img;
      bbImg.alt = "Workflow diagram: " + s.rs;
    }
    bbCopy.innerHTML =
      "<h2>" +
      s.t +
      "</h2><p>" +
      s.d +
      "</p>" +
      '<div class="chips">' +
      s.tools
        .map(function (x) {
          return '<span class="chip">' + x + "</span>";
        })
        .join("") +
      '<span class="chip">' +
      s.r +
      "</span></div>" +
      '<div class="bb-btns"><a class="btn main" href="https://calendly.com/zedsibal/oliver-calendar" target="_blank" rel="noopener">Book a free audit</a>' +
      (s.id
        ? '<button class="btn info" type="button" data-open="' +
          s.id +
          '">More info</button>'
        : '<a class="btn info" href="#contact">Ask about this</a>') +
      "</div>";
    bbList.innerHTML =
      (s.ghost
        ? '<img class="gimg" src="' +
          s.ghost +
          '" alt="" onerror="this.style.display=\'none\'">'
        : '<div class="gw" aria-hidden="true">' + s.w + "</div>") +
      (SHOW_EXAMPLES ? L[s.w] || [] : [])
        .map(function (x) {
          return (
            '<button type="button" class="gi" data-open="' +
            x[2] +
            '"><b>' +
            x[0] +
            "</b><span>" +
            x[1] +
            "</span></button>"
          );
        })
        .join("");
    li = 0;
    light();
    pop(bbCopy);
    pop(bbImg);
    pop(bbList);
    restartBar();
  }
  /* 6. AUTOPLAY: advance to the next slide every 7 seconds (edit 7000 to change) */
  function auto() {
    clearTimeout(t);
    t = setTimeout(function () {
      go(cur + 1);
      auto();
    }, 7000);
  }
  /* 7. EVENTS: open case studies, keyboard arrows, touch swipe */
  bb.addEventListener("click", function (e) {
    var b = e.target.closest("[data-open]");
    if (b && window.openProject) window.openProject(b.dataset.open);
  });
  document.addEventListener("keydown", function (e) {
    if (e.target.closest("input,textarea")) return;
    if (e.key === "ArrowLeft") {
      go(cur - 1);
      auto();
    }
    if (e.key === "ArrowRight") {
      go(cur + 1);
      auto();
    }
  });
  var x0 = null;
  bb.addEventListener(
    "touchstart",
    function (e) {
      x0 = e.touches[0].clientX;
    },
    { passive: true },
  );
  bb.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var d = e.changedTouches[0].clientX - x0;
    if (Math.abs(d) > 50) {
      go(cur + (d < 0 ? 1 : -1));
      auto();
    }
    x0 = null;
  });
  bbImg.onerror = function () {
    this.style.visibility = "hidden";
    console.warn("Hero image not found: " + this.src);
  };
  /* thumbnail row arrows (desktop); on touch screens the row simply swipes */
  document.getElementById("rPrev").onclick = function () {
    go(cur - 1);
    auto();
  };
  document.getElementById("rNext").onclick = function () {
    go(cur + 1);
    auto();
  };
  go(0);
  auto();

  /* ---- problem cards + filter chips drive the existing project search ---- */
  /* 8. PROBLEM CARDS + FILTER CHIPS: fill the existing project search box so projects.js filters the grid */
  var si = document.getElementById("project-search-input");
  function ask(q) {
    si.value = q;
    si.dispatchEvent(new Event("input"));
    document.querySelectorAll(".filter").forEach(function (f) {
      f.classList.toggle("on", f.dataset.q === q);
    });
  }
  document.querySelectorAll(".problem").forEach(function (p) {
    p.onclick = function () {
      ask(p.dataset.q);
      document.getElementById("work").scrollIntoView();
    };
  });
  document.querySelectorAll(".filter").forEach(function (f) {
    f.onclick = function () {
      ask(f.dataset.q);
    };
  });

  /* ---- contact form: opens an email draft (swap for a webhook/n8n URL later) ---- */
  /* 9. CONTACT FORM: builds a pre-filled email draft (replace with a webhook later) */
  document.getElementById("form").onsubmit = function (e) {
    e.preventDefault();
    var f = e.target;
    location.href =
      "mailto:oliversain1217@gmail.com?subject=" +
      encodeURIComponent("Automation inquiry from " + f.name.value) +
      "&body=" +
      encodeURIComponent(
        f.msg.value + "\n\n" + f.name.value + " (" + f.email.value + ")",
      );
  };

  /* 10. OPEN A CASE STUDY FROM THE HERO: reuses the cards projects.js already renders, so projects.js stays untouched */
  window.openProject = function (id) {
    var all = document.getElementById("all-projects-modal"),
      btn = document.querySelector('[data-project-id="' + id + '"]');
    if (!btn) {
      var see = document.getElementById("see-all-projects-btn");
      if (!see) return;
      see.click();
      btn = all.querySelector('[data-project-id="' + id + '"]');
    }
    if (btn) btn.click();
    all.classList.remove("is-open");
    all.setAttribute("aria-hidden", "true");
  };
})();
