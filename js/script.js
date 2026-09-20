/* =========================================================
   RESUME MAKER - script.js
   1) Data   2) Helpers   3) Build the resume   4) Form
   5) Photo upload   6) Colours   7) Buttons   8) Save   9) Start
   ========================================================= */

// ---------- 1) DATA: all the resume details live in one object ----------
const sampleData = {
  name: "Rahul Sharma",
  role: "B.Tech Computer Science Student",
  email: "rahul.sharma@example.com",
  phone: "+91 98765 43210",
  address: "Lucknow, Uttar Pradesh",
  about: "Motivated B.Tech student with a strong interest in web development and problem solving. Looking for an internship where I can apply my skills and learn from real projects.",
  skills: "HTML, CSS, JavaScript, Python, C++, Git",
  languages: "Hindi, English",
  hobbies: "Gym, Cricket, Music",
  photo: "",
  education: [
    { degree: "B.Tech (Computer Science)", school: "ABC Institute of Technology", year: "2022 - 2026", score: "CGPA 8.2" },
    { degree: "Class XII (CBSE)",           school: "City Public School",          year: "2021",        score: "88%" },
    { degree: "Class X (CBSE)",             school: "City Public School",          year: "2019",        score: "91%" }
  ],
  projects: [
    { title: "Gym Playlist Website",  desc: "A responsive website to browse and search workout songs.\nBuilt using HTML, CSS and JavaScript." },
    { title: "Student Result Portal", desc: "A simple portal to add students and calculate results automatically." }
  ]
};

const colors = ["#0d9488", "#2563eb", "#7c3aed", "#e11d48", "#ea580c", "#1f2937"];
const STORAGE_KEY = "resumeMakerData";

let accent = colors[0];
let data = clone(sampleData);
let generated = false;      // becomes true after you click "Generate Resume"

function blankEdu()  { return { degree: "", school: "", year: "", score: "" }; }
function blankProj() { return { title: "", desc: "" }; }
function clone(obj)  { return JSON.parse(JSON.stringify(obj)); }

// Elements we use again and again
const resumeEl = document.getElementById("resume");
const scaleBox = document.getElementById("scaleBox");
const scrollEl = document.getElementById("scroll");

// ---------- 2) HELPERS ----------
// Makes special characters safe, so typing < or > cannot break the page
function esc(text) {
  return String(text || "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
// "HTML, CSS, JS" becomes ["HTML", "CSS", "JS"]
function splitList(text) {
  return String(text || "").split(",").map(function (t) { return t.trim(); }).filter(Boolean);
}
// First letters of the name (shown when there is no photo)
function initials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "CV";
  return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
}

let toastTimer;
function showToast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2600);
}

// ---------- 3) BUILD THE RESUME: turns the data into HTML ----------
function renderResume() {
  const d = data;
  const skills = splitList(d.skills);
  const langs  = splitList(d.languages);
  const hobs   = splitList(d.hobbies);
  const edu    = d.education.filter(function (e) { return e.degree || e.school || e.year || e.score; });
  const proj   = d.projects.filter(function (p) { return p.title || p.desc; });

  const photo = d.photo
    ? '<img src="' + d.photo + '" alt="Profile photo">'
    : '<div class="r-initial">' + esc(initials(d.name)) + '</div>';

  // Left sidebar
  let side = '<div class="r-photo">' + photo + '</div>';

  if (d.email || d.phone || d.address) {
    side += '<h3>Contact</h3><div class="r-contact">';
    if (d.email)   side += '<div><span>Email</span>'   + esc(d.email)   + '</div>';
    if (d.phone)   side += '<div><span>Phone</span>'   + esc(d.phone)   + '</div>';
    if (d.address) side += '<div><span>Address</span>' + esc(d.address) + '</div>';
    side += '</div>';
  }
  if (skills.length) {
    side += '<h3>Skills</h3><div class="r-tags">' +
      skills.map(function (s) { return '<span>' + esc(s) + '</span>'; }).join("") + '</div>';
  }
  if (langs.length) {
    side += '<h3>Languages</h3><div class="r-lines">' +
      langs.map(function (s) { return '<div>' + esc(s) + '</div>'; }).join("") + '</div>';
  }
  if (hobs.length) {
    side += '<h3>Hobbies</h3><div class="r-lines">' +
      hobs.map(function (s) { return '<div>' + esc(s) + '</div>'; }).join("") + '</div>';
  }

  // Right side (main part)
  let main = '<div class="r-name">' + esc(d.name || "Your Name") + '</div>';
  if (d.role) main += '<div class="r-role">' + esc(d.role) + '</div>';

  if (d.about.trim()) {
    main += '<h3>About me</h3><div class="r-text">' + esc(d.about) + '</div>';
  }
  if (edu.length) {
    main += '<h3>Education</h3>' + edu.map(function (e) {
      const when = [e.year, e.score].filter(Boolean).join("  |  ");
      return '<div class="r-item"><div class="r-row"><b>' + esc(e.degree) + '</b>' +
             '<span class="r-when">' + esc(when) + '</span></div>' +
             (e.school ? '<div class="r-sub">' + esc(e.school) + '</div>' : '') + '</div>';
    }).join("");
  }
  if (proj.length) {
    main += '<h3>Projects and experience</h3>' + proj.map(function (p) {
      return '<div class="r-item"><b>' + esc(p.title) + '</b>' +
             (p.desc ? '<div class="r-text">' + esc(p.desc) + '</div>' : '') + '</div>';
    }).join("");
  }

  resumeEl.style.setProperty("--accent", accent);
  resumeEl.innerHTML = '<div class="r-side">' + side + '</div><div class="r-main">' + main + '</div>';
  fitPreview();
}

