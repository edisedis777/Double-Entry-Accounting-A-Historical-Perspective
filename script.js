// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get all navigation buttons and content sections
  const navButtons = document.querySelectorAll("#timeline-nav button");
  const contentSections = document.querySelectorAll(".content-section");

  // --- Navigation Logic ---
  navButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const sectionId = this.getAttribute("data-section");
      showSection(sectionId);
    });
  });

  // --- Explanation Toggle Logic ---
  const explainButtons = document.querySelectorAll(".explain-btn");
  explainButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const explanationId = this.getAttribute("data-explanation");
      if (explanationId) {
        toggleExplanation(explanationId);
      }
    });
  });

  // --- T-Account Setup ---
  setupTAccount();

  // --- Practice Section Dynamic Update Logic ---
  const initialCapitalInput = document.getElementById("initialCapitalInput");
  const inventoryCostInput = document.getElementById("inventoryCostInput");
  const salesPriceInput = document.getElementById("salesPriceInput");

  if (initialCapitalInput && inventoryCostInput && salesPriceInput) {
    // Add event listeners to update calculations when inputs change
    initialCapitalInput.addEventListener("input", updatePracticeSection);
    inventoryCostInput.addEventListener("input", updatePracticeSection);
    salesPriceInput.addEventListener("input", updatePracticeSection);

    // Initial calculation on page load
    updatePracticeSection();
  }

  // --- Accessibility ---
  addAccessibilityFeatures();

  // --- Responsive Handling ---
  applyResponsiveStyles(); // Initial check
  window.addEventListener("resize", applyResponsiveStyles);

  // --- Swipe Gestures ---
  setupSwipeGestures();
}); // End DOMContentLoaded

// --- Function Definitions ---

// Function to show a specific section
function showSection(sectionId) {
  const navButtons = document.querySelectorAll("#timeline-nav button");
  const contentSections = document.querySelectorAll(".content-section");

  contentSections.forEach((section) => {
    section.classList.remove("active");
  });

  navButtons.forEach((button) => {
    button.classList.remove("active");
  });

  const sectionToShow = document.getElementById(sectionId);
  const buttonToActivate = document.querySelector(
    `button[data-section="${sectionId}"]`
  );

  if (sectionToShow) {
    sectionToShow.classList.add("active");
    setTimeout(() => {
      window.scrollTo({
        top: sectionToShow.offsetTop - 70,
        behavior: "smooth",
      });
    }, 50);
  }
  if (buttonToActivate) {
    buttonToActivate.classList.add("active");
  }
}

// Function to toggle explanation visibility
function toggleExplanation(explanationId) {
  const explanation = document.getElementById(explanationId);
  if (!explanation) return;

  const button = document.querySelector(
    `button[data-explanation="${explanationId}"]`
  );
  const isVisible = explanation.style.display === "block";

  if (isVisible) {
    explanation.style.display = "none";
    if (button) button.textContent = "Explain";
    if (button) button.setAttribute("aria-expanded", "false");
  } else {
    explanation.style.display = "block";
    if (button) button.textContent = "Hide Explanation";
    if (button) button.setAttribute("aria-expanded", "true");
  }
}

// Function to set up the T-account example
function setupTAccount() {
  const debitSide = document.getElementById("debit-side");
  const creditSide = document.getElementById("credit-side");

  if (!debitSide || !creditSide) return;

  debitSide.innerHTML = "";
  creditSide.innerHTML = "";

  const debitEntries = [
    { amount: 500, description: "Initial cash" },
    { amount: 200, description: "Additional investment" },
  ];
  const creditEntries = [
    { amount: 150, description: "Purchase supplies" },
    { amount: 50, description: "Pay rent" },
  ];

  debitEntries.forEach((entry) => {
    debitSide.appendChild(createTEntryElement(entry, "debit")); // Pass type
  });
  creditEntries.forEach((entry) => {
    creditSide.appendChild(createTEntryElement(entry, "credit")); // Pass type
  });

  addTAccountStyles();
}

