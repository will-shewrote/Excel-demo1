"use strict";

// ========== MAIN NAVIGATION (Mobile menu, sticky shadow) ==========
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      const icon = this.querySelector("i");
      if (navMenu.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !event.target.closest(".main-nav") &&
      navMenu.classList.contains("active")
    ) {
      navMenu.classList.remove("active");
      if (menuToggle) {
        const icon = menuToggle.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    }
  });

  // Sticky navigation shadow
  const nav = document.querySelector(".main-nav");
  let navTop = nav.offsetTop;

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > navTop) {
      nav.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    } else {
      nav.style.boxShadow = "none";
    }
  });
});

// ========== NAVIGATION INDICATOR (Active + Hover + Dropdown Support) ==========
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");
  const dropdownItems = document.querySelectorAll(".dropdown-item");
  const indicator = document.querySelector(".nav-indicator");
  const navMenu = document.querySelector(".nav-menu");

  if (!indicator || (navLinks.length === 0 && dropdownItems.length === 0))
    return;

  // move indicator to a parent of dropdown item
  function moveIndicatorToLink(link) {
    if (!link || !indicator) return;
    let targetLink = link;
    if (link.classList.contains("dropdown-item")) {
      const parentNavItem = link.closest(".nav-item");
      if (parentNavItem) {
        targetLink = parentNavItem.querySelector(".nav-link");
      }
    }
    if (!targetLink) return;
    const rect = targetLink.getBoundingClientRect();
    const parentRect = navMenu.getBoundingClientRect();
    indicator.style.width = rect.width + "px";
    indicator.style.left = rect.left - parentRect.left + "px";
  }

  // Determine current active parent of dropdown item and active dropdown item based on URL
  let activeParentLink = null;
  let activeDropdownItem = null;
  const currentPath = window.location.pathname;

  // First check dropdown items
  dropdownItems.forEach((item) => {
    const href = item.getAttribute("href");
    if (href === currentPath) {
      activeDropdownItem = item;
      const parentNavItem = item.closest(".nav-item");
      if (parentNavItem) {
        activeParentLink = parentNavItem.querySelector(".nav-link");
      }
    }
  });

  // If no dropdown match, parent of dropdown item (including those without dropdowns)
  if (!activeParentLink) {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      let isMatch = false;
      if (href === currentPath) isMatch = true;
      if (
        (currentPath === "/" || currentPath === "/index.html") &&
        (href === "/" || href === "#" || href === "index.html")
      ) {
        isMatch = true;
      }
      if (isMatch) {
        activeParentLink = link;
      }
    });
  }

  // Fallback to first link if none matches
  if (!activeParentLink && navLinks.length) activeParentLink = navLinks[0];

  // Set active class on top-level links
  navLinks.forEach((link) => link.classList.remove("active"));
  if (activeParentLink) activeParentLink.classList.add("active");

  // Set active class on dropdown items
  dropdownItems.forEach((item) => item.classList.remove("active"));
  if (activeDropdownItem) activeDropdownItem.classList.add("active");

  // Position indicator on active parent link
  if (activeParentLink) moveIndicatorToLink(activeParentLink);

  // ---- Hover effect: move indicator temporarily (works for both parent of dropdown item and dropdown items) ----
  const allClickableLinks = [...navLinks, ...dropdownItems];
  allClickableLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      moveIndicatorToLink(this);
    });
    link.addEventListener("mouseleave", function () {
      if (activeParentLink) moveIndicatorToLink(activeParentLink);
    });
  });

  // parent of dropdown item with dropdown: prevent navigation
  navLinks.forEach((link) => {
    const parentItem = link.closest(".nav-item");
    const hasDropdown =
      parentItem && parentItem.querySelector(".dropdown-menu");
    if (hasDropdown) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
      });
    } else {
      link.addEventListener("click", function (e) {
        // Clear any active dropdown item
        dropdownItems.forEach((item) => item.classList.remove("active"));
        activeDropdownItem = null;
        navLinks.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
        activeParentLink = this;
        moveIndicatorToLink(this);
      });
    }
  });

  // For dropdown items: on click, set parent as active, set this dropdown as active, then navigate
  dropdownItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      // Remove active class from all dropdown items
      dropdownItems.forEach((i) => i.classList.remove("active"));
      this.classList.add("active");
      activeDropdownItem = this;

      const parentNavItem = this.closest(".nav-item");
      const parentTopLink = parentNavItem
        ? parentNavItem.querySelector(".nav-link")
        : null;
      if (parentTopLink) {
        navLinks.forEach((l) => l.classList.remove("active"));
        parentTopLink.classList.add("active");
        activeParentLink = parentTopLink;
        moveIndicatorToLink(parentTopLink);
      }
    });
  });

  // Recalculate indicator on window resize
  window.addEventListener("resize", function () {
    if (activeParentLink) moveIndicatorToLink(activeParentLink);
  });
});