// The resume is 794px wide. This shrinks it to fit the preview box.
function fitPreview() {
  const scale = Math.min(1, (scrollEl.clientWidth - 36) / 794);
  resumeEl.style.transform = "scale(" + scale + ")";
  scaleBox.style.width  = (794 * scale) + "px";
  scaleBox.style.height = (resumeEl.offsetHeight * scale) + "px";
}

// ---------- GENERATE BUTTON ----------
const previewStatus = document.getElementById("previewStatus");
const emptyPreview  = document.getElementById("emptyPreview");
const printBtn      = document.getElementById("printBtn");
const READY_TEXT = 'Resume ready. Click "Download PDF" and choose "Save as PDF".';
const EMPTY_TEXT = 'Click "Generate Resume" to create your resume.';

function setStatus(text, isStale) {
  previewStatus.textContent = text;
  previewStatus.classList.toggle("stale", !!isStale);
}

// Preview shows the resume
function showResume() {
  emptyPreview.hidden = true;
  scaleBox.hidden = false;
  printBtn.classList.remove("is-disabled");
}
// Preview shows the "your resume will appear here" box
function showEmpty() {
  emptyPreview.hidden = false;
  scaleBox.hidden = true;
  printBtn.classList.add("is-disabled");
  setStatus(EMPTY_TEXT);
}