// Helper to create a T-account entry element
function createTEntryElement(entry, type) {
  // Added type parameter
  const entryElement = document.createElement("div");
  entryElement.className = "t-entry";
  // Add class to amount for coloring
  const amountClass = type === "debit" ? "number-debit" : "number-credit";
  entryElement.innerHTML = `
        <span class="t-desc">${entry.description}</span>
        <span class="t-amount ${amountClass}">${entry.amount}</span>
    `;
  return entryElement;
}

// Helper to add T-account styles if not already present
function addTAccountStyles() {
  if (!document.getElementById("t-account-styles")) {
    const style = document.createElement("style");
    style.id = "t-account-styles";
    // Add styles for colored numbers inside T-account
    style.textContent = `
            .t-entry {
                padding: 5px 0;
                border-bottom: 1px dotted #d8cabb; /* Match theme */
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.9rem;
            }
            .t-entry:last-child { border-bottom: none; }
            .t-amount {
                font-weight: bold;
                min-width: 50px;
                text-align: right;
                padding-left: 10px;
                font-family: monospace;
            }
            .t-desc {
                font-style: italic;
                color: #6c5f53; /* Match theme */
                text-align: left;
                flex-grow: 1;
            }
            /* Color classes for T-account amounts */
            .t-amount.number-debit { color: #00695C; }
            .t-amount.number-credit { color: #A52A2A; }
        `;
    document.head.appendChild(style);
  }
}

// --- Practice Section Update Logic ---
function updatePracticeSection() {
  // 1. Get current values
  const initialCapital =
    parseFloat(document.getElementById("initialCapitalInput").value) || 0;
  const inventoryCost =
    parseFloat(document.getElementById("inventoryCostInput").value) || 0;
  const salesPrice =
    parseFloat(document.getElementById("salesPriceInput").value) || 0;

  // 2. Update Journal Entries (IDs already set)
  updateElementText("tx1Debit", initialCapital);
  updateElementText("tx1Credit", initialCapital);
  updateElementText("tx2Debit", inventoryCost);
  updateElementText("tx2Credit", inventoryCost);
  updateElementText("tx3SaleDebit", salesPrice);
  updateElementText("tx3SaleCredit", salesPrice);
  updateElementText("tx3CogsDebit", inventoryCost);
  updateElementText("tx3CogsCredit", inventoryCost);

  // 3. Calculate and Update Final Ledger Balances
  // Cash (Asset - Dr normal balance)
  const cashDebits = initialCapital + salesPrice;
  const cashCredits = inventoryCost;
  const cashBalanceValue = cashDebits - cashCredits;
  updateElementText("cashDebitTotal", cashDebits);
  updateElementText("cashCreditTotal", cashCredits);
  updateBalanceCell("cashBalance", cashBalanceValue, "Dr");

  // Inventory (Asset - Dr normal balance)
  const inventoryDebits = inventoryCost;
  const inventoryCredits = inventoryCost;
  const inventoryBalanceValue = inventoryDebits - inventoryCredits;
  updateElementText("inventoryDebitTotal", inventoryDebits);
  updateElementText("inventoryCreditTotal", inventoryCredits);
  updateBalanceCell("inventoryBalance", inventoryBalanceValue, "Dr");

  // Owner's Capital (Equity - Cr normal balance)
  const capitalDebits = 0;
  const capitalCredits = initialCapital;
  const capitalBalanceValue = capitalCredits - capitalDebits; // Positive if Credit balance
  updateElementText("capitalDebitTotal", capitalDebits);
  updateElementText("capitalCreditTotal", capitalCredits);
  updateBalanceCell("capitalBalance", capitalBalanceValue, "Cr");

  // Sales Revenue (Revenue -> Equity - Cr normal balance)
  const revenueDebits = 0;
  const revenueCredits = salesPrice;
  const revenueBalanceValue = revenueCredits - revenueDebits; // Positive if Credit balance
  updateElementText("revenueDebitTotal", revenueDebits);
  updateElementText("revenueCreditTotal", revenueCredits);
  updateBalanceCell("revenueBalance", revenueBalanceValue, "Cr");

  // Cost of Goods Sold (Expense -> Equity - Dr normal balance)
  const cogsDebits = inventoryCost;
  const cogsCredits = 0;
  const cogsBalanceValue = cogsDebits - cogsCredits; // Positive if Debit balance
  updateElementText("cogsDebitTotal", cogsDebits);
  updateElementText("cogsCreditTotal", cogsCredits);
  updateBalanceCell("cogsBalance", cogsBalanceValue, "Dr");

  // Update Totals Row
  const totalDebits =
    cashDebits + inventoryDebits + capitalDebits + revenueDebits + cogsDebits;
  const totalCredits =
    cashCredits +
    inventoryCredits +
    capitalCredits +
    revenueCredits +
    cogsCredits;
  updateElementText("totalDebits", totalDebits);
  updateElementText("totalCredits", totalCredits);

  // 4. Calculate and Update Profit
  const profit = salesPrice - inventoryCost;
  updateElementText("profitSales", salesPrice);
  updateElementText("profitCOGS", inventoryCost);
  updateElementText("profitTotal", profit);
}