// ========== SCROLL SHRINK EFFECT (adds 'scrolled' class) ==========
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".main-nav");
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// ========== BREAKING NEWS TICKER ========== //
document.addEventListener("DOMContentLoaded", function () {
  const newsItems = [
    {
      text: "⚡ BREAKING: Major climate summit reaches historic agreement",
      link: "https://the-horizon-standard.netlify.app/",
    },
    {
      text: "📱 EXCLUSIVE: iPhone 16 leaks reveal revolutionary design",
      link: "/tech/iphone-16-leaks",
    },
    {
      text: "🏆 Champions League: Semi-final draw announced - Real Madrid vs Bayern",
      link: "/sports/champions-league-draw",
    },
    {
      text: "📈 Bitcoin surges past $80,000 as institutional investors pile in",
      link: "/finance/bitcoin-record-high",
    },
    {
      text: "🌍 New study: Mediterranean diet reduces heart disease by 40%",
      link: "/health/mediterranean-diet-study",
    },
    {
      text: "🎬 Marvel drops surprise trailer for Secret Wars movie",
      link: "/entertainment/marvel-secret-wars",
    },
    {
      text: "⚽ Transfer news: Star player signs record $200M deal",
      link: "/sports/transfer-record",
    },
    {
      text: "🚀 SpaceX announces first human mission to Mars in 2028",
      link: "/science/spacex-mars-mission",
    },
    {
      text: "💻 AI breakthrough: New model can predict weather with 99% accuracy",
      link: "/technology/ai-weather-prediction",
    },
    {
      text: "🎮 PlayStation 6 rumors: Release date and specs leak online",
      link: "/gaming/playstation-6-rumors",
    },
  ];

  const tickerTrack = document.getElementById("tickerTrack");

  function createTickerItems(items) {
    let html = "";
    const doubledItems = [...items, ...items];
    doubledItems.forEach((item) => {
      html += `<a href="${item.link}" class="ticker-item">${item.text}</a>`;
    });
    tickerTrack.innerHTML = html;
  }

  createTickerItems(newsItems);

  const itemCount = newsItems.length;
  const baseSpeed = 40;
  const speed = baseSpeed * (itemCount / 5);
  tickerTrack.style.animation = `scrollTicker ${speed}s linear infinite`;
});

