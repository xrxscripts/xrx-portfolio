'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

const packageSelect = document.querySelector("[data-package-select]");
const packageSelectItems = document.querySelectorAll("[data-package-select-item]");
const packageSelectValue = document.querySelector("[data-package-select-value]");
const packageFilterBtn = document.querySelectorAll("[data-package-filter-btn]");
const packageGroups = document.querySelectorAll("[data-package-group]");

const packageFilterFunc = function (selectedValue) {
  for (let i = 0; i < packageGroups.length; i++) {
    if (selectedValue === "all") {
      packageGroups[i].classList.add("active");
    } else if (selectedValue === packageGroups[i].dataset.packageCategory) {
      packageGroups[i].classList.add("active");
    } else {
      packageGroups[i].classList.remove("active");
    }
  }
};

if (packageSelect) {
  packageSelect.addEventListener("click", function () { elementToggleFunc(this); });
}

for (let i = 0; i < packageSelectItems.length; i++) {
  packageSelectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (packageSelectValue) packageSelectValue.innerText = this.innerText;
    if (packageSelect) elementToggleFunc(packageSelect);
    packageFilterFunc(selectedValue);

    if (packageFilterBtn.length) {
      for (let j = 0; j < packageFilterBtn.length; j++) {
        packageFilterBtn[j].classList.remove("active");
        if (packageFilterBtn[j].innerText.toLowerCase() === selectedValue) {
          packageFilterBtn[j].classList.add("active");
        }
      }
    }
  });
}

let lastClickedPackageBtn = packageFilterBtn[0];

for (let i = 0; i < packageFilterBtn.length; i++) {
  packageFilterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (packageSelectValue) packageSelectValue.innerText = this.innerText;
    packageFilterFunc(selectedValue);

    if (lastClickedPackageBtn) lastClickedPackageBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedPackageBtn = this;
  });
}

if (packageFilterBtn.length) {
  const initialValue = packageFilterBtn[0].innerText.toLowerCase();
  if (packageSelectValue) packageSelectValue.innerText = packageFilterBtn[0].innerText;
  packageFilterFunc(initialValue);
}

const projectModal = document.querySelector("[data-project-modal]");
const projectModalOverlay = document.querySelector("[data-project-modal-overlay]");
const projectModalCloseBtn = document.querySelector("[data-project-modal-close]");
const projectModalImg = document.querySelector("[data-project-modal-img]");
const projectModalTitle = document.querySelector("[data-project-modal-title]");
const projectModalCategory = document.querySelector("[data-project-modal-category]");
const projectModalDescription = document.querySelector("[data-project-modal-description]");
const projectOpenButtons = document.querySelectorAll("[data-project-open]");

const renderTextWithLinks = function (container, text) {
  if (!container) return;

  container.textContent = "";

  const appendTextWithBreaks = function (value) {
    const parts = String(value).split("\n");
    for (let i = 0; i < parts.length; i++) {
      if (parts[i]) container.appendChild(document.createTextNode(parts[i]));
      if (i !== parts.length - 1) container.appendChild(document.createElement("br"));
    }
  };

  const urlRegex = /https?:\/\/[^\s]+/g;
  const raw = String(text || "");
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(raw)) !== null) {
    const start = match.index;
    const end = urlRegex.lastIndex;

    if (start > lastIndex) appendTextWithBreaks(raw.slice(lastIndex, start));

    let url = raw.slice(start, end);
    let trailing = "";

    while (url.length && ".,);]".includes(url[url.length - 1])) {
      trailing = url[url.length - 1] + trailing;
      url = url.slice(0, -1);
    }

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = url;
    container.appendChild(link);

    if (trailing) container.appendChild(document.createTextNode(trailing));

    lastIndex = end;
  }

  if (lastIndex < raw.length) appendTextWithBreaks(raw.slice(lastIndex));
};

const setProjectModalOpen = function (isOpen) {
  if (!projectModal) return;

  projectModal.classList.toggle("active", isOpen);
  projectModal.setAttribute("aria-hidden", isOpen ? "false" : "true");
  document.body.classList.toggle("modal-open", isOpen);
};

const openProjectModalFromItem = function (projectItem) {
  if (!projectItem || !projectModal) return;

  const title = projectItem.dataset.projectTitle || "";
  const category = projectItem.dataset.projectCategory || "";
  const description = projectItem.dataset.projectDescription || "";
  const image = projectItem.dataset.projectImage || "";
  const alt = projectItem.dataset.projectAlt || title || "Project image";

  if (projectModalTitle) projectModalTitle.textContent = title;
  if (projectModalCategory) projectModalCategory.textContent = category;
  if (projectModalDescription) renderTextWithLinks(projectModalDescription, description);

  if (projectModalImg && image) {
    projectModalImg.src = image;
    projectModalImg.alt = alt;
  }

  setProjectModalOpen(true);
};

const closeProjectModal = function () {
  setProjectModalOpen(false);
};

for (let i = 0; i < projectOpenButtons.length; i++) {
  projectOpenButtons[i].addEventListener("click", function (event) {
    event.preventDefault();

    const projectItem = this.closest(".project-item");
    openProjectModalFromItem(projectItem);
  });
}

if (projectModalOverlay) {
  projectModalOverlay.addEventListener("click", function () {
    closeProjectModal();
  });
}

if (projectModalCloseBtn) {
  projectModalCloseBtn.addEventListener("click", function () {
    closeProjectModal();
  });
}

window.addEventListener("keydown", function (event) {
  if (!projectModal) return;
  if (!projectModal.classList.contains("active")) return;

  if (event.key === "Escape") {
    closeProjectModal();
  }
});

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

const updateFormButtonState = function () {
  const isFormValid = form.checkValidity();

  if (isFormValid) {
    formBtn.removeAttribute("disabled");
  } else {
    formBtn.setAttribute("disabled", "");
  }
}

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    updateFormButtonState();
  });
}

updateFormButtonState();

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}