// Helper function to update element text content safely
function updateElementText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  } else {
    console.warn(`Element with ID "${id}" not found for text update.`);
  }
}

// *** NEW Helper function to update balance cell text and class ***
function updateBalanceCell(cellId, balanceValue, normalBalanceType) {
  const cell = document.getElementById(cellId);
  if (!cell) {
    console.warn(`Balance cell with ID "${cellId}" not found.`);
    return;
  }

  // Determine text and class based on value and normal balance type
  let text = "";
  let balanceClass = "";

  if (balanceValue === 0) {
    text = "0";
    balanceClass = "balance-zero"; // Optional class for zero balances
  } else if (normalBalanceType === "Dr") {
    if (balanceValue > 0) {
      // Normal Debit balance
      text = `${balanceValue} (Dr)`;
      balanceClass = "balance-dr";
    } else {
      // Abnormal Credit balance
      text = `${Math.abs(balanceValue)} (Cr)`;
      balanceClass = "balance-cr";
    }
  } else if (normalBalanceType === "Cr") {
    if (balanceValue > 0) {
      // Normal Credit balance
      text = `${balanceValue} (Cr)`;
      balanceClass = "balance-cr";
    } else {
      // Abnormal Debit balance
      text = `${Math.abs(balanceValue)} (Dr)`;
      balanceClass = "balance-dr";
    }
  } else {
    // Fallback if normal type not specified
    text = `${balanceValue}`;
  }

  // Update text content
  cell.textContent = text;

  // Update classes (remove others, add the correct one)
  cell.classList.remove("balance-dr", "balance-cr", "balance-zero");
  if (balanceClass) {
    cell.classList.add(balanceClass);
  }
}

// Function to restart the tutorial
function restartTutorial() {
  // Reset input fields
  const initialCapitalInput = document.getElementById("initialCapitalInput");
  const inventoryCostInput = document.getElementById("inventoryCostInput");
  const salesPriceInput = document.getElementById("salesPriceInput");
  if (initialCapitalInput) initialCapitalInput.value = "1000";
  if (inventoryCostInput) inventoryCostInput.value = "600";
  if (salesPriceInput) salesPriceInput.value = "800";

  // Recalculate
  updatePracticeSection();

  // Hide explanations
  document
    .querySelectorAll(".explanation")
    .forEach((exp) => (exp.style.display = "none"));
  document.querySelectorAll(".explain-btn").forEach((btn) => {
    btn.textContent = "Explain";
    btn.setAttribute("aria-expanded", "false");
  });

  // Go to first section
  showSection("intro");
}

