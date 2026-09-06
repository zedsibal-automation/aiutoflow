(function () {
  var PROJECTS = [
    {
      id: "ai-lead-research-maps-module",
      title: "AI-Powered Lead Research Machine — Google Maps Intelligence Module",
      category: "AI Agents",
      image: "images/ai-lead-research-machine-maps-module (1).png",
      descriptionHtml:
        '<p>A conversational, AI-driven lead sourcing pipeline that turns a single typed request into structured, ready-to-use business leads — built entirely on free, open-data infrastructure, with zero API costs.</p>' +
        '<p>This module is the Google Maps sourcing branch of a larger AI Lead Research Machine, letting a user simply type a natural-language request — like &ldquo;plumbing in San Francisco&rdquo; — into a chat interface, and receive back a clean, structured list of real local businesses complete with names, phone numbers, websites, and addresses, automatically saved to a lead database.</p>' +
        '<p>Despite the name, the module does not call Google&rsquo;s Maps/Places API. It runs entirely on OpenStreetMap (via the Nominatim and Overpass APIs) — a deliberate architectural decision made after hitting a Google Cloud billing-account setup issue, choosing a free, open-data alternative rather than blocking the project on a paid dependency.</p>' +
        '<h4>What It Does</h4>' +
        '<ol>' +
        '<li>Accepts a free-text request via a conversational chat trigger</li>' +
        '<li>Uses an LLM to extract the business niche and location — and infers the correct OpenStreetMap tag (e.g. <code>craft=plumber</code>) needed to query real-world business data</li>' +
        '<li>Geocodes the target location into a precise geographic boundary</li>' +
        '<li>Queries OpenStreetMap&rsquo;s global business database for matching listings within that exact area</li>' +
        '<li>Normalizes inconsistent, crowdsourced data into a clean, standardized lead record</li>' +
        '<li>Automatically saves each structured lead to an Airtable database, ready for validation, enrichment and AI scoring</li>' +
        '</ol>' +
        '<h4>Key Technical Challenges Solved</h4>' +
        '<ul>' +
        '<li>Mapping unpredictable, free-text business categories to rigid OpenStreetMap tag taxonomy using AI inference instead of a static lookup table</li>' +
        '<li>Diagnosing and resolving Overpass API query timeouts by replacing expensive regex-based area matching with a precise two-step geocode-then-query architecture</li>' +
        '<li>Handling inconsistent, community-sourced data (missing phone numbers, websites, address fields) gracefully within a single normalization layer</li>' +
        '<li>Designing a source-agnostic lead schema so future lead sources can feed the same downstream pipeline without structural changes</li>' +
        '</ul>' +
        '<h4>Tools &amp; Technologies</h4>' +
        '<ul>' +
        '<li>n8n — workflow automation and orchestration engine</li>' +
        '<li>Google Gemini (Flash-Lite) — natural-language extraction and category inference</li>' +
        '<li>n8n Structured Output Parser — schema-validated AI output</li>' +
        '<li>OpenStreetMap Nominatim API — free geocoding</li>' +
        '<li>OpenStreetMap Overpass API — free, queryable global business database</li>' +
        '<li>Airtable — structured lead database and system of record</li>' +
        '<li>JavaScript (n8n Code nodes) — data transformation and payload merging</li>' +
        '</ul>'
    },
    {
      id: "ai-product-listing-review-queue",
      title: "AI-Generated Product Copy with Built-In Reliability: Shopify → AI → Human Review Queue",
      category: "E-commerce",
      image: "images/AI-Generated Product Info with Built-In Reliability Shopify \u2192 AI \u2192 Human Review Queue.png",
      descriptionHtml:
        '<p>When a new product is added to Shopify, this workflow automatically generates a complete listing draft — description, SEO title, meta description, keyword tags, and image alt-text — and routes it to a monday.com board for human approval before anything touches the live storefront.</p>' +
        '<p>The pipeline starts with a Shopify webhook secured by HMAC signature verification, so only genuine requests from Shopify are processed. Product data is normalized and passed to an AI model with a strict JSON schema enforced on the output, so downstream steps can rely on a predictable shape rather than parsing free-form text.</p>' +
        '<p>AI output isn&rsquo;t trusted blindly. A validation step checks the description length, SEO title length, that keyword tags exist, and that the number of alt-text entries matches the number of product images. If validation fails, the workflow automatically retries generation up to two times before flagging the item for manual writing.</p>' +
        '<h4>Problems Solved Along the Way</h4>' +
        '<ul>' +
        '<li>Diagnosed an HMAC verification failure down to the exact root cause (the webhook&rsquo;s raw request body wasn&rsquo;t being hashed correctly without explicitly enabling raw-body capture)</li>' +
        '<li>Caught and fixed an infinite retry loop caused by a counter not being carried forward between iterations</li>' +
        '<li>Adapted to a live AI model deprecation mid-build (Gemini 2.0 → 3.6) and a subsequent provider outage, rebuilding the generation step on a different provider (Cerebras) with automatic failover (Groq) without changing anything downstream</li>' +
        '</ul>' +
        '<h4>Tools &amp; Platforms Used</h4>' +
        '<ul>' +
        '<li>n8n — workflow orchestration</li>' +
        '<li>Shopify Admin API — product-create webhook trigger, REST API for product data</li>' +
        '<li>Google Gemini API (gemini-3.6-flash) — initial AI generation with native JSON schema mode</li>' +
        '<li>Cerebras API (Llama 3.3 70B, OpenAI-compatible) — primary AI generation after Gemini became unavailable</li>' +
        '<li>Groq API (Llama 3.3 70B Versatile) — automatic fallback model via n8n&rsquo;s AI Agent node</li>' +
        '<li>n8n AI Agent + Structured Output Parser — enforced strict JSON output across providers</li>' +
        '<li>monday.com API (GraphQL) — creates the human review queue item</li>' +
        '<li>Node.js crypto module (via n8n Code node) — HMAC-SHA256 webhook signature verification</li>' +
        '</ul>'
    },
    {
      id: "feedback-driven-regeneration",
      title: "Feedback-Driven Regeneration: Guaranteeing Reviewer Notes Exist Before AI Runs Again",
      category: "AI Agents",
      image: "images/Feedback-Driven Regeneration Guaranteeing Reviewer Notes Exist Before AI Runs Again.png",
      descriptionHtml:
        '<p>Not every AI draft is right the first time. This workflow lets a reviewer leave specific feedback and have the AI regenerate the listing accordingly — built around one deliberate constraint: the AI is never allowed to regenerate without actual feedback to act on.</p>' +
        '<p>A simple &ldquo;status changed to Needs Edits&rdquo; trigger couldn&rsquo;t guarantee a reviewer had actually written anything useful — someone could flip a status with an empty notes field, and the AI would just produce another generic draft. Instead, this branch triggers only once the reviewer actually writes in a dedicated Reviewer Notes column, structurally guaranteeing there&rsquo;s real feedback to work with before any AI call happens.</p>' +
        '<p>Once triggered, the workflow re-fetches the original product from Shopify (rather than relying on possibly-stale cached data), fetches the reviewer&rsquo;s notes, and passes both into a fresh AI generation call — with an explicit instruction to prioritize the reviewer&rsquo;s specific feedback. The result overwrites the same monday.com item in place and resets its status back to &ldquo;Pending Review,&rdquo; re-entering the queue for another look.</p>' +
        '<h4>Design Decisions Worth Noting</h4>' +
        '<ul>' +
        '<li>Identified and eliminated a hidden collision risk: the automated &ldquo;AI failed twice, needs manual write&rdquo; path and the human-driven &ldquo;needs edits&rdquo; path could have shared a status label, potentially causing the workflow to keep retrying an input that had already failed</li>' +
        '<li>Simplified the reviewer-facing status model from three outcomes (Approved / Needs Edits / Rejected) down to two, on the reasoning that a &ldquo;reject&rdquo; is really just unstated feedback — that belongs in the notes field, not a separate status</li>' +
        '</ul>' +
        '<h4>Tools &amp; Platforms Used</h4>' +
        '<ul>' +
        '<li>n8n — workflow orchestration, including an AI Agent node with primary/fallback model routing</li>' +
        '<li>monday.com — column-watch + status-flip automation as the notes-guaranteed trigger; GraphQL API to fetch and update item columns</li>' +
        '<li>Shopify Admin API — re-fetches the current live product as fresh context for regeneration</li>' +
        '<li>Cerebras API (Llama 3.3 70B) — primary regeneration model</li>' +
        '<li>Groq API (Llama 3.3 70B Versatile) — automatic fallback model</li>' +
        '<li>n8n Structured Output Parser — enforces the same strict JSON schema on regenerated output</li>' +
        '</ul>'
    },
    {
      id: "closing-the-loop-shopify-publish",
      title: "Closing the Loop: One-Click Approval That Safely Publishes AI Copy Back to Shopify",
      category: "E-commerce",
      image: "images/Closing the Loop One-Click Approval That Safely Publishes AI Copy Back to Shopify.png",
      descriptionHtml:
        '<p>This workflow is what actually makes the human review step meaningful — it takes a reviewer&rsquo;s approval in monday.com and turns it into a real, live update on the storefront, with no manual copy-pasting required.</p>' +
        '<p>When a reviewer marks an item &ldquo;Approved&rdquo; in monday.com, a native board automation fires a webhook into n8n. The workflow fetches that item&rsquo;s approved copy (description, SEO fields, keyword tags, alt-text) directly from monday.com&rsquo;s columns, then pushes it live to the actual Shopify product — updating the description, SEO title tag, meta description, and tags in one call.</p>' +
        '<p>Image alt-text required a separate step: Shopify treats product images as their own objects, so updating alt-text meant fetching the product&rsquo;s current images, matching each one to its corresponding AI-written alt-text by position, and issuing a dedicated update call per image — a detail that&rsquo;s easy to miss if you assume a single &ldquo;update product&rdquo; call covers everything.</p>' +
        '<h4>Design Decisions Worth Noting</h4>' +
        '<ul>' +
        '<li>Handled monday.com&rsquo;s one-time webhook &ldquo;challenge&rdquo; verification correctly, distinguishing it from real event payloads</li>' +
        '<li>Verified the automation doesn&rsquo;t create a feedback loop — the Shopify update doesn&rsquo;t accidentally re-trigger the original product-creation webhook, since it listens for a different event type entirely</li>' +
        '</ul>' +
        '<h4>Tools &amp; Platforms Used</h4>' +
        '<ul>' +
        '<li>n8n — workflow orchestration</li>' +
        '<li>monday.com — native board automation (&ldquo;When Status changes, send a webhook&rdquo;) as the trigger; GraphQL API to fetch approved column values</li>' +
        '<li>Shopify Admin API — REST endpoints to update the live product (body_html, SEO metafields, tags) and per-image alt-text</li>' +
        '<li>n8n Code nodes — flattening monday.com&rsquo;s column-value array into a usable object, matching images to alt-text by position</li>' +
        '</ul>'
    },
    {
      id: "appointment-confirmation-reminder",
      title: "Appointment Confirmation + Reminder",
      category: "Sales Ops",
      image: "images/Appointment Confirmation + Reminder.png",
      descriptionHtml:
        '<p>A comprehensive, multi-layered appointment reminder system that takes a booked appointment from confirmation all the way through to the final minutes before it starts — using a mix of email and SMS touchpoints to dramatically reduce no-shows.</p>' +
        '<h4>How It Works</h4>' +
        '<ol>' +
        '<li>Trigger: Appointment Booked — fires the moment a new appointment is scheduled</li>' +
        '<li>Remove from Nurture Sequence — pulls the contact out of any active nurture/follow-up sequence</li>' +
        '<li>Update Opportunity Stage — moves the contact&rsquo;s pipeline stage to &ldquo;Appointment Booked&rdquo;</li>' +
        '<li>Notify Team — alerts internal staff that a new appointment has been booked</li>' +
        '<li>Tag: Appointment Confirmed — applies a tracking tag to the contact</li>' +
        '<li>Confirmation Email — sends full appointment details immediately after booking</li>' +
        '<li>24-Hour Reminder — reminder email and SMS sent 24 hours before the appointment</li>' +
        '<li>1-Hour Reminder — reminder email and SMS sent 1 hour before the appointment</li>' +
        '<li>5-Minute Reminder — final reminder email and SMS sent 5 minutes before</li>' +
        '</ol>' +
        '<h4>Key Features</h4>' +
        '<ul>' +
        '<li>Layered reminder cadence (24hr → 1hr → 5min) across both email and SMS channels</li>' +
        '<li>Automatic pipeline and CRM housekeeping (nurture removal, stage updates, tagging)</li>' +
        '<li>Internal team notification for visibility into new bookings</li>' +
        '<li>Time-anchored wait steps calculated relative to the actual appointment time, not a fixed delay</li>' +
        '</ul>' +
        '<h4>Business Value</h4>' +
        '<p>Significantly cuts down on missed appointments by keeping the appointment top-of-mind through multiple channels at multiple intervals, while keeping the CRM and internal team automatically in sync.</p>' +
        '<h4>Tools Used</h4>' +
        '<p>GoHighLevel (GHL), time-based/appointment-relative wait steps, email + SMS automation, pipeline management, tagging.</p>'
    },
    {
      id: "canceled-appointment-sms-followup",
      title: "Canceled Appointment SMS Follow-Up",
      category: "Sales Ops",
      image: "images/Canceled Appointment SMS Follow-Up.png",
      descriptionHtml:
        '<p>A dual-trigger rebooking automation that responds to both cancelled and no-show appointments, automatically updating CRM records, alerting the team, and running a structured SMS sequence designed to recover the lost booking.</p>' +
        '<h4>How It Works</h4>' +
        '<ol>' +
        '<li>Dual Triggers — starts from either &ldquo;Appointment Marked as Cancelled&rdquo; or &ldquo;Appointment Marked as No-Show&rdquo;</li>' +
        '<li>Update Opportunity Stage — updates automatically to reflect the cancellation or no-show status</li>' +
        '<li>Check: Cancellation or No-Show? — a conditional filter splits the contact down one of two paths' +
        '<ul>' +
        '<li><strong>Cancellation path:</strong> notifies the team, tags &ldquo;Cancelled – Needs Rebooking&rdquo;, then sends a 3-touch SMS sequence (sorry to see you go + link, reminder, final offer) spaced one day apart</li>' +
        '<li><strong>No-show path:</strong> tags &ldquo;No-Show – Needs Follow-Up&rdquo;, then sends the same 3-touch SMS cadence with &ldquo;we missed you&rdquo; messaging</li>' +
        '</ul>' +
        '</li>' +
        '</ol>' +
        '<h4>Key Features</h4>' +
        '<ul>' +
        '<li>Handles two distinct appointment-loss scenarios with tailored messaging for each</li>' +
        '<li>Automatic CRM tagging and pipeline updates for clean reporting</li>' +
        '<li>Team notification ensures cancellations don&rsquo;t go unnoticed</li>' +
        '<li>3-touch SMS cadence spaced over multiple days to maximize rebooking odds without being pushy</li>' +
        '</ul>' +
        '<h4>Business Value</h4>' +
        '<p>Recovers revenue that would otherwise be lost to cancellations and no-shows by immediately and consistently prompting leads to rebook — all without requiring manual follow-up from staff.</p>' +
        '<h4>Tools Used</h4>' +
        '<p>GoHighLevel (GHL), conditional logic (AND/NONE branches), SMS automation, opportunity/pipeline updates, team notifications.</p>'
    },
    {
      id: "contact-responded-followup",
      title: "Contact Responded to Follow-Up",
      category: "Sales Ops",
      image: "images/Contact Responded to Follow up.png",
      descriptionHtml:
        '<p>A &ldquo;hand-off&rdquo; automation that detects when a lead engages with an SMS or email follow-up and instantly transitions them from automated outreach to human sales follow-up — ensuring warm leads are never left in a bot sequence once they&rsquo;ve shown interest.</p>' +
        '<h4>How It Works</h4>' +
        '<ol>' +
        '<li>Contact Responds to SMS/Email — triggers as soon as a contact replies to any follow-up message</li>' +
        '<li>Notify Sales Team — alerts the sales team that a lead has engaged and needs attention</li>' +
        '<li>Tag: Responded / Warm Lead — applies a tag marking the contact as an engaged, warm lead</li>' +
        '<li>Stop Automated Messages — immediately halts any other active automated sequences for that contact</li>' +
        '<li>Tag: Engaged Lead – Ready for Manual Follow-Up — flags the lead as ready for a rep to take over personally</li>' +
        '</ol>' +
        '<h4>Key Features</h4>' +
        '<ul>' +
        '<li>Instant, real-time trigger on any SMS or email reply</li>' +
        '<li>Automatically stops all other running automations to avoid overlap or duplicate messaging</li>' +
        '<li>Two-stage tagging system for clear CRM segmentation and reporting</li>' +
        '<li>Simple, linear design that&rsquo;s easy to plug into any larger automation ecosystem</li>' +
        '</ul>' +
        '<h4>Business Value</h4>' +
        '<p>Prevents warm, ready-to-buy leads from continuing to receive robotic follow-ups after they&rsquo;ve already responded — protecting the customer experience and making sure sales reps know exactly who to call next.</p>' +
        '<h4>Tools Used</h4>' +
        '<p>GoHighLevel (GHL), trigger-based reply detection, tagging, automated sequence control, team notifications.</p>'
    },
    {
      id: "instagram-comment-automation",
      title: "Instagram Comment Automation",
      category: "Content Automation",
      image: "images/Instagram Comment Automation.png",
      descriptionHtml:
        '<p>A comment-to-DM conversion workflow that captures engagement on Instagram posts and turns it into a direct, private conversation — replying publicly to acknowledge the comment, then following up with a private DM to deliver an offer or link.</p>' +
        '<h4>How It Works</h4>' +
        '<ol>' +
        '<li>New Comment on Instagram Post — triggers whenever someone comments on a monitored post</li>' +
        '<li>Respond on Comment (Default Path) — automatically posts a public reply, keeping engagement visible and encouraging others to comment too</li>' +
        '<li>Send Private DM – Deliver Offer/Link — follows up with a direct message delivering a specific offer, resource, or link</li>' +
        '</ol>' +
        '<h4>Key Features</h4>' +
        '<ul>' +
        '<li>Two-channel response (public reply + private DM) maximizes both visibility and conversion</li>' +
        '<li>Simple, fast, three-step structure that&rsquo;s easy to replicate across multiple posts or campaigns</li>' +
        '<li>Turns organic engagement (comments) directly into a private sales or lead-capture conversation</li>' +
        '<li>Fully automated — works around the clock without anyone monitoring the post manually</li>' +
        '</ul>' +
        '<h4>Business Value</h4>' +
        '<p>Capitalizes on the psychology of social proof (public replies) while still driving qualified traffic into a private, more personal conversation — an efficient, low-cost way to convert post engagement into leads or sales.</p>' +
        '<h4>Tools Used</h4>' +
        '<p>GoHighLevel (GHL), Instagram comment trigger, automated public reply, Instagram DM automation.</p>'
    }
  ];

  function renderGrid() {
    var grid = document.getElementById("project-grid");
    if (!grid) return;
    grid.innerHTML = PROJECTS.map(function (p) {
      return (
        '<div class="reveal"><button type="button" class="nm-lift group flex h-full w-full flex-col overflow-hidden rounded-3xl p-3 text-left" data-project-id="' +
        p.id +
        '" aria-haspopup="dialog"><div class="nm-inset-sm project-card-thumb shrink-0 overflow-hidden rounded-2xl"><img src="' +
        p.image +
        '" alt="' +
        p.title.replace(/"/g, "&quot;") +
        '" loading="lazy" decoding="async"/></div><div class="flex flex-1 flex-col px-2 pt-4 pb-2"><span class="text-[11px] font-bold tracking-wide text-primary uppercase">' +
        p.category +
        '</span><h3 class="mt-1 font-display text-base font-bold">' +
        p.title +
        '</h3></div></button></div>'
      );
    }).join("");

    grid.querySelectorAll("[data-project-id]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openModal(btn.getAttribute("data-project-id"));
      });
    });
  }

  function openModal(id) {
    var project = PROJECTS.filter(function (p) { return p.id === id; })[0];
    if (!project) return;
    var overlay = document.getElementById("project-modal");
    document.getElementById("modal-image").src = project.image;
    document.getElementById("modal-image").alt = project.title;
    document.getElementById("modal-category").textContent = project.category;
    document.getElementById("modal-title").textContent = project.title;
    document.getElementById("modal-description").innerHTML = project.descriptionHtml;
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("project-modal-locked");
    overlay.querySelector(".project-modal-close").focus();
  }

  function closeModal() {
    var overlay = document.getElementById("project-modal");
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("project-modal-locked");
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderGrid();
    var overlay = document.getElementById("project-modal");
    if (overlay) {
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay || e.target.hasAttribute("data-modal-close")) {
          closeModal();
        }
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  });
})();
