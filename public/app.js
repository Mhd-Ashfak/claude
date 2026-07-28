/* ============================================================================
   app.js  —  shared frontend logic for ALL pages of OMERO GYM.
   Talks to the backend API (Node/Express + MySQL). The current page is
   detected from <body data-page="...">.
   ----------------------------------------------------------------------------
   Auth: a JWT token + user are kept in localStorage after login/register and
   sent on every API call. Run the site via the Node server (npm start), NOT
   Live Server, because the pages now need the API.
   ============================================================================ */
(function () {
  "use strict";

  /* category labels used to group the session catalog (data comes from the API) */
  var CATEGORIES = [
    { id: "floor",    label: "General Gym Floor Access" },
    { id: "classes",  label: "Group Fitness Classes" },
    { id: "personal", label: "Personal Training (1-on-1)" }
  ];
  var TIME_BLOCKS = ["06:00 AM", "08:00 AM", "10:00 AM", "04:00 PM", "05:00 PM", "07:00 PM"];

  /* ------------------------ storage (token + user) ------------------------ */
  var _mem = {};
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return (k in _mem) ? _mem[k] : null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { _mem[k] = v; } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { delete _mem[k]; } }
  };
  function token() { return store.get("omero.token"); }
  function getUser() { try { return JSON.parse(store.get("omero.user")); } catch (e) { return null; } }
  function saveAuth(data) { store.set("omero.token", data.token); store.set("omero.user", JSON.stringify(data.user)); }
  function clearAuth() { store.del("omero.token"); store.del("omero.user"); }

  /* ------------------------------ helpers ------------------------------ */
  function el(id) { return document.getElementById(id); }
  function LKR(n) { return "LKR " + Number(n).toLocaleString("en-US"); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function today() { return new Date().toISOString().split("T")[0]; }
  function param(name) { return new URLSearchParams(location.search).get(name); }

  function icon(name, size) {
    size = size || 16;
    var P = {
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
      calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
      timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
      x: '<path d="M18 6 6 18"/><path d="M6 6l12 12"/>',
      rotate: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'
    };
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (P[name] || "") + "</svg>";
  }

  /* ------------------------------ API layer ------------------------------ */
  function api(pathStr, opts) {
    opts = opts || {};
    var headers = { "Content-Type": "application/json" };
    var t = token();
    if (t) headers.Authorization = "Bearer " + t;
    return fetch(pathStr, {
      method: opts.method || "GET",
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (res) {
      return res.json().catch(function () { return null; }).then(function (data) {
        if (res.status === 401) {
          clearAuth();
          if (!/login\.html|register\.html/.test(location.pathname)) location.href = "login.html";
          throw new Error((data && data.error) || "Not authenticated");
        }
        if (!res.ok) throw new Error((data && data.error) || "Request failed");
        return data;
      });
    });
  }

  /* small inline error banner for the auth forms */
  function showError(form, msg) {
    var box = form.querySelector(".form-error");
    if (!box) {
      box = document.createElement("p");
      box.className = "form-error";
      box.style.cssText = "color:#f04452;font-size:13px;margin-top:12px;text-align:center";
      form.appendChild(box);
    }
    box.textContent = msg;
  }

  /* ---------------------- shared chrome (all pages) ---------------------- */
  function injectBackground() {
    var words = ["DISCIPLINE", "TODAY", "STRENGTH", "TOMORROW"].map(function (w) {
      return '<span class="' + (w === "TOMORROW" ? "red" : "") + '">' + w + "</span>";
    }).join("");
    var bg = document.createElement("div");
    bg.className = "bg";
    bg.innerHTML = '<div class="bg-glow"></div><div class="bg-grid"></div>' +
      '<div class="watermark left">' + words + "</div><div class=\"watermark right\">" + words + "</div>";
    document.body.insertBefore(bg, document.body.firstChild);
  }

  function initChrome() {
    var user = getUser();
    var name = (user && user.name) ? user.name : "Dedicated Athlete";
    Array.prototype.forEach.call(document.querySelectorAll(".js-hello"), function (n) { n.textContent = name; });
    Array.prototype.forEach.call(document.querySelectorAll(".js-year"), function (n) { n.textContent = new Date().getFullYear(); });

    var toggle = el("navToggle"), menu = el("mobileMenu");
    if (toggle && menu) toggle.addEventListener("click", function () { menu.classList.toggle("open"); });

    Array.prototype.forEach.call(document.querySelectorAll('[data-action="logout"]'), function (b) {
      b.addEventListener("click", function () { clearAuth(); location.href = "login.html"; });
    });
  }

  /* redirect to login if the page needs auth and there's no token */
  function requireAuth() {
    if (!token()) { location.href = "login.html"; return false; }
    return true;
  }

  /* ------------------------------ LOGIN ------------------------------ */
  function initLogin() {
    var form = el("loginForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      api("/api/auth/login", { method: "POST", body: { email: el("li-email").value, password: el("li-pass").value } })
        .then(function (data) { saveAuth(data); location.href = "classes.html"; })
        .catch(function (err) { showError(form, err.message); });
    });
  }

  /* ---------------------------- REGISTER ---------------------------- */
  function initRegister() {
    var form = el("registerForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      api("/api/auth/register", {
        method: "POST",
        body: { name: el("rg-name").value.trim(), email: el("rg-email").value, phone: el("rg-phone").value, password: el("rg-pass").value }
      })
        .then(function (data) { saveAuth(data); location.href = "classes.html"; })
        .catch(function (err) { showError(form, err.message); });
    });
  }

  /* ---------------------------- CLASSES ---------------------------- */
  function initClasses() {
    if (!requireAuth()) return;
    var filtersEl = el("filters"), sectionsEl = el("sessionSections");
    if (!filtersEl || !sectionsEl) return;
    var filter = "all";
    var sessions = [];

    function card(s) {
      return '<article class="card s-card">' +
        "<h3>" + esc(s.title) + "</h3><p>" + esc(s.description) + "</p>" +
        '<div class="s-foot"><div>' +
        '<div class="price">' + LKR(s.price) + "</div>" +
        '<div class="meta">' + icon("clock", 13) + " " + s.duration + " mins</div></div>" +
        '<button class="btn btn-primary" data-book="' + s.id + '">Book Slot ' + icon("arrow", 15) + "</button>" +
        "</div></article>";
    }
    function renderFilters() {
      var pills = ['<button class="pill ' + (filter === "all" ? "active" : "") + '" data-filter="all">All</button>'];
      CATEGORIES.forEach(function (c) {
        var label = c.id === "floor" ? "Gym Floor Access" : c.id === "classes" ? "Group Fitness Classes" : "Personal Training";
        pills.push('<button class="pill ' + (filter === c.id ? "active" : "") + '" data-filter="' + c.id + '">' + label + "</button>");
      });
      filtersEl.innerHTML = pills.join("");
    }
    function renderSections() {
      var cats = filter === "all" ? CATEGORIES : CATEGORIES.filter(function (c) { return c.id === filter; });
      sectionsEl.innerHTML = cats.map(function (cat) {
        var items = sessions.filter(function (s) { return s.category === cat.id; });
        if (!items.length) return "";
        return '<section class="section"><div class="section-head"><span class="dot"></span>' +
          "<h2>" + cat.label + '</h2><span class="rule"></span></div>' +
          '<div class="grid2">' + items.map(card).join("") + "</div></section>";
      }).join("");
    }

    filtersEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-filter]"); if (!b) return;
      filter = b.getAttribute("data-filter"); renderFilters(); renderSections();
    });
    sectionsEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-book]"); if (!b) return;
      location.href = "book.html?session=" + encodeURIComponent(b.getAttribute("data-book"));
    });

    renderFilters();
    sectionsEl.innerHTML = '<p style="color:rgba(255,255,255,.4);text-align:center;margin-top:40px">Loading sessions…</p>';
    api("/api/sessions").then(function (data) { sessions = data; renderSections(); })
      .catch(function (err) { sectionsEl.innerHTML = '<p style="color:#f04452;text-align:center;margin-top:40px">' + esc(err.message) + "</p>"; });
  }

  /* ------------------------------ BOOK ------------------------------ */
  function initBook() {
    if (!requireAuth()) return;
    var sel = el("bk-session"), dateEl = el("bk-date"), blocksEl = el("blocks");
    var stepperEl = el("stepper"), summaryEl = el("summary"), confirmBtn = el("confirmBtn");
    if (!sel) return;

    var sessions = [];
    var state = { sessionId: param("session") || "", date: "", time: "" };
    dateEl.min = today();

    function getSession(id) { for (var i = 0; i < sessions.length; i++) { if (sessions[i].id === id) return sessions[i]; } return null; }
    var STEPS = ["Pick a date", "Choose a time block", "Confirm"];
    function stepIndex() { return !state.date ? 0 : !state.time ? 1 : 2; }

    function renderStepper() {
      var idx = stepIndex();
      stepperEl.innerHTML = STEPS.map(function (label, i) {
        var cls = i === idx ? "current" : i < idx ? "done" : "";
        return '<span class="pill step ' + cls + '"><b>' + (i + 1) + "</b> " + label + "</span>";
      }).join("");
    }
    function renderBlocks() {
      if (!state.date) {
        blocksEl.innerHTML = '<div class="blocks-empty">' + icon("calendar", 26) + "<p>Select a date above to reveal live time-block availability.</p></div>";
        return;
      }
      blocksEl.innerHTML = '<div class="blocks">' + TIME_BLOCKS.map(function (t) {
        return '<button class="block ' + (state.time === t ? "active" : "") + '" data-time="' + t + '">' + t + "</button>";
      }).join("") + "</div>";
    }
    function renderSummary() {
      var s = getSession(state.sessionId);
      var sched = (state.date && state.time) ? '<div class="sched"><span>Scheduled:</span> ' + state.date + " · " + state.time + "</div>" : "";
      summaryEl.innerHTML =
        '<p class="sum-label">Selected Workout / Class</p>' +
        '<p class="sum-title">' + (s ? esc(s.title) : "Please pick a session card") + "</p>" +
        '<div class="sum-grid">' +
        '<div><p class="sum-label">' + icon("timer", 14) + " Duration</p><p class=\"sum-val\">" + (s ? s.duration + " mins" : "—") + "</p></div>" +
        '<div><p class="sum-label">' + icon("clock", 14) + ' Session Cost</p><p class="sum-val red">' + (s ? LKR(s.price) : "—") + "</p></div>" +
        "</div>" + sched;
    }
    function refreshConfirm() { confirmBtn.disabled = !(getSession(state.sessionId) && state.date && state.time); }
    function renderAll() { renderStepper(); renderBlocks(); renderSummary(); refreshConfirm(); }

    dateEl.addEventListener("change", function (e) { state.date = e.target.value; state.time = ""; renderAll(); });
    blocksEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-time]"); if (!b) return;
      state.time = b.getAttribute("data-time"); renderAll();
    });
    sel.addEventListener("change", function (e) { state.sessionId = e.target.value; renderAll(); });
    confirmBtn.addEventListener("click", function () {
      if (!(getSession(state.sessionId) && state.date && state.time)) return;
      confirmBtn.disabled = true;
      api("/api/bookings", { method: "POST", body: { sessionId: state.sessionId, date: state.date, time: state.time } })
        .then(function () { location.href = "workouts.html"; })
        .catch(function (err) { alert(err.message); confirmBtn.disabled = false; });
    });

    renderAll();
    api("/api/sessions").then(function (data) {
      sessions = data;
      sel.innerHTML = '<option value="">Select a session…</option>' + sessions.map(function (x) {
        return '<option value="' + x.id + '"' + (x.id === state.sessionId ? " selected" : "") + ">" + esc(x.title) + " — " + LKR(x.price) + "</option>";
      }).join("");
      renderAll();
    });
  }

  /* ---------------------------- WORKOUTS ---------------------------- */
  function initWorkouts() {
    if (!requireAuth()) return;
    var upEl = el("upcoming"), pastEl = el("past");
    if (!upEl || !pastEl) return;

    function rowsTable(list, headers, actionCol) {
      return '<div class="table-wrap"><table><thead><tr>' +
        headers.map(function (h) { return "<th" + (h.right ? ' class="right"' : "") + ">" + h.label + "</th>"; }).join("") +
        "</tr></thead><tbody>" + list.map(function (b) {
          var badge = b._past ? '<span class="badge attended">Attended</span>' : '<span class="badge confirmed">Confirmed</span>';
          var action = b._past
            ? '<a class="btn btn-ghost btn-sm" href="book.html?session=' + encodeURIComponent(b.sessionId) + '">' + icon("rotate", 13) + " Book Again</a>"
            : '<button class="btn btn-ghost btn-sm" data-cancel="' + b.id + '">' + icon("x", 13) + " Cancel</button>";
          return "<tr>" +
            '<td class="id">' + b.id + "</td>" +
            '<td class="cell-title">' + esc(b.title) + "</td>" +
            '<td class="cell-muted">' + b.date + " · " + b.time + "</td>" +
            '<td class="cell-muted">' + LKR(b.price) + "</td>" +
            "<td>" + badge + "</td>" +
            '<td class="right">' + action + "</td>" +
            "</tr>";
        }).join("") + "</tbody></table></div>";
    }

    function render(bookings) {
      var t = today();
      var upcoming = bookings.filter(function (b) { return b.date >= t; });
      var past = bookings.filter(function (b) { return b.date < t; }).map(function (b) { b._past = true; return b; });

      upEl.innerHTML = upcoming.length
        ? rowsTable(upcoming, [{ label: "Reservation ID" }, { label: "Class / Session" }, { label: "Scheduled Date &amp; Time" }, { label: "Cost" }, { label: "Status" }, { label: "Actions", right: true }])
        : '<div class="empty"><p>No upcoming slots yet.</p><a class="btn btn-primary" href="book.html">Book a Slot</a></div>';

      pastEl.innerHTML = past.length
        ? rowsTable(past, [{ label: "Reservation ID" }, { label: "Session" }, { label: "Date &amp; Time" }, { label: "Cost" }, { label: "Status" }, { label: "Shortcut", right: true }])
        : '<div class="empty"><p>No past sessions logged yet.</p></div>';
    }

    function load() {
      upEl.innerHTML = '<p style="color:rgba(255,255,255,.4)">Loading…</p>';
      pastEl.innerHTML = "";
      api("/api/bookings").then(render).catch(function (err) {
        upEl.innerHTML = '<p style="color:#f04452">' + esc(err.message) + "</p>";
      });
    }

    upEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cancel]"); if (!b) return;
      api("/api/bookings/" + encodeURIComponent(b.getAttribute("data-cancel")), { method: "DELETE" }).then(load);
    });

    load();
  }

  /* ------------------------------ BOOT ------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    injectBackground();
    initChrome();
    var page = document.body.getAttribute("data-page");
    if (page === "login") initLogin();
    else if (page === "register") initRegister();
    else if (page === "classes") initClasses();
    else if (page === "book") initBook();
    else if (page === "workouts") initWorkouts();
  });
})();