// ========== BACK TO TOP BUTTON ==========
document.addEventListener("DOMContentLoaded", function () {
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  backToTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

// ========== NEWSLETTER POPUP ==========
document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("newsletterPopup");
  const closeBtn = document.querySelector(".popup-close");
  const form = document.getElementById("newsletterForm");

  // Show popup after 5 seconds (only once)
  setTimeout(function () {
    if (!localStorage.getItem("newsletterSeen")) {
      popup.classList.add("show");
      localStorage.setItem("newsletterSeen", "true");

      // Auto hide after 10 seconds
      setTimeout(function () {
        popup.classList.remove("show");
      }, 10000);
    }
  }, 5000);

  // Close popup
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      popup.classList.remove("show");
    });
  }

  // Close popup when clicking outside of it
  document.addEventListener("click", function (event) {
    if (
      popup &&
      !popup.contains(event.target) &&
      !event.target.closest(".newsletter-popup")
    ) {
      popup.classList.remove("show");
    }
  });

  // Handle form submission
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (!email) {
        alert("Please enter a valid email address.");
        return;
      }

      // Here you would send the email to your backend or newsletter API
      console.log("Subscribed email:", email);
      alert("Thank you for subscribing! 🎉");

      // Reset form and close popup
      emailInput.value = "";
      popup.classList.remove("show");
    });
  }
});
// ========== PREMIUM BUSINESS FEATURES (append to script.js) ==========
document.addEventListener("DOMContentLoaded", function () {
  // Only run on Business page
  if (!document.getElementById("marketBar")) return;

  // ---------- DARK MODE TOGGLE ----------
  const darkToggle = document.getElementById("darkModeToggle");
  const body = document.body;
  const icon = darkToggle.querySelector("i");
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    icon.classList.replace("fa-moon", "fa-sun");
  }
  darkToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const isDark = body.classList.contains("dark-mode");
    icon.classList.toggle("fa-moon", !isDark);
    icon.classList.toggle("fa-sun", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // ---------- PAGE TRANSITIONS (NProgress) ----------
  NProgress.configure({ showSpinner: false });
  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (
        link.href &&
        !link.href.startsWith("javascript") &&
        link.href !== window.location.href
      ) {
        NProgress.start();
      }
    });
  });
  window.addEventListener("load", () => NProgress.done());

  // ---------- LIVE MARKET DATA (Simulated) ----------
  const marketIndices = [
    {
      name: "S&P 500",
      value: 5234.67,
      change: 0.8,
      history: generateHistory(110, 0.5),
    },
    {
      name: "NASDAQ",
      value: 18342.1,
      change: 1.2,
      history: generateHistory(120, 0.7),
    },
    {
      name: "DOW",
      value: 42109.33,
      change: -0.3,
      history: generateHistory(105, 0.4),
    },
    {
      name: "BTC/USD",
      value: 81245,
      change: 2.1,
      history: generateHistory(500, 1.5),
    },
  ];
  function generateHistory(base, volatility) {
    let arr = [],
      val = base;
    for (let i = 0; i < 30; i++) {
      val += (Math.random() - 0.5) * volatility;
      arr.push(val);
    }
    return arr;
  }
  const marketBar = document.getElementById("marketBar");
  const sparklineCharts = [];
  function renderMarketBar() {
    let html = "";
    marketIndices.forEach((idx, i) => {
      const changeClass = idx.change >= 0 ? "up" : "down";
      const arrow = idx.change >= 0 ? "fa-caret-up" : "fa-caret-down";
      html += `<div class="market-item">
        <span class="index-name">${idx.name}</span>
        <span class="index-value">${idx.value.toFixed(2)}</span>
        <span class="index-change ${changeClass}"><i class="fas ${arrow}"></i> ${Math.abs(idx.change).toFixed(2)}%</span>
        <canvas id="spark-${i}" class="sparkline-canvas"></canvas>
      </div>`;
    });
    marketBar.innerHTML = html;
    marketIndices.forEach((idx, i) => {
      const canvas = document.getElementById(`spark-${i}`);
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (sparklineCharts[i]) sparklineCharts[i].destroy();
      const gradient = ctx.createLinearGradient(0, 0, 0, 30);
      gradient.addColorStop(0, idx.change >= 0 ? "#27ae60" : "#e74c3c");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      sparklineCharts[i] = new Chart(ctx, {
        type: "line",
        data: {
          labels: idx.history.map((_, j) => j),
          datasets: [
            {
              data: idx.history,
              borderColor: idx.change >= 0 ? "#27ae60" : "#e74c3c",
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.1,
              fill: true,
              backgroundColor: gradient,
            },
          ],
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } },
        },
      });
    });
  }
  function updateMarketData() {
    marketIndices.forEach((idx) => {
      const changeAmt = (Math.random() - 0.5) * 1.5;
      idx.change = parseFloat((idx.change + changeAmt * 0.3).toFixed(2));
      idx.value = parseFloat((idx.value * (1 + changeAmt / 100)).toFixed(2));
      idx.history.shift();
      idx.history.push(idx.value);
    });
    renderMarketBar();
    updateMoversTable();
  }
  renderMarketBar();
  setInterval(updateMarketData, 5000);

  // ---------- SECTOR HEATMAP ----------
  const sectors = [
    { name: "Technology", change: 1.8 },
    { name: "Healthcare", change: -0.5 },
    { name: "Financials", change: 0.3 },
    { name: "Energy", change: -1.2 },
    { name: "Consumer Cycl.", change: 0.7 },
    { name: "Industrials", change: -0.2 },
    { name: "Utilities", change: 0.1 },
    { name: "Real Estate", change: -0.9 },
  ];
  function renderHeatmap() {
    const container = document.getElementById("sectorHeatmap");
    container.innerHTML = sectors
      .map((s) => {
        const cls = s.change >= 0 ? "up" : "down";
        return `<div class="sector-tile ${cls}">${s.name}<span>${s.change > 0 ? "+" : ""}${s.change}%</span></div>`;
      })
      .join("");
  }
  renderHeatmap();

  // ---------- MARKET MOVERS & WATCHLIST ----------
  const moversData = [
    { symbol: "AAPL", price: 187.32, change: 1.2 },
    { symbol: "TSLA", price: 245.67, change: -2.3 },
    { symbol: "NVDA", price: 892.45, change: 3.1 },
    { symbol: "AMZN", price: 178.22, change: 0.5 },
    { symbol: "GOOGL", price: 142.18, change: -0.8 },
  ];
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  function renderMoversTable() {
    const tbody = document.getElementById("moversBody");
    tbody.innerHTML = moversData
      .map((stock, idx) => {
        const changeClass = stock.change >= 0 ? "up" : "down";
        const arrow = stock.change >= 0 ? "fa-caret-up" : "fa-caret-down";
        const isWatched = watchlist.includes(stock.symbol);
        return `<tr class="mover-row" data-symbol="${stock.symbol}">
        <td><strong>${stock.symbol}</strong></td>
        <td>$${stock.price.toFixed(2)}</td>
        <td class="${changeClass}"><i class="fas ${arrow}"></i> ${Math.abs(stock.change).toFixed(2)}%</td>
        <td><canvas id="moverSpark-${idx}" width="80" height="20"></canvas></td>
        <td><button class="watchlist-btn ${isWatched ? "active" : ""}" data-symbol="${stock.symbol}"><i class="far fa-star"></i></button></td>
      </tr>`;
      })
      .join("");
    moversData.forEach((stock, i) => {
      const canvas = document.getElementById(`moverSpark-${i}`);
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const history = Array.from(
        { length: 20 },
        (_, j) => stock.price * (1 + Math.sin(j / 5) * 0.02),
      );
      new Chart(ctx, {
        type: "line",
        data: {
          labels: history.map((_, j) => j),
          datasets: [
            {
              data: history,
              borderColor: stock.change >= 0 ? "#27ae60" : "#e74c3c",
              borderWidth: 2,
              pointRadius: 0,
            },
          ],
        },
        options: {
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { display: false } },
        },
      });
    });
    document.querySelectorAll(".watchlist-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const symbol = btn.dataset.symbol;
        toggleWatchlist(symbol);
        btn.classList.toggle("active");
        renderWatchlist();
      });
    });
  }
  function updateMoversTable() {
    moversData.forEach((stock) => {
      stock.change += (Math.random() - 0.5) * 0.8;
      stock.change = parseFloat(stock.change.toFixed(2));
      stock.price = parseFloat(
        (stock.price * (1 + stock.change / 100)).toFixed(2),
      );
    });
    renderMoversTable();
    // Animate rows
    document.querySelectorAll(".mover-row").forEach((row) => {
      row.classList.add("updated");
      setTimeout(() => row.classList.remove("updated"), 1000);
    });
  }
  function toggleWatchlist(symbol) {
    const idx = watchlist.indexOf(symbol);
    if (idx > -1) watchlist.splice(idx, 1);
    else watchlist.push(symbol);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }
  function renderWatchlist() {
    const container = document.getElementById("watchlistItems");
    const emptyMsg = document.querySelector(".watchlist-empty");
    if (watchlist.length === 0) {
      container.innerHTML = "";
      emptyMsg.style.display = "block";
      return;
    }
    emptyMsg.style.display = "none";
    container.innerHTML = watchlist
      .map((sym) => {
        const stock = moversData.find((s) => s.symbol === sym) || {
          symbol: sym,
          price: "—",
          change: 0,
        };
        const changeClass = stock.change >= 0 ? "up" : "down";
        return `<li><span>${sym}</span> <span class="${changeClass}">$${stock.price} (${stock.change}%)</span></li>`;
      })
      .join("");
  }
  renderMoversTable();
  renderWatchlist();

  // ---------- ECONOMIC CALENDAR ----------
  document.getElementById("ecoCalendar").innerHTML = [
    { name: "Fed Rate Decision", time: "Mar 20, 2:00 PM" },
    { name: "CPI Report", time: "Mar 22, 8:30 AM" },
    { name: "Jobless Claims", time: "Mar 24, 8:30 AM" },
  ]
    .map(
      (e) =>
        `<li><span>${e.name}</span><span class="event-time">${e.time}</span></li>`,
    )
    .join("");

  // ---------- EMBEDDED CHART ----------
  const chartCtx = document.getElementById("sp500Chart")?.getContext("2d");
  if (chartCtx) {
    new Chart(chartCtx, {
      type: "line",
      data: {
        labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
        datasets: [
          {
            label: "S&P 500",
            data: Array.from(
              { length: 30 },
              (_, i) => 5000 + i * 10 + Math.sin(i / 3) * 50,
            ),
            borderColor: "#e74c3c",
            backgroundColor: "rgba(231,76,60,0.1)",
            fill: true,
            tension: 0.2,
          },
        ],
      },
      options: { responsive: true },
    });
  }

  // ---------- LISTEN BUTTON ----------
  document.querySelectorAll(".listen-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text =
        btn.dataset.summary || btn.previousElementSibling?.textContent || "";
      if (text) speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    });
  });

  // ---------- SKELETON LOADING & NEWS FEED ----------
  const feedContainer = document.getElementById("newsFeedContainer");
  const feedItemsData = [
    {
      img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150",
      title: "Walmart Expands Drone Delivery to 6 New Metro Areas",
      time: "1h ago",
      author: "Mark Wilson",
      readTime: "3 min read",
      excerpt:
        "Retailer aims to reach 75% of US households with 30-minute delivery.",
    },
    {
      img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150",
      title: 'JPMorgan CEO Warns of "Uncertain" Economic Outlook',
      time: "2h ago",
      author: "Laura Chen",
      readTime: "4 min read",
      excerpt:
        "Dimon cites geopolitical risks and persistent inflation concerns.",
    },
    {
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150",
      title: "Small Business Optimism Index Rises to 2-Year High",
      time: "3h ago",
      author: "Robert Kim",
      readTime: "2 min read",
      excerpt: "Main Street sentiment improves as inflation eases.",
    },
    {
      img: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=150",
      title: "Gold Prices Retreat from Record Highs as Dollar Strengthens",
      time: "4h ago",
      author: "Anna White",
      readTime: "3 min read",
      excerpt: "Precious metal pulls back after touching $2,400/oz.",
    },
  ];
  let feedPage = 0;
  const itemsPerPage = 3;

  function renderFeedItems(items, append = false) {
    const html = items
      .map(
        (item) => `
      <article class="feed-item glass-card reveal">
        <img src="${item.img}" alt="${item.title}" loading="lazy" />
        <div class="feed-content">
          <h4><a href="#">${item.title}</a></h4>
          <div class="meta"><span><i class="far fa-clock"></i> ${item.time}</span><span><i class="far fa-user"></i> ${item.author}</span><span><i class="far fa-book-open"></i> ${item.readTime}</span></div>
          <p class="feed-excerpt">${item.excerpt}</p>
        </div>
      </article>
    `,
      )
      .join("");
    if (append) feedContainer.insertAdjacentHTML("beforeend", html);
    else feedContainer.innerHTML = html;
  }

  function showSkeleton() {
    feedContainer.innerHTML = Array(3)
      .fill(0)
      .map(
        () => `
      <div class="feed-item skeleton">
        <div class="skeleton-image" style="width:100px;height:100px;"></div>
        <div style="flex:1">
          <div class="skeleton-title skeleton"></div>
          <div class="skeleton-text skeleton"></div>
          <div class="skeleton-text skeleton" style="width:60%"></div>
        </div>
      </div>
    `,
      )
      .join("");
  }

  showSkeleton();
  setTimeout(() => {
    renderFeedItems(feedItemsData.slice(0, itemsPerPage));
    feedPage = 1;
  }, 800);

  document.getElementById("loadMoreBtn").addEventListener("click", function () {
    const start = feedPage * itemsPerPage;
    const moreItems = feedItemsData.slice(start, start + itemsPerPage);
    if (moreItems.length > 0) {
      renderFeedItems(moreItems, true);
      feedPage++;
    } else {
      this.textContent = "No More Articles";
      this.disabled = true;
    }
  });

  // ---------- SIDEBAR FEED (Latest) ----------
  const sidebarFeed = document.getElementById("sidebarFeed");
  if (sidebarFeed) {
    sidebarFeed.innerHTML = feedItemsData
      .slice(0, 3)
      .map(
        (item) => `
      <div class="feed-item" style="padding:0.5rem 0; border-bottom:1px solid var(--border-color);">
        <img src="${item.img}" style="width:60px;height:60px;" loading="lazy" />
        <div><h4 style="font-size:0.9rem;"><a href="#">${item.title}</a></h4><span style="font-size:0.7rem;">${item.time}</span></div>
      </div>
    `,
      )
      .join("");
  }

  // ---------- RECOMMENDED FOR YOU ----------
  const recContainer = document.getElementById("recommendedContainer");
  if (recContainer) {
    const recs = [
      { title: "5 Stocks to Watch This Week", tag: "Investing" },
      { title: "How to Build a Recession-Proof Portfolio", tag: "Finance" },
      { title: "The Rise of AI in Trading", tag: "Tech" },
    ];
    recContainer.innerHTML = recs
      .map(
        (r) => `
      <div class="popular-post-item">
        <div class="popular-post-content">
          <h4 class="popular-post-title"><a href="#">${r.title}</a></h4>
          <div class="popular-post-date"><span class="category-tag ${r.tag.toLowerCase()}">${r.tag}</span></div>
        </div>
      </div>
    `,
      )
      .join("");
  }
});