// Function to add accessibility features
function addAccessibilityFeatures() {
  // ARIA labels for buttons
  document.querySelectorAll("button").forEach((button) => {
    if (!button.getAttribute("aria-label")) {
      const text = button.textContent.trim();
      let label = text;
      if (button.closest("nav")) {
        label = `Go to ${text} section`;
      } else if (button.classList.contains("explain-btn")) {
        label = `Explain transaction ${
          button.closest(".transaction")?.id || ""
        }`;
        button.setAttribute("aria-expanded", "false");
        button.setAttribute(
          "aria-controls",
          button.getAttribute("data-explanation")
        );
      } else if (text === "Next" || text === "Previous") {
        const section = button.closest(".content-section");
        const sectionTitle =
          section?.querySelector("h2")?.textContent || section?.id || "";
        label = `${text} section from ${sectionTitle}`;
      } else if (text === "Restart Tutorial") {
        label = "Restart Tutorial from beginning, resetting practice values";
      }
      button.setAttribute("aria-label", label);
    }
  });

  // Link inputs to their list item text for context
  document
    .querySelectorAll(".scenario input.editable-ducats")
    .forEach((input) => {
      const li = input.closest("li");
      if (li) {
        let textNode = li.firstChild;
        if (textNode?.nodeType === Node.TEXT_NODE) {
          const labelId = input.id + "-label";
          let labelSpan = li.querySelector(`span[id="${labelId}"]`);
          if (!labelSpan) {
            labelSpan = document.createElement("span");
            labelSpan.id = labelId;
            labelSpan.textContent = textNode.textContent;
            li.replaceChild(labelSpan, textNode);
            input.setAttribute("aria-labelledby", labelId);
          } else {
            input.setAttribute("aria-labelledby", labelId);
          }
        } else if (
          textNode?.nodeType === Node.ELEMENT_NODE &&
          textNode.id === input.id + "-label"
        ) {
          // If span already exists from previous run
          input.setAttribute("aria-labelledby", textNode.id);
        }
      }
    });

  addFocusStyles();
}

// Helper to add focus styles if not already present
function addFocusStyles() {
  if (!document.getElementById("focus-styles")) {
    const style = document.createElement("style");
    style.id = "focus-styles";
    // Using theme colors for focus
    style.textContent = `
            button:focus, [tabindex]:focus, a:focus, input:focus {
                outline: 3px solid #a0522d; /* Sienna focus outline */
                outline-offset: 2px;
                box-shadow: 0 0 0 3px rgba(160, 82, 45, 0.4); /* Sienna shadow */
            }
            /* High contrast focus */
            @media (prefers-contrast: high) {
                button:focus, [tabindex]:focus, a:focus, input:focus {
                outline: 3px solid ButtonText;
                outline-offset: 2px;
                box-shadow: none;
                }
            }
        `;
    document.head.appendChild(style);
  }
}

// Function to apply responsive JS adjustments (if any)
function applyResponsiveStyles() {}

// Function to set up swipe gestures for navigation
function setupSwipeGestures() {
  let touchstartX = 0;
  let touchendX = 0;
  const sections = ["intro", "origins", "principles", "ledger", "practice"];
  const swipeThreshold = 50;
  const mainElement = document.querySelector("main");

  if (!mainElement) return;

  mainElement.addEventListener(
    "touchstart",
    (e) => {
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "BUTTON" ||
        e.target.closest("button") ||
        e.target.closest("input")
      ) {
        touchstartX = null;
        return;
      }
      touchstartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  mainElement.addEventListener(
    "touchend",
    (e) => {
      if (touchstartX === null) return;
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "BUTTON" ||
        e.target.closest("button") ||
        e.target.closest("input")
      ) {
        touchstartX = null;
        return;
      }
      touchendX = e.changedTouches[0].screenX;
      handleSwipeGesture();
      touchstartX = null;
    },
    { passive: true }
  );

  function handleSwipeGesture() {
    const deltaX = touchendX - touchstartX;
    if (Math.abs(deltaX) < swipeThreshold) return;

    const activeSection = document.querySelector(".content-section.active");
    if (!activeSection) return;

    const currentIndex = sections.indexOf(activeSection.id);
    if (currentIndex === -1) return;

    if (deltaX < 0) {
      // Swipe left (Next)
      if (currentIndex < sections.length - 1) {
        showSection(sections[currentIndex + 1]);
      }
    } else {
      // Swipe right (Previous)
      if (currentIndex > 0) {
        showSection(sections[currentIndex - 1]);
      }
    }
  }
}
