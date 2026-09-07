(function () {
  var VISIBLE_LIMIT = 12;

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
      image: "images/AI-Generated Product Info with Built-In Reliability Shopify → AI → Human Review Queue.png",
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
    },
    {
      id: "vapi-lead-caller-polling",
      title: "AI Voice Lead-Caller: Automated Outbound Calling Pipeline with Polling Architecture",
      category: "Sales Ops",
      image: "images/Vapi Lead Caller - Polling automation.png",
      descriptionHtml:
        '<p>Built an end-to-end automation that takes inbound leads from a web form and autonomously places AI-voice outbound calls to qualify and engage them — with no human intervention required for routine cases. The system actively polls the call&rsquo;s status until it resolves, then branches its logic based on the real outcome (voicemail, completed conversation, or timeout), logging everything and syncing qualified leads into a CRM.</p>' +
        '<p>This moves beyond a simple &ldquo;trigger &rarr; API call&rdquo; automation into a full stateful, asynchronous workflow with compliance gating, error recovery, and a loop-based polling mechanism — patterns that generalize to any workflow dealing with long-running third-party jobs.</p>' +
        '<h4>The Problem</h4>' +
        '<ul>' +
        '<li>A naive version calls the same lead multiple times if they submit the form twice</li>' +
        '<li>Calls people who&rsquo;ve explicitly opted out — a compliance risk</li>' +
        '<li>Calls at 3am because nothing checks business hours</li>' +
        '<li>Has no idea whether the call actually succeeded, went to voicemail, or is still ringing</li>' +
        '<li>A failed API call silently kills the entire execution, with no record of what happened</li>' +
        '</ul>' +
        '<h4>Architecture</h4>' +
        '<p><strong>Intake &amp; data standardization:</strong> a form trigger captures lead details, then a Code node normalizes the phone number into E.164 format regardless of input style, stamping the record with a unique lead ID and a poll-count counter initialized to zero.</p>' +
        '<p><strong>Compliance &amp; eligibility gating:</strong> before any call is placed, the lead passes through four sequential checks — duplicate detection, opt-out/Do-Not-Call check, business hours check, and phone number validity — each logged to its own audit sheet on failure, and each gate is a lookup against a live Google Sheet so non-technical staff can edit the rules without touching the workflow.</p>' +
        '<p><strong>Placing the call:</strong> an HTTP request initiates the outbound call via Vapi&rsquo;s API, passing lead context into the AI assistant so the conversation is personalized. Failures route to a dedicated logging branch and Slack alert instead of silently crashing the run.</p>' +
        '<p><strong>Asynchronous polling loop:</strong> the architectural core of the project. Placing a call doesn&rsquo;t mean it&rsquo;s done — Vapi returns immediately with a &ldquo;queued&rdquo; status. A running poll-count counter carried across every loop iteration, plus a hard ceiling on attempts, keeps the loop from polling indefinitely; an unresolved call after the attempt budget is explicitly logged as a timeout rather than vanishing silently.</p>' +
        '<p><strong>Outcome classification &amp; CRM sync:</strong> once a call ends, the workflow distinguishes voicemail (logged, no follow-up) from a real completed conversation, which triggers a full HubSpot sync — the contact is upserted and a call note is attached with the AI-generated summary, transcript, and a structured success evaluation.</p>' +
        '<h4>Engineering Decisions Worth Highlighting</h4>' +
        '<ul>' +
        '<li>Deterministic phone validation — normalizing every input format into a single canonical E.164 string before any downstream logic touches it</li>' +
        '<li>Mock-first testing strategy — Vapi HTTP nodes were temporarily swapped for Code nodes simulating realistic responses, so the entire polling loop could be validated without burning real API calls</li>' +
        '<li>Shared logging table with conditional columns — a single Call_Log sheet written to by four different outcome branches, each populating only the fields relevant to that outcome</li>' +
        '<li>Fail-open error handling on lookups — sheet lookups continue rather than halt the entire execution on error</li>' +
        '</ul>' +
        '<h4>Stack</h4>' +
        '<p>n8n, Vapi (AI voice agent), Google Sheets, Slack, HubSpot CRM, Twilio (in progress).</p>'
    },
    {
      id: "ai-job-scraper-resume-optimizer",
      title: "AI Job Scraper & Resume Optimizer: A Slack-Native Job Search Assistant",
      category: "AI Agents",
      image: "images/AI_Job_Scraper_Resume_Optimizer_Project.png",
      descriptionHtml:
        '<p>Built a conversational, AI-powered job search assistant that lives entirely inside Slack. A user @mentions the bot with a natural-language job query and the workflow autonomously searches live job boards, filters for genuinely relevant results, and — for every matching listing — generates a fully tailored, ATS-optimized resume and a ready-to-send application, all without leaving Slack.</p>' +
        '<p>It&rsquo;s an end-to-end pipeline: search &rarr; validate &rarr; tailor &rarr; package &rarr; deliver, running once per job listing found, with duplicate-prevention logic so the same job doesn&rsquo;t generate redundant resume copies if searched twice.</p>' +
        '<h4>How It Works</h4>' +
        '<ol>' +
        '<li>A Slack Trigger listens for @mentions in a dedicated channel — no separate app or dashboard required</li>' +
        '<li>A Gemini model classifies whether the message is actually a job-search request before any API calls are spent</li>' +
        '<li>The validated query is passed to the JSearch API, filtered for recent, remote, full-time/contract/part-time roles</li>' +
        '<li>Each job returned is processed independently through a batch loop, so tailoring doesn&rsquo;t bleed between listings</li>' +
        '<li>For each job, an AI agent (Gemini primary, OpenRouter automatic fallback) rewrites the resume into ATS-optimized sections, and drafts either an application email or an Upwork proposal depending on the listing type</li>' +
        '<li>Before creating a new resume document, Google Drive is checked for a file already named for this exact job and date, preventing duplicate files</li>' +
        '<li>A resume template is copied and its placeholder tokens are replaced with the AI-generated content</li>' +
        '<li>A Gmail draft is created automatically when a valid contact email exists; either way a Slack message is posted back with the job details, resume link, and application material</li>' +
        '</ol>' +
        '<h4>Engineering Decisions Worth Highlighting</h4>' +
        '<ul>' +
        '<li>AI-gated intake — a lightweight classification step filters out noise before any expensive downstream work runs</li>' +
        '<li>Dual-provider LLM fallback — Gemini with an automatic OpenRouter fallback so a single provider outage doesn&rsquo;t stall the pipeline</li>' +
        '<li>Idempotent document creation — a lookup-before-copy step guards against duplicate file sprawl</li>' +
        '<li>Structured output over free-text parsing — a strict JSON schema makes AI output directly consumable by downstream nodes</li>' +
        '<li>Conditional branching based on content, not just structure — an email draft is only created if a valid address was actually extracted</li>' +
        '</ul>' +
        '<h4>Stack</h4>' +
        '<p>n8n, Slack API, Google Gemini, OpenRouter, JSearch (RapidAPI), Google Drive, Google Docs, Gmail.</p>'
    },
    {
      id: "asmr-video-generation-auto-post",
      title: "AI-Powered ASMR Video Generation & Multi-Platform Auto-Publishing Pipeline",
      category: "Content Automation",
      image: "images/ASMR ai generating video with fb and youtube auto post.png",
      descriptionHtml:
        '<p>An end-to-end automation that ideates, generates, and publishes short-form ASMR video content across YouTube, Facebook, and Instagram — fully hands-free after initial setup. The system runs on a schedule, uses an AI agent to brainstorm unique video concepts, generates the actual video via a generative AI model, and distributes the finished asset to three social platforms simultaneously.</p>' +
        '<h4>How It Works</h4>' +
        '<ol>' +
        '<li>A Schedule Trigger kicks off the workflow, and an AI Agent (Google Gemini, with a Structured Output Parser) brainstorms a new video concept</li>' +
        '<li>The new idea is checked against a full history of previously generated concepts in Google Sheets — duplicates are discarded and regenerated</li>' +
        '<li>The approved concept is logged, then sent to Replicate AI to kick off video generation</li>' +
        '<li>A polling loop (wait &rarr; check status) checks the render status at intervals, avoiding wasted calls or premature downloads</li>' +
        '<li>Once ready, the video URL is logged and the binary file is downloaded for distribution</li>' +
        '<li>The workflow fans out into three parallel publishing branches: YouTube (Data API), Facebook (Graph API), and Instagram (a three-step container-then-publish Graph API sequence for Reels)</li>' +
        '</ol>' +
        '<h4>Key Technical Challenges Solved</h4>' +
        '<ul>' +
        '<li>Duplicate-content prevention via a stateful check against a growing Google Sheets log</li>' +
        '<li>A resilient poll-and-wait loop handles Replicate&rsquo;s non-instant render times without timing out or double-processing</li>' +
        '<li>Each destination platform has a distinct authentication model and publishing contract — Instagram alone requires a two-step container-then-publish flow with correct host routing</li>' +
        '<li>A full audit trail logs every generated idea, its duplicate-check result, and its final published video URL</li>' +
        '</ul>' +
        '<h4>Stack</h4>' +
        '<p>n8n, Google Gemini, Replicate AI, Google Sheets, Facebook Graph API, Instagram Graph API, YouTube Data API.</p>'
    },
    {
      id: "ai-fb-chatbot-calendar-booking",
      title: "AI-Powered Facebook Messenger Chatbot with Calendar Booking",
      category: "AI Agents",
      image: "images/ai_Fb_chatbot.png",
      descriptionHtml:
        '<p>Built an intelligent Facebook Messenger chatbot using n8n that combines knowledge-base Q&amp;A with automated appointment scheduling. The bot verifies incoming Meta webhook events, then routes messages to an AI agent that answers questions strictly from a connected Google Docs knowledge base — avoiding hallucinated responses by explicitly grounding replies in the source document.</p>' +
        '<p>Beyond Q&amp;A, the agent can autonomously check availability and create events directly in Google Calendar based on natural conversation, confirming details with the user before booking. It maintains conversational memory across a session for context-aware, multi-turn interactions, with replies pushed back to the user in real time through the Facebook Graph API.</p>' +
        '<h4>Key Features</h4>' +
        '<ul>' +
        '<li>Meta webhook verification &amp; subscription handling</li>' +
        '<li>RAG-style knowledge base grounding via Google Docs</li>' +
        '<li>AI agent with dual-LLM fallback (Groq + Google Gemini) for reliability</li>' +
        '<li>Tool-calling for Google Calendar (create + check events)</li>' +
        '<li>Session-based conversational memory</li>' +
        '<li>Automated Messenger reply delivery via Graph API</li>' +
        '</ul>' +
        '<h4>Tech Stack</h4>' +
        '<p>n8n, Meta Messenger API, Google Docs API, Google Calendar API, Groq (LLM), Google Gemini (LLM).</p>'
    },
    {
      id: "memes-auto-generation",
      title: "Automated Meme Collection & Archiving Workflow",
      category: "Content Automation",
      image: "images/memes-auto-generation.png",
      descriptionHtml:
        '<p>Built an n8n automation that pulls a batch of fresh memes from a public meme API and archives them into Google Sheets — with built-in deduplication, pagination handling, and safe retry limits.</p>' +
        '<p>The workflow loops through API calls, merging each new batch of results with everything collected so far while filtering out duplicates by post link. It automatically tracks how many unique memes are still needed and keeps requesting more until either the target count (50) is hit or a maximum attempt cap (10) is reached — preventing infinite loops if the source API runs out of fresh content. Once collection is complete, each meme&rsquo;s title and URL is split out and appended as its own row into a Google Sheet.</p>' +
        '<h4>Key Features</h4>' +
        '<ul>' +
        '<li>Automated batch collection from a public meme API</li>' +
        '<li>Custom JS-based deduplication logic (by post link) across loop iterations</li>' +
        '<li>Self-limiting loop with dual exit conditions (target count OR max attempts)</li>' +
        '<li>Rate-limiting delay between requests to avoid API throttling</li>' +
        '<li>Automatic archiving to Google Sheets, one row per meme (title + URL)</li>' +
        '</ul>' +
        '<h4>Tech Stack</h4>' +
        '<p>n8n, Meme API, Google Sheets API, JavaScript (Code node).</p>'
    },
    {
      id: "multi-channel-content-distribution",
      title: "Multi-Channel AI Content Distribution Engine (Airtable + Gemini + JoggAI + Make.com)",
      category: "AI Agents",
      image: "images/Multi-Channel AI Content Distribution Engine (Airtable + Gemini + JoggAI + Make.com).png",
      descriptionHtml:
        '<p>Built a fully automated content repurposing pipeline that takes a single approved article from Airtable and transforms it into three platform-native outputs — a LinkedIn post, a Facebook post, and an AI-avatar TikTok video — each written and formatted for how that specific platform&rsquo;s algorithm and audience actually behave.</p>' +
        '<h4>How It Works</h4>' +
        '<ul>' +
        '<li><strong>Source content:</strong> queries Airtable for articles flagged as approved, pulling the headline, topic, summary, and body</li>' +
        '<li><strong>Routing:</strong> a router splits the approved record into three parallel branches, one per output channel</li>' +
        '<li><strong>LinkedIn branch:</strong> Gemini rewrites the content as a first-person, insight-driven post structured for dwell time and comments, then publishes directly to a LinkedIn Company Page</li>' +
        '<li><strong>Facebook branch:</strong> Gemini rewrites the same content as a warm, conversational post engineered to spark reactions and shares, then publishes via the Facebook Pages API</li>' +
        '<li><strong>TikTok branch:</strong> Gemini converts the content into a spoken-word video script under a strict character limit, parsed with regex, sent to JoggAI to generate a talking-avatar video, polled until rendering completes, and posted with a matching AI-generated caption</li>' +
        '</ul>' +
        '<h4>Outcome</h4>' +
        '<p>Replaced a manual, per-platform content adaptation process with a single trigger that produces three fully distinct, platform-optimized pieces of content — including an AI-generated talking-avatar video — from one source article, with no repeated manual writing or video editing.</p>' +
        '<h4>Tools &amp; Integrations</h4>' +
        '<p>Make.com, Airtable, Google Gemini (Gemini Pro), JoggAI (Talking Avatar API), TikTok API, LinkedIn API, Facebook Pages API, regex parsing.</p>'
    },
    {
      id: "proposals-contracts-invoices",
      title: "Proposals, Contracts & Invoices Generation — n8n Workflow",
      category: "Sales Ops",
      image: "images/Proposals, Contracts & Invoices Generation — n8n Workflow.png",
      descriptionHtml:
        '<p>This n8n automation takes a lead from initial form submission all the way through proposal generation, contract signature, and invoicing — with zero manual handoffs. It serves both new and existing customers, branching intelligently based on where each contact sits in the sales pipeline, and keeps HubSpot as the single source of truth throughout.</p>' +
        '<h4>How It Works</h4>' +
        '<ol>' +
        '<li><strong>Intake &amp; routing:</strong> a Tally form submission triggers the workflow; a router splits the flow based on engagement type — full proposal/contract/invoice generation, or a lightweight deal update + email notification</li>' +
        '<li><strong>CRM sync:</strong> contact and deal records are found/created and updated in HubSpot CRM at each key stage</li>' +
        '<li><strong>AI-assisted proposal content:</strong> an AI step generates/refines proposal copy dynamically based on the submitted brief</li>' +
        '<li><strong>Document generation:</strong> Google Slides creates a proposal deck from a template, exported via Google Drive, then sent for e-signature through DocuSeal</li>' +
        '<li><strong>Customer &amp; invoice handling:</strong> a second router checks whether the contact is a new or existing Stripe customer, creating a customer record if needed, then generating and sending an invoice item, invoice, and finalized invoice — updating the HubSpot deal once billing is complete</li>' +
        '<li><strong>Notifications:</strong> for the lighter-weight path, a Gmail notification is sent automatically once the HubSpot deal is updated</li>' +
        '</ol>' +
        '<h4>Business Impact</h4>' +
        '<p>Eliminates manual proposal drafting, document formatting, and invoice creation; ensures every deal follows a consistent, repeatable proposal-to-payment pipeline; keeps CRM data always up to date; reduces time from lead to signed contract + invoice from days to minutes.</p>' +
        '<h4>Tools &amp; Integrations</h4>' +
        '<p>Tally, HubSpot CRM, Gemini (AI), Google Slides, Google Drive, DocuSeal, Stripe, Gmail, n8n.</p>'
    },
    {
      id: "website-content-social-media-pipeline",
      title: "Automated Social Media Content Pipeline (Make.com + ChatGPT + Browse AI)",
      category: "AI Agents",
      image: "images/Summarize Website Content & Auto-Post to Social Media with ChatGPT and Browse AI.png",
      descriptionHtml:
        '<p>Built an end-to-end automation that converts any website&rsquo;s content into platform-ready social media posts and publishes them automatically — with zero manual copywriting or data entry.</p>' +
        '<h4>How It Works</h4>' +
        '<ul>' +
        '<li>A Tally form intake captures a target website URL from the user</li>' +
        '<li>The submitted URL is automatically recorded in Google Sheets for tracking and auditability</li>' +
        '<li>A Browse AI robot scrapes the live content from the submitted website</li>' +
        '<li>The scraped content is passed to OpenAI (ChatGPT), which summarizes it and rewrites it as two separate, platform-optimized posts</li>' +
        '<li>A router splits the workflow into parallel branches — one post is auto-published to a LinkedIn Company Page, the other to a Facebook Page</li>' +
        '</ul>' +
        '<h4>Outcome</h4>' +
        '<p>Reduced a multi-step manual content workflow (research &rarr; summarize &rarr; write &rarr; format &rarr; post) down to a single form submission, with fully automated, on-brand output across two social channels simultaneously.</p>' +
        '<h4>Tools &amp; Integrations</h4>' +
        '<p>Make.com, Tally, Google Sheets, Browse AI, OpenAI (ChatGPT), LinkedIn API, Facebook Pages API.</p>'
    },
    {
      id: "shopify-dormant-customer-reactivation",
      title: "Shopify Dormant Customer Reactivation Automation (n8n)",
      category: "E-commerce",
      image: "images/Shopify Dormant Customer Reactivation Automation (n8n).png",
      descriptionHtml:
        '<p>Built a scheduled n8n automation that identifies dormant Shopify customers — those with real purchase history who haven&rsquo;t ordered in a while — and automatically sends them a personalized &ldquo;we miss you&rdquo; email with a discount incentive, without ever re-emailing the same customer twice.</p>' +
        '<p>Manually tracking who&rsquo;s gone dormant, checking whether they&rsquo;ve already been re-engaged, and sending timely win-back emails isn&rsquo;t sustainable without automation — especially since Shopify has no native &ldquo;customer went dormant&rdquo; webhook to trigger off of.</p>' +
        '<h4>Solution</h4>' +
        '<ol>' +
        '<li>A daily Schedule Trigger runs the dormancy check once per day</li>' +
        '<li>A Shopify GraphQL request pulls the full customer list along with each customer&rsquo;s most recent order date via a nested orders query — rather than relying on Shopify&rsquo;s aggregate order-count fields, which are known to be unreliable for test-mode orders</li>' +
        '<li>Customers with zero order history are filtered out entirely (first-time visitors aren&rsquo;t dormant, they&rsquo;re just new)</li>' +
        '<li>Real inactivity in days is calculated from the nested order data, and only customers inactive beyond a configured threshold (30+ days) proceed</li>' +
        '<li>A dedup lookup against a shared tracking sheet filters out customers already re-engaged</li>' +
        '<li>Customers who pass every check receive a personalized win-back email with a discount code, and their row is marked with a timestamp so they&rsquo;re never emailed twice for the same dormancy period</li>' +
        '</ol>' +
        '<h4>Key Engineering Details</h4>' +
        '<ul>' +
        '<li>Bypassed a known Shopify limitation where aggregate order-count fields silently fail to recognize orders placed via test payment methods — solved by reading the nested orders connection directly per customer</li>' +
        '<li>Two-stage filtering (has-orders check, then days-inactive threshold) keeps the dormancy definition accurate and avoids wasting API calls</li>' +
        '<li>Dedup logic reuses the same Google Sheet the store&rsquo;s Customer Sync automation already maintains, avoiding a second source of truth</li>' +
        '</ul>' +
        '<h4>Tech Stack</h4>' +
        '<p>n8n, Shopify Admin GraphQL API, Google Sheets, Gmail.</p>'
    },
    {
      id: "shopify-fulfillment-review-automation",
      title: "Shopify Fulfillment & Review Automation (n8n)",
      category: "E-commerce",
      image: "images/Shopify Fulfillment & Review Automation (n8n).png",
      descriptionHtml:
        '<p>Built an end-to-end post-purchase automation for a Shopify store that replaces a basic &ldquo;notify + blind wait + ask for review&rdquo; flow with a delivery-status-aware system — ensuring customers only receive review requests after their order is confirmed delivered, not on a guessed timer.</p>' +
        '<p>The original approach sent a review request after a fixed wait period regardless of whether the package had actually arrived, risking review requests for delayed, lost, or returned orders.</p>' +
        '<h4>Solution</h4>' +
        '<p>Triggered on Shopify&rsquo;s Fulfillment Update webhook, the workflow routes customer communication based on real shipment status: an in-transit shipping update with live tracking, a same-day out-for-delivery notice, a lightweight 1-question rating request once delivered, and an internal Slack alert (with an optional customer apology) on failure — never entering the review flow.</p>' +
        '<p>Rating responses feed back into the workflow via a dedicated webhook: 4&ndash;5 star responses receive a public review link (Google/Trustpilot) with an incentive, while 1&ndash;3 star responses route privately to the internal team — protecting the store&rsquo;s public rating while still capturing the feedback internally.</p>' +
        '<h4>Key Engineering Details</h4>' +
        '<ul>' +
        '<li>Built and validated entirely through Shopify test orders by manually toggling shipment_status to simulate each branch, since live carrier tracking wasn&rsquo;t available in test mode</li>' +
        '<li>Handled Shopify data-structure nuances (shipment_status nested under fulfillments[], multi-line-item orders needing aggregation)</li>' +
        '<li>Designed with a clear upgrade path to a live carrier tracking API (AfterShip/17Track) without restructuring the core routing logic</li>' +
        '</ul>' +
        '<h4>Tech Stack</h4>' +
        '<p>n8n, Shopify Admin API, Gmail, Slack, Google Sheets.</p>'
    },
    {
      id: "shopify-low-stock-supplier-reorder",
      title: "Shopify Low-Stock Supplier Reorder Automation (n8n)",
      category: "E-commerce",
      image: "images/Shopify Low-Stock Supplier Reorder Automation (n8n).png",
      descriptionHtml:
        '<p>Built a daily n8n automation that monitors real-time inventory across an entire Shopify product catalog, identifies items that have dropped below a configurable reorder threshold, and automatically emails the correct supplier a purchase order — while guaranteeing no supplier is ever emailed twice for the same pending restock.</p>' +
        '<h4>Solution</h4>' +
        '<ol>' +
        '<li>A daily Cron pulls every product and variant, including SKU and live inventory quantity, via Shopify&rsquo;s GraphQL API</li>' +
        '<li>A Code node flattens Shopify&rsquo;s nested product→variant structure into one flat item per SKU</li>' +
        '<li>Each SKU is matched against a maintained Google Sheets config (Reorder Point, Reorder Quantity, Supplier Name/Email) — business rules Shopify itself has no concept of</li>' +
        '<li>Only SKUs whose live inventory has dropped to or below their threshold proceed</li>' +
        '<li>Each surviving SKU is checked, one at a time, against a PO Log tab for an already-pending purchase order — keeping only SKUs with no pending PO in flight</li>' +
        '<li>A formatted purchase order is emailed directly to the correct supplier, and the new PO is logged with a &ldquo;Pending&rdquo; status</li>' +
        '</ol>' +
        '<h4>Key Engineering Details</h4>' +
        '<ul>' +
        '<li>Diagnosed and fixed a subtle n8n/Google Sheets batching bug: when 3+ items flow into a filtered lookup node together, &ldquo;Always Output Data&rdquo; only injects a placeholder if the entire node&rsquo;s combined output is empty — not per item — so non-matching items in the same batch silently vanished. Wrapping the lookup in a Loop Over Items node forced true one-at-a-time execution, restoring correct behavior</li>' +
        '<li>Caught a real data-quality issue during testing where two variants of the same product shared an identical SKU, which would have made reorder matching ambiguous</li>' +
        '<li>Config-driven design keeps business logic entirely outside the workflow — adding a new product to monitor requires only a new spreadsheet row, no canvas changes</li>' +
        '<li>The PO Log doubles as both the dedup source of truth and a running audit trail of every reorder ever triggered</li>' +
        '</ul>' +
        '<h4>Tech Stack</h4>' +
        '<p>n8n, Shopify Admin GraphQL API, Google Sheets, Gmail.</p>'
    },
    {
      id: "shopify-out-of-stock-back-in-stock",
      title: "Shopify Out-of-Stock Tagging & Back-in-Stock Notification Automation (n8n)",
      category: "E-commerce",
      image: "images/Shopify Out-of-Stock Tagging & Back-in-Stock Notification Automation (n8n).png",
      descriptionHtml:
        '<p>Built a full-cycle n8n automation that automatically flags out-of-stock Shopify products, lets customers sign up to be notified the moment an item returns, and closes the loop by detecting restocks and emailing every waiting customer — turning what would otherwise be lost sales into recovered revenue with zero manual monitoring.</p>' +
        '<p>Shopify has no native back-in-stock notification feature — most themes only show a passive &ldquo;Sold Out&rdquo; label. Industry data suggests stores using a working alert system recover roughly 10&ndash;25% of stockout demand that would otherwise be lost entirely.</p>' +
        '<h4>Solution</h4>' +
        '<p>A daily inventory pipeline flags any product at zero quantity with a &ldquo;Sold Out&rdquo; tag — deliberately using a tag rather than Shopify&rsquo;s DRAFT status, since DRAFT makes the page 404 and would hide the customer-facing signup form along with the product. A custom &ldquo;Notify Me&rdquo; form, added directly into the theme&rsquo;s buy-buttons.liquid block, appears only when a variant is unavailable; submissions are validated and logged via an n8n webhook. On detecting a genuine restock, the tag is removed and every customer waiting on that SKU is emailed automatically, then marked Notified so they&rsquo;re never emailed twice for the same cycle.</p>' +
        '<h4>Key Engineering Details</h4>' +
        '<ul>' +
        '<li>Diagnosed a Loop Over Items failure mode where a Filter node discarding all items on an iteration silently halted the entire batch — fixed by replacing Filter nodes with IF nodes and wiring both true and false branches back to the loop&rsquo;s input</li>' +
        '<li>Corrected a theme-integration design flaw mid-build: hiding out-of-stock products via DRAFT status had made the Notify Me button unreachable; reworked to a tag-based approach that keeps the page accessible</li>' +
        '<li>Hardened credential security after catching a live Shopify Admin API token hardcoded in plaintext across multiple nodes — rotated the token and migrated to a single reusable Header Auth credential</li>' +
        '<li>Fixed a signup data-loss bug where matching rows by email alone caused a second signup to overwrite the first — resolved by matching on a combined email|SKU key</li>' +
        '</ul>' +
        '<h4>Tech Stack</h4>' +
        '<p>n8n, Shopify Admin GraphQL API, Shopify theme Liquid/JavaScript, Google Sheets, Gmail.</p>'
    },
    {
      id: "shopify-vip-loyalty-tier",
      title: "Shopify VIP Loyalty Tier Automation (n8n)",
      category: "E-commerce",
      image: "images/Shopify VIP Loyalty Tier Automation (n8n).png",
      descriptionHtml:
        '<p>Built a real-time n8n automation that tracks each customer&rsquo;s cumulative spend in Google Sheets and automatically assigns a loyalty tier (Bronze, Silver, Gold, Platinum) the moment their running total crosses a threshold — without depending on Shopify&rsquo;s own aggregate spend field.</p>' +
        '<p>Shopify&rsquo;s native amountSpent field lags after a payment webhook fires, making it unreliable for real-time tier assignment.</p>' +
        '<h4>Solution</h4>' +
        '<ol>' +
        '<li>An Order Paid trigger fires immediately on payment</li>' +
        '<li>The customer&rsquo;s existing row (Total_Spent and Tier) is looked up in a shared tracking sheet</li>' +
        '<li>The new order&rsquo;s total is added to the customer&rsquo;s existing spend, producing an up-to-date running total independent of Shopify&rsquo;s lagging field</li>' +
        '<li>The new total is evaluated against fixed thresholds — Bronze (default), Silver, Gold, Platinum — to determine the tier</li>' +
        '<li>A filter only lets the workflow continue if the tier actually changed, avoiding redundant writes on every order</li>' +
        '<li>The new total and tier are written back to the customer&rsquo;s row</li>' +
        '</ol>' +
        '<h4>Key Engineering Details</h4>' +
        '<ul>' +
        '<li>Deliberately avoided Shopify&rsquo;s amountSpent GraphQL field after confirming via testing that it doesn&rsquo;t update immediately after payment</li>' +
        '<li>The tier-changed filter prevents a customer who stays in the same tier across multiple purchases from retriggering downstream actions</li>' +
        '<li>Threshold values were chosen as round numbers for a pre-launch store without historical data, with a clear path to revisit using real spending data post-launch</li>' +
        '</ul>' +
        '<h4>Tech Stack</h4>' +
        '<p>n8n, Shopify Admin API, Google Sheets (shared with the store&rsquo;s Customer Sync and Reactivation automations).</p>'
    },
    {
      id: "shopify-order-processing-fulfillment",
      title: "Shopify Order Processing & Fulfillment Operations Automation (n8n)",
      category: "E-commerce",
      image: "images/Shopify-Order-Processing-Automation-Portfolio.png",
      descriptionHtml:
        '<p>Built a comprehensive, multi-branch order-processing automation in n8n that handles the full lifecycle of a Shopify order — from payment through confirmation, low-stock alerting, and order cancellations/refunds — with AI-generated customer emails and built-in duplicate/test-order protection.</p>' +
        '<h4>Solution</h4>' +
        '<p>A single event-driven workflow with three parallel branches off a validated &ldquo;new order&rdquo; check, plus two standalone alert paths for cancellations and refunds:</p>' +
        '<ul>' +
        '<li><strong>Owner alerting &amp; logging:</strong> notifies the store owner of the new order and appends it to a tracking sheet</li>' +
        '<li><strong>AI-generated order confirmation:</strong> an AI Agent (Google Gemini + Chat Memory + Structured Output Parser) drafts a personalized confirmation email in a consistent JSON schema, which Gmail then delivers</li>' +
        '<li><strong>Low-stock detection:</strong> pulls current inventory for every product in the order, flags items below a configured threshold, and routes a Slack alert to the team if anything is running low — or a healthy-stock confirmation if not</li>' +
        '</ul>' +
        '<p>Order cancellations and refunds are handled as fully separate trigger paths, each firing an immediate Slack notification regardless of where in the order lifecycle something changes.</p>' +
        '<h4>Key Engineering Details</h4>' +
        '<ul>' +
        '<li>Duplicate/test-order filtering happens before any downstream action fires, preventing double-alerts or double-emails from Shopify&rsquo;s at-least-once webhook delivery</li>' +
        '<li>AI email generation uses a structured output schema so the Gmail node always receives a predictable subject/body shape, regardless of how the model phrases its response</li>' +
        '<li>Low-stock detection is per-variant and null-safe, checking actual current inventory across every line item rather than a single hardcoded product reference</li>' +
        '</ul>' +
        '<h4>Tech Stack</h4>' +
        '<p>n8n, Shopify Admin API, Google Gemini, Gmail, Google Sheets, Slack.</p>'
    },
    {
      id: "instagram-interactive-dm-workflow",
      title: "Instagram Interactive DM Workflow",
      category: "Sales Ops",
      image: "images/Instagram Interactive DM Workflow.png",
      descriptionHtml:
        '<p>A branching, menu-driven Instagram DM automation that turns a single customer reply into a guided self-service conversation. Instead of a generic response, leads are given clickable options and routed down a personalized path based on what they&rsquo;re actually interested in.</p>' +
        '<h4>How It Works</h4>' +
        '<ol>' +
        '<li>Customer Replied — the workflow triggers when a customer responds to a message or comment on Instagram</li>' +
        '<li>Send Interactive Menu — an interactive messenger card is sent asking &ldquo;How can we help you?&rdquo; with multiple selectable options (Calendar Link, YT Playlist, and other custom options)</li>' +
        '<li>Branch by Selection — the workflow routes down a dedicated path based on which option the customer taps: a Calendar Link path (booking link, with timeout and follow-up branching), a YT Playlist path (same timeout/engagement logic), or a Default Timeout path that routes non-responders into their own nested interactive menu</li>' +
        '<li>Nested Sub-Menus — each top-level branch contains its own interactive messenger card with the same set of options, guiding non-responders deeper into the funnel rather than losing them</li>' +
        '<li>Wait + Deliver — each successful selection is followed by a wait step and a final Instagram DM delivering the relevant content or link</li>' +
        '</ol>' +
        '<h4>Key Features</h4>' +
        '<ul>' +
        '<li>Interactive, button-based Instagram messaging — no free-typing required from the lead</li>' +
        '<li>Multi-level branching logic with dedicated timeout paths at every level</li>' +
        '<li>Re-engagement loop for non-responders instead of a dead end</li>' +
        '<li>Scalable structure — new options or offers can be added as additional branches</li>' +
        '</ul>' +
        '<h4>Business Value</h4>' +
        '<p>Converts passive Instagram engagement into an active, self-guided journey — qualifying and routing leads automatically 24/7 without a human needing to manually manage DMs.</p>' +
        '<h4>Tools Used</h4>' +
        '<p>GoHighLevel (GHL), Instagram Interactive Messenger integration, conditional branching, wait steps.</p>'
    },
    {
      id: "responded-to-database-reactivation",
      title: "Responded to Database Reactivation — AI-Powered Intent Detection",
      category: "Sales Ops",
      image: "images/Responded to Database Reactivation - AI-powered intent detection.png",
      descriptionHtml:
        '<p>An AI-driven reactivation response handler that reads the sentiment/intent of a reply from a previously reactivated lead and instantly routes positive responses straight to the sales team — ensuring re-engaged leads are acted on the moment they show interest, not hours or days later.</p>' +
        '<h4>How It Works</h4>' +
        '<ol>' +
        '<li>Contact Replies to Reactivation Sequence — triggers when a contact responds to an earlier database reactivation campaign</li>' +
        '<li>Exit Reactivation Sequence — immediately removes the contact from the reactivation drip so no further automated messages overlap with the live conversation</li>' +
        '<li>An AI-powered intent-detection step analyzes the reply and classifies it</li>' +
        '<li>Replied Positive — if the AI detects positive intent, sales is notified via email and via SMS/app for immediate visibility</li>' +
        '<li>Replied Negative — if the reply doesn&rsquo;t match positive intent, the contact is routed to a separate, open-ended branch for future handling (e.g. tagging as not interested)</li>' +
        '</ol>' +
        '<h4>Key Features</h4>' +
        '<ul>' +
        '<li>Uses AI intent detection rather than simple keyword matching to interpret free-text replies</li>' +
        '<li>Automatically exits the contact from the reactivation sequence to prevent message overlap</li>' +
        '<li>Dual-channel sales notification (email + SMS/app) for immediate follow-up on hot leads</li>' +
        '<li>Clear branch separation between positive and negative sentiment for streamlined lead triage</li>' +
        '</ul>' +
        '<h4>Business Value</h4>' +
        '<p>Removes the delay and guesswork of manually reading and interpreting reactivation replies — the moment a cold lead shows genuine interest, sales is notified instantly through two channels, maximizing the chance of closing while interest is at its peak.</p>' +
        '<h4>Tools Used</h4>' +
        '<p>GoHighLevel (GHL), AI-powered intent/sentiment detection, conditional branching (AND/NONE logic), multi-channel team notifications.</p>'
    },
    {
      id: "lead-followup-stops-on-reply",
      title: "Lead Follow-Up System That Stops When They Reply",
      category: "Sales Ops",
      image: "images/Lead Follow-up System That Stops When They Reply.png",
      descriptionHtml:
        '<p>An automated multi-touch lead nurture sequence built in GoHighLevel that keeps new leads warm through a series of timed email follow-ups — and intelligently stops the moment a lead engages, preventing awkward or redundant messages after a response has already been received.</p>' +
        '<h4>How It Works</h4>' +
        '<ol>' +
        '<li>Contact Created — triggers automatically the instant a new contact enters the system</li>' +
        '<li>An initial follow-up email is sent right away to open the conversation</li>' +
        '<li>A timed wait gives the lead space to respond before the next touch</li>' +
        '<li>A second follow-up email is sent if no reply has been received</li>' +
        '<li>Another wait period passes before the final touch</li>' +
        '<li>A third and final follow-up email closes out the sequence</li>' +
        '</ol>' +
        '<h4>Key Features</h4>' +
        '<ul>' +
        '<li>Fully automated, no manual sending required</li>' +
        '<li>Built-in reply detection that exits the contact from the sequence as soon as they respond</li>' +
        '<li>Staggered wait periods to avoid overwhelming leads</li>' +
        '<li>Expandable — additional steps or branches can be added at any point</li>' +
        '</ul>' +
        '<h4>Business Value</h4>' +
        '<p>Ensures no lead is forgotten while eliminating the risk of continuing to message someone who has already engaged — protecting response rates and keeping the lead experience personal and relevant.</p>' +
        '<h4>Tools Used</h4>' +
        '<p>GoHighLevel (GHL) Workflow Builder, email automation, trigger-based logic.</p>'
    },
    {
      id: "lead-reactivation-workflow",
      title: "Lead Reactivation Workflow",
      category: "Sales Ops",
      image: "images/Lead Reactivation Workflow.png",
      descriptionHtml:
        '<p>A patient, multi-stage &ldquo;win-back&rdquo; campaign designed to re-engage cold or unresponsive leads sitting dormant in the database. Using a drip-mode structure with built-in response checks, it gradually escalates outreach while automatically stopping the moment a lead re-engages.</p>' +
        '<h4>How It Works</h4>' +
        '<ol>' +
        '<li>Drip Mode — the workflow runs in drip mode, pacing messages out over time rather than firing all at once</li>' +
        '<li>Re-Engagement Email (&ldquo;We Miss You&rdquo;) — the first touch, sent to re-open the conversation</li>' +
        '<li>Wait 2 Days — a cooling-off period before checking for engagement</li>' +
        '<li>Check: Did Lead Respond? — a conditional check determines whether to continue the sequence</li>' +
        '<li>Email 2 – Value Reminder / Offer — if no response, a second email reinforces the value proposition or presents an offer</li>' +
        '<li>Wait 5 Days — a longer wait period before the next check</li>' +
        '<li>Check: Did Lead Respond? — a second conditional checkpoint</li>' +
        '<li>Email 3 – Final Reactivation Attempt — if still no response, a last-chance email closes out the attempt</li>' +
        '</ol>' +
        '<h4>Key Features</h4>' +
        '<ul>' +
        '<li>Drip-mode pacing designed specifically for long-dormant contacts</li>' +
        '<li>Two built-in response checkpoints that allow the sequence to exit early if the lead re-engages</li>' +
        '<li>Escalating wait periods (2 days → 5 days) that respect the lead&rsquo;s inbox without being aggressive</li>' +
        '<li>Clear three-email arc: re-engage → reinforce value → final attempt</li>' +
        '</ul>' +
        '<h4>Business Value</h4>' +
        '<p>Recovers revenue from an otherwise &ldquo;dead&rdquo; segment of the database at very low cost, giving cold leads multiple, well-spaced opportunities to come back into the funnel before being deprioritized.</p>' +
        '<h4>Tools Used</h4>' +
        '<p>GoHighLevel (GHL), drip-mode automation, conditional response checks, wait steps, email sequencing.</p>'
    },
    {
      id: "missed-call-text-back",
      title: "Missed Call Text Back",
      category: "Sales Ops",
      image: "images/Missed Call Text Back.png",
      descriptionHtml:
        '<p>A lightweight, instant-response automation that ensures no missed call ever goes unacknowledged. The moment a call is missed, the system waits briefly and then automatically texts the caller — capturing leads that would otherwise be lost while the team is unavailable.</p>' +
        '<h4>How It Works</h4>' +
        '<ol>' +
        '<li>Trigger: Missed Call Received — fires automatically whenever an inbound call goes unanswered</li>' +
        '<li>Wait 1 Minute – Buffer Before Reply — a short buffer delay before the automated text is sent, avoiding an instant, robotic-feeling response</li>' +
        '<li>Auto-Reply Text — sends a &ldquo;Sorry we missed you…&rdquo; SMS to the caller, opening the conversation and letting them know they&rsquo;ve been heard</li>' +
        '</ol>' +
        '<h4>Key Features</h4>' +
        '<ul>' +
        '<li>Extremely fast response time (under a minute) to missed calls</li>' +
        '<li>Simple, three-step structure that&rsquo;s easy to deploy across any business</li>' +
        '<li>Expandable — the final SMS step can branch into a larger follow-up sequence</li>' +
        '<li>Buffer delay keeps the response feeling natural rather than instantaneous/automated</li>' +
        '</ul>' +
        '<h4>Business Value</h4>' +
        '<p>Missed calls are one of the most common ways businesses lose leads. This workflow closes that gap immediately, keeping the conversation alive and giving the business a second chance to convert the caller — with zero manual effort.</p>' +
        '<h4>Tools Used</h4>' +
        '<p>GoHighLevel (GHL), call trigger automation, wait steps, SMS automation.</p>'
    },
    {
      id: "monday-file-upload-drive-sync",
      title: "monday.com File Upload → Google Drive Auto-Archive & Sync",
      category: "Ops Automation",
      image: "images/monday.com File Upload to Google Drive Auto-Archive & Sync.png",
      descriptionHtml:
        '<p>An n8n automation that automatically archives files uploaded to monday.com items into organized Google Drive folders, prevents duplicate folders and duplicate uploads, and writes the resulting Drive link back onto the board.</p>' +
        '<p>A supplier/procurement board on monday.com where each item can have files attached — invoices, spec sheets, product photos. Files uploaded to monday.com stay locked inside it with no easy way to back them up, browse them in bulk, or share a whole item&rsquo;s files as one link. This automation mirrors every upload into a structured Google Drive archive automatically, in real time.</p>' +
        '<h4>What It Does</h4>' +
        '<ol>' +
        '<li>Detects when a file is uploaded to an item&rsquo;s Files column</li>' +
        '<li>Creates a Google Drive folder for that item — or reuses the existing one if it already has files archived</li>' +
        '<li>Downloads the file from monday.com, which only ever provides a temporary signed URL, never a stored file</li>' +
        '<li>Checks whether that exact file (same name and content, via MD5 checksum) was already uploaded, and skips it if so</li>' +
        '<li>Uploads the file to the correct Drive folder</li>' +
        '<li>Writes a clickable &ldquo;Open Drive Folder&rdquo; link back onto the monday.com item</li>' +
        '</ol>' +
        '<h4>How It&rsquo;s Triggered</h4>' +
        '<p>monday.com has no native &ldquo;file uploaded&rdquo; event — a file upload is treated as a change to the Files column. The trigger is set up via monday.com&rsquo;s built-in Integrations center using the recipe &ldquo;When a column changes, send a webhook,&rdquo; scoped specifically to the Files column so it doesn&rsquo;t fire on unrelated edits like status or text changes. Once connected, monday.com sends a webhook call for every file added — one call per file, even when several are uploaded at once — carrying the file&rsquo;s asset ID and name, never the file itself.</p>' +
        '<h4>Tech Stack</h4>' +
        '<p>n8n, monday.com API (webhook + GraphQL), Google Drive API, MD5 checksum comparison (Code node).</p>'
    },
    {
      id: "new-lead-automation-hvac",
      title: "New Lead Automation (HVAC Service-Based Routing)",
      category: "Sales Ops",
      image: "images/New Lead Automation.png",
      descriptionHtml:
        '<p>A conditional, service-type-aware lead nurture system built for an HVAC business. Every new lead is automatically tagged, added to the sales pipeline, and routed into a customized SMS + email drip sequence based on the specific service they&rsquo;re interested in — Furnace Services, AC Install/Replacement, Air Conditioning Repair, or a general catch-all for anything else.</p>' +
        '<h4>How It Works</h4>' +
        '<ol>' +
        '<li>Trigger: New Lead Form Submitted — fires when a lead fills out an intake form</li>' +
        '<li>Tag Lead: New HVAC Lead — applies an initial tag to the contact</li>' +
        '<li>Create Opportunity in Pipeline — automatically generates a new opportunity/deal record</li>' +
        '<li>Notify Sales Team — alerts staff of the new lead in real time</li>' +
        '<li>A branching condition checks the lead&rsquo;s stated service need and routes them into one of four paths — Furnace Services, AC Install/Replacement, Air Conditioning Repair, or Other Services — each running the same tag → email → 3-touch SMS cadence (immediate, +1 day, +2 more days), tailored to that service&rsquo;s messaging</li>' +
        '</ol>' +
        '<h4>Key Features</h4>' +
        '<ul>' +
        '<li>Smart conditional routing based on the lead&rsquo;s actual stated need</li>' +
        '<li>Consistent 3-touch nurture cadence replicated across every service branch for easy maintenance</li>' +
        '<li>Built-in fallback path so no lead is dropped, even if their answer doesn&rsquo;t match a defined category</li>' +
        '<li>Automatic pipeline and tagging setup at the very start, before any branching occurs</li>' +
        '</ul>' +
        '<h4>Business Value</h4>' +
        '<p>Delivers relevant, service-specific messaging to each lead instead of generic outreach — increasing engagement and conversion by making every follow-up feel tailored to what the customer actually asked for, while keeping the sales team looped in from the first moment.</p>' +
        '<h4>Tools Used</h4>' +
        '<p>GoHighLevel (GHL), conditional branching (AND/NONE logic), pipeline/opportunity automation, tagging, multi-channel (SMS + email) drip sequencing.</p>'
    },
    {
      id: "order-50-reward-auto-coupon",
      title: "Order $50+ Reward – Auto Coupon on Qualifying Purchase",
      category: "E-commerce",
      image: "images/Order $50+ Reward - Auto Coupon on Qualifying.png",
      descriptionHtml:
        '<p>An automated loyalty-reward system that detects qualifying purchases and instantly rewards the customer with a coupon code — no manual review or intervention required — while cleanly routing non-qualifying orders down a separate no-reward path.</p>' +
        '<h4>How It Works</h4>' +
        '<ol>' +
        '<li>Dual Triggers — the workflow starts from either &ldquo;Payment Successful&rdquo; or &ldquo;Order Placed via Store,&rdquo; ensuring it catches the purchase regardless of which event fires first</li>' +
        '<li>Check: Is Order Total $50+? — a conditional filter evaluates the order total against the threshold</li>' +
        '<li>If the order qualifies, the customer is automatically sent a coupon code via email</li>' +
        '<li>If the order doesn&rsquo;t meet the threshold, the contact is routed to a separate branch with no reward action, ready for future expansion (e.g. an upsell nudge)</li>' +
        '</ol>' +
        '<h4>Key Features</h4>' +
        '<ul>' +
        '<li>Dual triggers ensure reliable capture of qualifying purchase events</li>' +
        '<li>Simple, single-condition logic that&rsquo;s easy to adjust (threshold amount, reward type) as needed</li>' +
        '<li>Clean separation between rewarded and non-rewarded customers for reporting and future marketing use</li>' +
        '<li>Fully automated — coupon delivery happens in real time with zero staff involvement</li>' +
        '</ul>' +
        '<h4>Business Value</h4>' +
        '<p>Encourages larger average order values by rewarding customers automatically at the moment they qualify, increasing repeat purchases and customer satisfaction without adding any manual workload to the business.</p>' +
        '<h4>Tools Used</h4>' +
        '<p>GoHighLevel (GHL), conditional logic (AND/NONE branches), e-commerce/order triggers, email automation (coupon delivery).</p>'
    },
    {
      id: "shopify-monday-order-automation",

      title: "Shopify → Monday.com Order Automation",
      category: "E-commerce",
      image: "images/Shopify → Monday.com Order Automation.png",
      descriptionHtml:
        '<p>A secure, production-ready n8n workflow that syncs live Shopify orders into a Monday.com order-tracking board in real time. The moment a customer completes checkout, the order — customer details, line items, total, and status — appears automatically as a new item on a Monday.com board, correctly formatted and ready for the fulfillment team to act on.</p>' +
        '<p>This wasn&rsquo;t built on sample data — it was tested against a live Shopify store using real checkout flows, and includes the security and error-handling considerations a business would need before trusting it with real revenue data.</p>' +
        '<h4>What Was Built</h4>' +
        '<ul>' +
        '<li><strong>Real-time webhook ingestion:</strong> a live n8n webhook subscribed to Shopify&rsquo;s orders/create event, so every new order triggers the workflow instantly</li>' +
        '<li><strong>HMAC signature verification:</strong> every incoming request is cryptographically verified against Shopify&rsquo;s webhook signing secret before any data is processed — a critical safeguard against spoofed requests hitting a public endpoint</li>' +
        '<li><strong>Business logic translation layer:</strong> Shopify&rsquo;s internal order states (paid, voided, pending, refunded) are translated into the business&rsquo;s own Monday.com status labels (New, Processing, Shipped, Cancelled)</li>' +
        '<li><strong>Dynamic multi-item order handling:</strong> orders with any number of line items are combined into a single readable summary rather than requiring fixed item fields</li>' +
        '<li><strong>Type-correct field mapping:</strong> each Monday.com column type receives data in its exact required API format, built by reading the board schema programmatically via GraphQL rather than hardcoding</li>' +
        '</ul>' +
        '<h4>Tech Stack</h4>' +
        '<p>n8n (hosted on n8n Cloud), Shopify Webhooks API, Monday.com GraphQL API, JavaScript (Code nodes for HMAC verification and status mapping), Postman (webhook payload testing).</p>'
    },
    {
      id: "shopify-abandoned-cart-recovery",
      title: "Shopify Abandoned Cart Recovery Automation (n8n)",
      category: "E-commerce",
      image: "images/Shopify Abandoned Cart Recovery Automation (n8n).png",
      descriptionHtml:
        '<p>Built a two-stage abandoned cart recovery workflow in n8n that automatically detects abandoned checkouts, sends a sequence of reactivation emails, and cleans up tracking records the moment a customer converts — without manual intervention at any step.</p>' +
        '<h4>Solution</h4>' +
        '<ol>' +
        '<li>A checkout trigger fires the moment a customer begins checking out, then waits an hour to give them a natural window to complete the purchase on their own</li>' +
        '<li>The checkout&rsquo;s current state is re-fetched — if it already converted, the abandoned-cart record is simply deleted from the tracking sheet</li>' +
        '<li>If still abandoned, a first recovery email is sent and the cart is logged for tracking, followed by a second wait window</li>' +
        '<li>Checkout status is re-verified again — if converted, the record is cleaned up; if still abandoned, a second reactivation email goes out before the now-closed-out record is removed</li>' +
        '</ol>' +
        '<h4>Key Engineering Details</h4>' +
        '<ul>' +
        '<li>Re-verifies checkout status at every stage rather than assuming abandonment persists, preventing recovery emails from reaching customers who already converted between checks</li>' +
        '<li>A two-touch email sequence increases recovery opportunities without over-emailing customers who never come back</li>' +
        '<li>Google Sheets acts as the source of truth for in-progress abandoned carts, with automatic row cleanup on both the &ldquo;recovered&rdquo; and &ldquo;gave up&rdquo; paths</li>' +
        '</ul>' +
        '<h4>Tech Stack</h4>' +
        '<p>n8n, Shopify Admin API, Gmail, Google Sheets.</p>'
    },
    {
      id: "shopify-customer-sync-deduplication",
      title: "Shopify Customer Sync & Deduplication Automation (n8n)",
      category: "E-commerce",
      image: "images/Shopify Customer Sync & Deduplication Automation (n8n).png",
      descriptionHtml:
        '<p>Built a lightweight n8n automation that keeps a Google Sheets customer database in sync with Shopify in real time — automatically detecting whether a new customer record already exists and updating it instead of creating a duplicate.</p>' +
        '<p>Without a dedup check, a customer sync naturally creates duplicate records over time as returning customers trigger new events, place repeat orders, or update their info — making the sheet unreliable for reporting or downstream automations.</p>' +
        '<h4>Solution</h4>' +
        '<ol>' +
        '<li>A Customer Created trigger fires whenever a new customer record appears in Shopify</li>' +
        '<li>A lookup checks whether this customer already exists in the tracking sheet</li>' +
        '<li>New customers get a fresh row appended; existing customers have their row updated instead of duplicated</li>' +
        '</ol>' +
        '<h4>Key Engineering Details</h4>' +
        '<ul>' +
        '<li>A read-before-write pattern prevents duplicate rows entirely, rather than relying on a periodic cleanup job to catch them after the fact</li>' +
        '<li>A single router node keeps the logic simple and easy to extend with additional branches later</li>' +
        '</ul>' +
        '<h4>Tech Stack</h4>' +
        '<p>n8n, Shopify Admin API, Google Sheets.</p>'
    }
  ];

  function stripHtml(html) {
    return html.replace(/<[^>]*>/g, " ");
  }

  function searchText(p) {
    return (p.title + " " + p.category + " " + stripHtml(p.descriptionHtml)).toLowerCase();
  }

  function matchesTerm(term) {
    if (!term) return PROJECTS.slice();
    var t = term.toLowerCase();
    return PROJECTS.filter(function (p) {
      return searchText(p).indexOf(t) !== -1;
    });
  }

  function cardHtml(p) {
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
  }

  function renderInto(containerEl, list) {
    if (!containerEl) return;
    containerEl.innerHTML = list.map(cardHtml).join("");
    containerEl.querySelectorAll("[data-project-id]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openModal(btn.getAttribute("data-project-id"));
      });
    });
  }

  function renderMainGrid() {
    var input = document.getElementById("project-search-input");
    var term = input ? input.value.trim() : "";
    var searching = term.length > 0;
    var matches = matchesTerm(term);
    var grid = document.getElementById("project-grid");
    var countEl = document.getElementById("project-search-count");
    var seeAllWrap = document.getElementById("see-all-projects-wrap");

    renderInto(grid, searching ? matches : matches.slice(0, VISIBLE_LIMIT));

    if (countEl) {
      if (searching) {
        countEl.style.display = "";
        countEl.textContent =
          matches.length + (matches.length === 1 ? " build matches your search" : " builds match your search");
      } else {
        countEl.style.display = "none";
      }
    }

    if (seeAllWrap) {
      seeAllWrap.style.display = !searching && PROJECTS.length > VISIBLE_LIMIT ? "flex" : "none";
    }
  }

  function renderAllModalGrid() {
    var matches = matchesTerm("");
    renderInto(document.getElementById("all-projects-grid"), matches);
    var countEl = document.getElementById("all-projects-count");
    if (countEl) {
      countEl.textContent = matches.length + (matches.length === 1 ? " build" : " builds");
    }
  }

  function updateBodyLock() {
    var pm = document.getElementById("project-modal");
    var am = document.getElementById("all-projects-modal");
    var open = (pm && pm.classList.contains("is-open")) || (am && am.classList.contains("is-open"));
    document.body.classList.toggle("project-modal-locked", !!open);
  }

  function openModal(id) {
    var project = PROJECTS.filter(function (p) {
      return p.id === id;
    })[0];
    if (!project) return;
    var overlay = document.getElementById("project-modal");
    document.getElementById("modal-image").src = project.image;
    document.getElementById("modal-image").alt = project.title;
    document.getElementById("modal-category").textContent = project.category;
    document.getElementById("modal-title").textContent = project.title;
    document.getElementById("modal-description").innerHTML = project.descriptionHtml;
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    updateBodyLock();
    overlay.querySelector(".project-modal-close").focus();
  }

  function closeModal() {
    var overlay = document.getElementById("project-modal");
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    updateBodyLock();
  }

  function openAllProjectsModal() {
    var overlay = document.getElementById("all-projects-modal");
    if (!overlay) return;
    renderAllModalGrid();
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    updateBodyLock();
  }

  function closeAllProjectsModal() {
    var overlay = document.getElementById("all-projects-modal");
    if (!overlay) return;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    updateBodyLock();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var seeAllCountEl = document.getElementById("see-all-projects-count");
    if (seeAllCountEl) seeAllCountEl.textContent = PROJECTS.length;

    renderMainGrid();

    var searchInput = document.getElementById("project-search-input");
    if (searchInput) searchInput.addEventListener("input", renderMainGrid);

    var seeAllBtn = document.getElementById("see-all-projects-btn");
    if (seeAllBtn) seeAllBtn.addEventListener("click", openAllProjectsModal);

    var projectOverlay = document.getElementById("project-modal");
    if (projectOverlay) {
      projectOverlay.addEventListener("click", function (e) {
        if (e.target === projectOverlay || e.target.hasAttribute("data-modal-close")) {
          closeModal();
        }
      });
    }

    var allOverlay = document.getElementById("all-projects-modal");
    if (allOverlay) {
      allOverlay.addEventListener("click", function (e) {
        if (e.target === allOverlay || e.target.hasAttribute("data-modal-close")) {
          closeAllProjectsModal();
        }
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeModal();
        closeAllProjectsModal();
      }
    });
  });
})();
