(function () {
  "use strict";

  var CATEGORIES = [
    "AI & dashboards",
    "Tableau",
    "Power BI",
    "Data engineering",
    "Jobs"
  ];

  // A chip matches the category, plus tool tags that mean the same thing.
  var CHIP_ALIASES = {
    "AI & dashboards": ["AI & dashboards", "AI"],
    "Tableau": ["Tableau"],
    "Power BI": ["Power BI"],
    "Data engineering": ["Data engineering", "Data eng"],
    "Jobs": ["Jobs"]
  };

  // Tags already expressed by the category badge.
  var IMPLIED_TAGS = {
    "AI & dashboards": { "AI": true },
    "Tableau": { "Tableau": true },
    "Power BI": { "Power BI": true },
    "Data engineering": { "Data eng": true, "Data engineering": true },
    "Jobs": {}
  };

  var TAG_LABELS = {
    "AI": "AI",
    "Tableau": "Tableau",
    "Power BI": "Power BI",
    "Data eng": "Data engineering"
  };

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// YYYY-MM-DD, or YYYY-MM-DD-am / YYYY-MM-DD-pm for the two daily runs.
var ID_RE = /^\d{4}-\d{2}-\d{2}(-[a-z0-9]+)?$/;

  var state = { q: "", cat: "" };
  var digestData = null;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function asset(path) {
    return (document.body.getAttribute("data-page") === "digest" ? "../" : "") + path;
  }

  function loadJson(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error("Could not load " + url + " (" + res.status + ")");
      return res.json();
    });
  }

  function formatDate(iso) {
    var parts = String(iso).split("-");
    if (parts.length < 3 || !/^\d{4}$/.test(parts[0])) return iso;
    var month = MONTHS[Number(parts[1]) - 1] || parts[1];
    var label = month + " " + Number(parts[2]) + ", " + parts[0];
    if (parts[3] === "am") label += " (morning)";
    else if (parts[3] === "pm") label += " (afternoon)";
    else if (parts.length > 3) label += " (" + parts.slice(3).join("-") + ")";
    return label;
  }

  function dateFromPath() {
    var parts = location.pathname.split("/");
    var i;
    for (i = 0; i < parts.length; i++) {
      if (ID_RE.test(parts[i])) return parts[i];
    }
    return "";
  }

  function chipList(items) {
    var chips = [];
    var seen = {};
    var i;
    for (i = 0; i < items.length; i++) {
      var category = items[i].category;
      if (category && !seen[category]) {
        seen[category] = true;
        chips.push(category);
      }
    }
    CATEGORIES.forEach(function (cat) {
      if (seen[cat]) return;
      var n;
      for (n = 0; n < items.length; n++) {
        if (matchesCategory(items[n], cat)) {
          seen[cat] = true;
          chips.push(cat);
          break;
        }
      }
    });
    return chips;
  }

  function tagLabel(tag) {
    return TAG_LABELS[tag] || tag;
  }

  function matchesCategory(item, cat) {
    if (!cat) return true;
    if (item.category === cat) return true;
    var aliases = CHIP_ALIASES[cat] || [cat];
    var tags = item.tags || [];
    var i;
    for (i = 0; i < tags.length; i++) {
      if (aliases.indexOf(tags[i]) !== -1) return true;
    }
    return false;
  }

  function haystack(item) {
    var tags = item.tags || [];
    var labels = [];
    var i;
    for (i = 0; i < tags.length; i++) labels.push(tagLabel(tags[i]));
    return [item.author, item.summary, item.category].concat(tags, labels).join(" ").toLowerCase();
  }

  function matchesQuery(item, q) {
    if (!q) return true;
    var hay = haystack(item);
    var parts = q.toLowerCase().split(/\s+/);
    var i;
    for (i = 0; i < parts.length; i++) {
      if (parts[i] && hay.indexOf(parts[i]) === -1) return false;
    }
    return true;
  }

  function readUrl() {
    var params = new URLSearchParams(location.search);
    state.q = params.get("q") || "";
    state.cat = params.get("cat") || "";
  }

  function writeUrl() {
    var params = new URLSearchParams();
    if (state.q) params.set("q", state.q);
    if (state.cat) params.set("cat", state.cat);
    var qs = params.toString();
    var next = location.pathname + (qs ? "?" + qs : "") + location.hash;
    var current = location.pathname + location.search + location.hash;
    if (next !== current) history.replaceState(null, "", next);
  }

  function setPressed() {
    var buttons = document.querySelectorAll(".chip");
    var i;
    for (i = 0; i < buttons.length; i++) {
      var cat = buttons[i].getAttribute("data-cat") || "";
      buttons[i].setAttribute("aria-pressed", cat === state.cat ? "true" : "false");
    }
  }

  function imageAlt(item) {
    var who = item.author || "LinkedIn item";
    var summary = item.summary || "";
    var title = summary.split(". ")[0];
    if (title && !/[.!?]$/.test(title)) title += ".";
    return title ? who + ". " + title : who;
  }

  function extraTags(item) {
    var implied = IMPLIED_TAGS[item.category] || {};
    var tags = item.tags || [];
    var extra = [];
    var seen = {};
    var i;
    for (i = 0; i < tags.length; i++) {
      var tag = tags[i];
      if (implied[tag] || seen[tag]) continue;
      seen[tag] = true;
      extra.push(tag);
    }
    return extra;
  }

  function renderCard(item) {
    var card = el("article", "card");
    var top = el("div", "card-top");
    top.appendChild(el("h2", "author", item.author || "Untitled"));

    var badges = el("ul", "badges");
    var category = el("li", "badge");
    category.appendChild(el("span", "sr-only", "Category: "));
    category.appendChild(document.createTextNode(item.category || ""));
    badges.appendChild(category);

    extraTags(item).forEach(function (tag) {
      var li = el("li", "badge badge-tag");
      li.appendChild(el("span", "sr-only", "Also tagged: "));
      li.appendChild(document.createTextNode(tagLabel(tag)));
      badges.appendChild(li);
    });

    top.appendChild(badges);
    card.appendChild(top);

    if (item.image) {
      var frame = el("div", "preview-frame");
      var img = el("img", "preview");
      img.src = asset(item.image);
      img.alt = imageAlt(item);
      img.loading = "lazy";
      img.decoding = "async";
      frame.appendChild(img);
      card.appendChild(frame);
    }

    card.appendChild(el("p", "summary", item.summary || ""));

    if (item.url) {
      var link = el("a", "link");
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.appendChild(document.createTextNode("View on LinkedIn"));
      link.appendChild(el("span", null, " "));
      var arrow = el("span", null, "↗");
      arrow.setAttribute("aria-hidden", "true");
      link.appendChild(arrow);
      link.appendChild(el("span", "sr-only", " (opens in a new tab)"));
      card.appendChild(link);
    }
    return card;
  }

  function apply() {
    var results = document.getElementById("results");
    var countEl = document.getElementById("count");
    if (!digestData || !results) return;

    var items = digestData.items || [];
    var shown = [];
    var i;
    for (i = 0; i < items.length; i++) {
      if (matchesCategory(items[i], state.cat) && matchesQuery(items[i], state.q)) {
        shown.push(items[i]);
      }
    }

    setPressed();
    clear(results);

    if (!shown.length) {
      var message = state.q && state.cat
        ? "Nothing matches that search and filter."
        : state.q
          ? "Nothing matches that search."
          : "Nothing matches that filter.";
      results.appendChild(el("p", "empty", message));
    } else {
      var noted = {};
      var notes = digestData.categoryNotes || {};
      shown.forEach(function (item) {
        var note = item.category && notes[item.category];
        if (note && !noted[item.category]) {
          noted[item.category] = true;
          results.appendChild(el("p", "note", item.category + ": " + note));
        }
        results.appendChild(renderCard(item));
      });
    }

    if (countEl) {
      var total = items.length;
      if (!state.q && !state.cat) {
        countEl.textContent = total === 1 ? "1 post" : total + " posts";
      } else {
        var label = "Showing " + shown.length + " of " + total;
        if (state.cat) label += " · " + state.cat;
        if (state.q) label += " · \"" + state.q + "\"";
        countEl.textContent = label;
      }
    }
  }

  function buildChips(cats) {
    var chips = document.getElementById("chips");
    if (!chips) return;
    clear(chips);
    var all = el("button", "chip", "All");
    all.type = "button";
    all.setAttribute("data-cat", "");
    all.setAttribute("aria-pressed", "true");
    chips.appendChild(all);
    (cats || CATEGORIES).forEach(function (cat) {
      var button = el("button", "chip", cat);
      button.type = "button";
      button.setAttribute("data-cat", cat);
      button.setAttribute("aria-pressed", "false");
      chips.appendChild(button);
    });
    chips.addEventListener("click", function (event) {
      var button = event.target.closest("button");
      if (!button || !chips.contains(button)) return;
      var cat = button.getAttribute("data-cat") || "";
      state.cat = state.cat === cat && cat !== "" ? "" : cat;
      writeUrl();
      apply();
    });
  }

  function showError(message) {
    var results = document.getElementById("results");
    var countEl = document.getElementById("count");
    if (countEl) countEl.textContent = "";
    if (!results) return;
    clear(results);
    results.appendChild(el("p", "error", message));
  }

  function renderDigest() {
    readUrl();

    var input = document.getElementById("q");
    var form = document.getElementById("search-form");
    if (input) {
      input.value = state.q;
      input.addEventListener("input", function () {
        state.q = input.value.trim();
        writeUrl();
        apply();
      });
    }
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
      });
    }

    var date = dateFromPath();
    if (!date) {
      showError("The address needs a date, like /linkedin-digest/2026-10-21/ or /linkedin-digest/2026-10-22-am/.");
      return;
    }

    loadJson(asset("data/" + date + ".json")).then(function (data) {
      digestData = data;
      buildChips(chipList(data.items || []));
      var title = document.getElementById("title");
      var source = document.getElementById("source");
      var theme = document.getElementById("theme");
      if (title) title.textContent = data.title || ("Digest, " + formatDate(date));
      document.title = (data.title || "LinkedIn digest") + " · LinkedIn digests";
      if (source) source.textContent = data.source || "";
      if (theme) {
        if (data.theme) theme.textContent = "Theme: " + data.theme;
        else theme.hidden = true;
      }
      apply();
    }).catch(function (err) {
      console.error(err);
      showError("This digest could not be loaded.");
    });
  }

  function renderIndex() {
    var results = document.getElementById("results");
    var countEl = document.getElementById("count");
    loadJson(asset("data/manifest.json")).then(function (manifest) {
      var entries = (manifest && manifest.digests) || [];
      var dated = [];
      var i;
      for (i = 0; i < entries.length; i++) {
        if (entries[i] && ID_RE.test(entries[i].date)) dated.push(entries[i].date);
      }
      if (!dated.length) {
        if (countEl) countEl.textContent = "No digests yet.";
        return;
      }
      return Promise.all(dated.map(function (date) {
        return loadJson(asset("data/" + date + ".json")).then(function (data) {
          return { date: date, data: data };
        }).catch(function () {
          return { date: date, data: null };
        });
      })).then(function (rows) {
        rows.sort(function (a, b) {
          return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
        });
        clear(results);
        rows.forEach(function (row) {
          var link = el("a", "digest-link");
          link.href = row.date + "/";
          var heading = el("h2", null, (row.data && row.data.label) || formatDate(row.date));
          link.appendChild(heading);
          if (!row.data) {
            link.appendChild(el("p", "theme", "This digest could not be loaded."));
          } else if (row.data.theme) {
            link.appendChild(el("p", "theme", "Theme: " + row.data.theme));
          } else if (row.data.source) {
            link.appendChild(el("p", "theme", row.data.source));
          }
          var n = row.data && row.data.items ? row.data.items.length : 0;
          if (n) link.appendChild(el("p", "meta", n === 1 ? "1 post" : n + " posts"));
          results.appendChild(link);
        });
        if (countEl) {
          countEl.textContent = rows.length === 1 ? "1 digest" : rows.length + " digests";
        }
      });
    }).catch(function (err) {
      console.error(err);
      showError("The digest list could not be loaded.");
    });
  }

  if (document.body.getAttribute("data-page") === "index") renderIndex();
  else renderDigest();
})();
