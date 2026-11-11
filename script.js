// University of Karachi project website - script.js
document.addEventListener("DOMContentLoaded", function () {
  // 1. Mobile menu toggle
  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open);
    });
  }
  // 2. Header shadow and back-to-top button on scroll
  var header = document.getElementById("siteHeader");
  var toTop = document.getElementById("toTop");
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 40);
    if (toTop) toTop.classList.toggle("show", y > 500);
  });
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  // 3. Animated counters (home page)
  var counters = document.querySelectorAll(".num[data-count]");
  function runCounter(el) {
    var target = parseInt(el.dataset.count, 10);
    var suffix = el.dataset.suffix || "";
    var steps = 60, step = 0;
    var timer = setInterval(function () {
      step++;
      el.textContent = Math.round((target * step) / steps) + (step === steps ? suffix : "");
      if (step >= steps) clearInterval(timer);
    }, 25);
  }
  if (counters.length) {
    var seen = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { seen.observe(c); });
  }
  // 4. FAQ accordion (admissions page)
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var answer = btn.nextElementSibling;
      var isOpen = answer.classList.toggle("open");
      btn.querySelector("span").textContent = isOpen ? "-" : "+";
    });
  });
  // 5. Faculty filter buttons (faculties page)
  var filters = document.querySelectorAll(".filter");
  var cards = document.querySelectorAll(".card[data-cat]");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filters.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var type = btn.dataset.filter;
      cards.forEach(function (card) {
        card.classList.toggle("hide", type !== "all" && card.dataset.cat !== type);
      });
    });
  });
  // 6. Contact form validation (contact page)
  var form = document.getElementById("contactForm");
  if (form) {
    var msg = document.getElementById("formMsg");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = ["name", "email", "message"].map(function (id) { return document.getElementById(id); });
      var valid = true;
      fields.forEach(function (f) {
        var bad = f.value.trim() === "";
        f.classList.toggle("error", bad);
        if (bad) valid = false;
      });
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields[1].value.trim());
      if (!valid) {
        msg.textContent = "Please fill in all fields.";
        msg.className = "form-msg err";
      } else if (!emailOk) {
        fields[1].classList.add("error");
        msg.textContent = "Please enter a valid email address.";
        msg.className = "form-msg err";
      } else {
        msg.textContent = "Thank you! Your message has been received.";
        msg.className = "form-msg ok";
        form.reset();
      }
    });
  }
});