// The main button: creates the resume from the form
function generateResume() {
  if (!data.name.trim()) {
    showToast("Please enter your full name first");
    const nameBox = document.getElementById("name");
    nameBox.scrollIntoView({ behavior: "smooth", block: "center" });
    nameBox.focus({ preventScroll: true });
    return;
  }
  generated = true;
  showResume();
  renderResume();
  setStatus(READY_TEXT);
  saveData();
  showToast("Resume generated");
  // On phones the preview is below the form, so scroll down to it
  if (window.innerWidth <= 960) {
    document.querySelector(".preview-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Called when any detail changes after the resume was already generated
function dataChanged() {
  saveData();
  if (generated) setStatus('You changed something. Click "Generate Resume" to update.', true);
}

document.querySelectorAll("[data-generate]").forEach(function (btn) {
  btn.addEventListener("click", generateResume);
});

// ---------- 4) FORM ----------
// Builds one text box
function field(label, list, idx, name, value, placeholder, full) {
  return '<div class="field' + (full ? ' full' : '') + '"><label>' + label + '</label>' +
         '<input type="text" data-list="' + list + '" data-idx="' + idx + '" data-field="' + name + '"' +
         ' value="' + esc(value) + '" placeholder="' + esc(placeholder) + '"></div>';
}

// Builds the Education and Projects rows
function renderLists() {
  document.getElementById("eduList").innerHTML = data.education.map(function (e, i) {
    return '<div class="row">' +
      '<button class="x" type="button" data-remove="education" data-idx="' + i + '" aria-label="Remove">&times;</button>' +
      '<div class="grid2">' +
        field("Degree or class", "education", i, "degree", e.degree, "e.g. B.Tech (CSE)", true) +
        field("College or school", "education", i, "school", e.school, "e.g. ABC Institute", true) +
        field("Year", "education", i, "year", e.year, "2022 - 2026") +
        field("Marks or CGPA", "education", i, "score", e.score, "e.g. CGPA 8.2") +
      '</div></div>';
  }).join("");

  document.getElementById("projList").innerHTML = data.projects.map(function (p, i) {
    return '<div class="row">' +
      '<button class="x" type="button" data-remove="projects" data-idx="' + i + '" aria-label="Remove">&times;</button>' +
      '<div class="grid2">' +
        field("Project or job title", "projects", i, "title", p.title, "e.g. Gym Playlist Website", true) +
        '<div class="field full"><label>What did you do?</label>' +
        '<textarea data-list="projects" data-idx="' + i + '" data-field="desc" placeholder="What you built and which tools you used...">' + esc(p.desc) + '</textarea></div>' +
      '</div></div>';
  }).join("");
}

// Fills every box from the data
function fillForm() {
  document.querySelectorAll("[data-key]").forEach(function (el) { el.value = data[el.dataset.key] || ""; });
  renderLists();
  updatePhotoThumb();
}

// When you type anything, the resume updates instantly
document.getElementById("form").addEventListener("input", function (e) {
  const t = e.target;
  if (t.type === "file") return;
  if (t.dataset.key) {
    data[t.dataset.key] = t.value;
  } else if (t.dataset.list) {
    data[t.dataset.list][t.dataset.idx][t.dataset.field] = t.value;
  }
  dataChanged();
});

// The x button removes a row
document.getElementById("form").addEventListener("click", function (e) {
  const btn = e.target.closest("[data-remove]");
  if (!btn) return;
  data[btn.dataset.remove].splice(Number(btn.dataset.idx), 1);
  renderLists();
  dataChanged();
});

document.getElementById("addEdu").addEventListener("click", function () {
  data.education.push(blankEdu());
  renderLists();
});
document.getElementById("addProj").addEventListener("click", function () {
  data.projects.push(blankProj());
  renderLists();
});

// ---------- 5) PHOTO UPLOAD ----------
const photoInput = document.getElementById("photoInput");

document.getElementById("photoPick").addEventListener("click", function () {
  photoInput.click();
});

function setPhotoMsg(text, isError) {
  const m = document.getElementById("photoMsg");
  m.textContent = text;
  m.classList.toggle("err", !!isError);
}

photoInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  setPhotoMsg("Loading photo...");

  const url = URL.createObjectURL(file);
  const img = new Image();

  img.onload = function () {
    try {
      // Crop the middle square, shrink to 400 x 400
      const size = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = 400; canvas.height = 400;
      canvas.getContext("2d").drawImage(
        img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 400, 400
      );
      data.photo = canvas.toDataURL("image/jpeg", 0.9);
      updatePhotoThumb();
      dataChanged();
      setPhotoMsg(generated ? "Photo added. Click Generate Resume to update your resume." : "Photo added.");
    } catch (err) {
      setPhotoMsg("Could not use this photo. Please try another one.", true);
    }
    URL.revokeObjectURL(url);
  };
  img.onerror = function () {
    URL.revokeObjectURL(url);
    setPhotoMsg("This photo could not be opened. Please choose a JPG or PNG image.", true);
  };
  img.src = url;
  e.target.value = "";      // lets you pick the same file again
});

document.getElementById("photoRemove").addEventListener("click", function () {
  data.photo = "";
  updatePhotoThumb();
  setPhotoMsg("Photo removed.");
  dataChanged();
});

function updatePhotoThumb() {
  const thumb = document.getElementById("photoThumb");
  thumb.innerHTML = data.photo ? '<img src="' + data.photo + '" alt="">' : "No photo";
}

// ---------- 6) COLOUR BUTTONS ----------
function renderSwatches() {
  const box = document.getElementById("swatches");
  box.innerHTML = "";
  colors.forEach(function (c) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "swatch" + (c === accent ? " active" : "");
    b.style.background = c;
    b.setAttribute("aria-label", "Use colour " + c);
    b.addEventListener("click", function () {
      accent = c;
      renderSwatches();
      saveData();
      if (generated) { renderResume(); setStatus(READY_TEXT); }   // colour changes apply at once
    });
    box.appendChild(b);
  });
}

// ---------- 7) TOP BUTTONS ----------
document.getElementById("sampleBtn").addEventListener("click", function () {
  const keepPhoto = data.photo;              // your photo stays
  data = clone(sampleData);
  data.photo = keepPhoto;
  fillForm();
  dataChanged();
  showToast("Sample loaded. Now click Generate Resume");
});

document.getElementById("clearBtn").addEventListener("click", function () {
  data = {
    name: "", role: "", email: "", phone: "", address: "", about: "",
    skills: "", languages: "", hobbies: "", photo: "",
    education: [blankEdu()], projects: [blankProj()]
  };
  setPhotoMsg("JPG or PNG works best. It is cropped to a square.");
  generated = false;
  showEmpty();
  fillForm();
  saveData();
  showToast("All details cleared");
});

// Download PDF = the browser's print window, where you choose "Save as PDF"
printBtn.addEventListener("click", function () {
  if (!generated) {
    showToast('Please click "Generate Resume" first');
    return;
  }
  const oldTitle = document.title;
  document.title = (data.name || "My") + " - Resume";      // becomes the PDF file name
  window.print();
  document.title = oldTitle;
});

window.addEventListener("resize", fitPreview);

// ---------- 8) SAVE in this browser, so a refresh does not lose your work ----------
function saveData() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: data, accent: accent, generated: generated })); }
  catch (err) { /* storage full or blocked, ignore */ }
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved && saved.data && Array.isArray(saved.data.education) && Array.isArray(saved.data.projects)) {
      data = saved.data;
      if (colors.indexOf(saved.accent) !== -1) accent = saved.accent;
      generated = !!saved.generated && !!String(data.name || "").trim();
    }
  } catch (err) { /* saved data was broken, start fresh */ }
}

// ---------- 9) START ----------
loadData();
renderSwatches();
fillForm();
if (generated) { showResume(); renderResume(); setStatus(READY_TEXT); }
else { showEmpty(); }
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitPreview);
