// University of Karachi project website - script.js
var $ = function (id) {
  return document.getElementById(id);
};

// 1. Apply page sirf login ke baad khulega
if (
  document.querySelector(".apply-form") &&
  !localStorage.getItem("uokSession")
) {
  window.location.href = "login.html?next=apply.html";
}

document.addEventListener("DOMContentLoaded", function () {
  // 2. Header shadow and back-to-top button
  window.addEventListener("scroll", function () {
    $("siteHeader").classList.toggle("scrolled", window.scrollY > 40);
    $("toTop").classList.toggle("show", window.scrollY > 500);
  });
  $("toTop").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 3. Animated counters (home page)
  document.querySelectorAll(".num[data-count]").forEach(function (el) {
    var target = parseInt(el.dataset.count, 10),
      step = 0;
    var timer = setInterval(function () {
      step++;
      el.textContent =
        Math.round((target * step) / 50) +
        (step === 50 ? el.dataset.suffix || "" : "");
      if (step === 50) clearInterval(timer);
    }, 30);
  });

  // 4. FAQ (admissions page)
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.nextElementSibling.classList.toggle("open");
      btn.querySelector("span").textContent = open ? "-" : "+";
    });
  });

  // 5. Faculty filter (faculties page)
  var filters = document.querySelectorAll(".filter");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filters.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      document.querySelectorAll(".card[data-cat]").forEach(function (card) {
        card.classList.toggle(
          "hide",
          btn.dataset.filter !== "all" &&
            card.dataset.cat !== btn.dataset.filter,
        );
      });
    });
  });

  // 6. Contact form (contact page)
  if ($("contactForm")) {
    $("contactForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = $("formMsg");
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("email").value.trim());
      if (!$("name").value.trim() || !$("message").value.trim()) {
        msg.textContent = "Please fill in all fields.";
        msg.className = "form-msg err";
      } else if (!emailOk) {
        msg.textContent = "Please enter a valid email address.";
        msg.className = "form-msg err";
      } else {
        msg.textContent = "Thank you! Your message has been received.";
        msg.className = "form-msg ok";
        this.reset();
      }
    });
  }

  // 7. Sign in / Sign up (login page)
  if ($("signupForm")) {
    var users = JSON.parse(localStorage.getItem("uokUsers") || "[]");
    var say = function (id, text, type) {
      $(id).textContent = text;
      $(id).className = "form-msg " + type;
    };
    var showTab = function (signin) {
      $("tabSignin").classList.toggle("active", signin);
      $("tabSignup").classList.toggle("active", !signin);
      $("signinForm").classList.toggle("hidden", !signin);
      $("signupForm").classList.toggle("hidden", signin);
    };
    $("tabSignin").onclick = function () {
      showTab(true);
    };
    $("tabSignup").onclick = function () {
      showTab(false);
    };

    document.querySelectorAll(".show-btn").forEach(function (btn) {
      btn.onclick = function () {
        var input = $(btn.dataset.target);
        input.type = input.type === "password" ? "text" : "password";
        btn.textContent = input.type === "password" ? "Show" : "Hide";
      };
    });

    $("signupForm").onsubmit = function (e) {
      e.preventDefault();
      var name = $("suName").value.trim(),
        email = $("suEmail").value.trim().toLowerCase();
      var pass = $("suPass").value;
      if (!name || !email || !pass)
        return say("suMsg", "Please fill in all fields.", "err");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return say("suMsg", "Please enter a valid email.", "err");
      if (pass.length < 6)
        return say("suMsg", "Password must be at least 6 characters.", "err");
      if (pass !== $("suPass2").value)
        return say("suMsg", "Passwords do not match.", "err");
      if (
        users.some(function (u) {
          return u.email === email;
        })
      )
        return say("suMsg", "Email already registered. Please sign in.", "err");
      users.push({ name: name, email: email, pass: pass });
      localStorage.setItem("uokUsers", JSON.stringify(users));
      this.reset();
      say("suMsg", "", "");
      showTab(true);
      say("siMsg", "Account created. Please sign in.", "ok");
    };

    $("signinForm").onsubmit = function (e) {
      e.preventDefault();
      var email = $("siEmail").value.trim().toLowerCase(),
        pass = $("siPass").value;
      var user = users.find(function (u) {
        return u.email === email && u.pass === pass;
      });
      if (!user) return say("siMsg", "Wrong email or password.", "err");
      localStorage.setItem("uokSession", user.name);
      say("siMsg", "Welcome, " + user.name + "! Redirecting...", "ok");
      var next = new URLSearchParams(window.location.search).get("next");
      setTimeout(function () {
        window.location.href =
          next === "apply.html" ? "apply.html" : "index.html";
      }, 1000);
    };
  }
});
