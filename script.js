// ==========================
// MOBILE MENU TOGGLE
// ==========================


const menuBtn = document.getElementById("menuBtn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });

}

// ==========================
// IMAGE FALLBACKS
// ==========================
const glow = document.body;

document.addEventListener("mousemove",(e)=>{

    glow.style.setProperty(
      "--x",
      `${e.clientX}px`
    );

    glow.style.setProperty(
      "--y",
      `${e.clientY}px`
    );

});
function createPlaceholder(role) {

    const isAfter = role === "after";

    const title = isAfter
        ? "Enhanced Output"
        : "Original Frame";

    const subtitle = isAfter
        ? "Recovered detail and richer tones"
        : "Soft detail and visible noise";

    const score = isAfter
        ? "98%"
        : "63%";

    const background = isAfter
        ? "#281100"
        : "#141414";

    const glow = isAfter
        ? "#F8A145"
        : "#6B6259";

    const accent = isAfter
        ? "#F07900"
        : "#3A3A3A";

    const blurFilter = isAfter
        ? ""
        : "<filter id='soft'><feGaussianBlur stdDeviation='7' /></filter>";

    const blurStart = isAfter
        ? ""
        : "<g filter='url(#soft)'>";

    const blurEnd = isAfter
        ? ""
        : "</g>";

    const svg = `
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'>
            <defs>
                <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
                    <stop offset='0%' stop-color='${background}' />
                    <stop offset='100%' stop-color='#050505' />
                </linearGradient>
                <linearGradient id='panel' x1='0' y1='0' x2='1' y2='1'>
                    <stop offset='0%' stop-color='#FFFFFF' stop-opacity='0.12' />
                    <stop offset='100%' stop-color='#FFFFFF' stop-opacity='0.02' />
                </linearGradient>
                ${blurFilter}
            </defs>

            <rect width='800' height='600' fill='url(#bg)' />
            <circle cx='605' cy='170' r='92' fill='${glow}' fill-opacity='0.45' />
            <rect x='48' y='48' width='704' height='504' rx='34' fill='url(#panel)' stroke='#FFFFFF' stroke-opacity='0.1' />

            ${blurStart}
            <path d='M0 425L170 260L325 360L520 210L800 430V600H0Z' fill='${accent}' fill-opacity='0.55' />
            <path d='M0 500L170 360L352 418L520 312L800 470V600H0Z' fill='#111111' />
            <circle cx='270' cy='248' r='90' fill='${isAfter ? "#F07900" : "#262626"}' fill-opacity='0.72' />
            ${blurEnd}

            <rect x='88' y='92' width='150' height='32' rx='16' fill='#FFFFFF' fill-opacity='0.12' />
            <text x='112' y='114' fill='white' font-size='19' font-family='Trebuchet MS, Segoe UI, sans-serif'>
                ${isAfter ? "AI PASS COMPLETE" : "RAW INPUT"}
            </text>
            <text x='88' y='168' fill='white' font-size='42' font-family='Trebuchet MS, Segoe UI, sans-serif'>
                ${title}
            </text>
            <text x='88' y='208' fill='#E0E0E0' font-size='24' font-family='Trebuchet MS, Segoe UI, sans-serif'>
                ${subtitle}
            </text>
            <text x='88' y='500' fill='${isAfter ? "#F8A145" : "#B7B7B7"}' font-size='56' font-family='Trebuchet MS, Segoe UI, sans-serif'>
                ${score}
            </text>
        </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

}

const placeholderImages = {
    before: createPlaceholder("before"),
    after: createPlaceholder("after")
};

document.querySelectorAll("img[data-role]").forEach(image => {

    const role =
        image.dataset.role === "after"
            ? "after"
            : "before";

    const fallback = () => {

        if (image.dataset.fallbackApplied === "true") {
            return;
        }

        image.dataset.fallbackApplied = "true";
        image.src = placeholderImages[role];

    };

    image.addEventListener("error", fallback, { once: true });

    if (!image.getAttribute("src")) {
        fallback();
    }

    if (image.complete && image.naturalWidth === 0) {
        fallback();
    }

});

// ==========================
// BEFORE / AFTER SLIDER
// ==========================

const slider = document.getElementById("slider");
const beforeImage = document.querySelector(".before-image-wrapper");
const comparisonDivider = document.getElementById("comparisonDivider");
const comparisonContainer = document.getElementById("comparisonContainer");

if (
slider &&
beforeImage &&
comparisonDivider &&
comparisonContainer
) {

let isDragging = false;
const updateComparison = (value) => {

    const safeValue =
        Math.min(100, Math.max(0, Number(value)));

    beforeImage.style.clipPath =
        `inset(0 ${100 - safeValue}% 0 0)`;

    comparisonDivider.style.left =
        safeValue + "%";

    slider.value = safeValue;
};

const setSliderFromPosition = (clientX) => {

    const rect =
        comparisonContainer.getBoundingClientRect();

    const percentage =
        ((clientX - rect.left) / rect.width) * 100;

    updateComparison(percentage);
};

const stopDragging = () => {

    isDragging = false;
    comparisonContainer.classList.remove("dragging");
};

// Initial position
updateComparison(slider.value);

// Range input support
slider.addEventListener("input", () => {
    updateComparison(slider.value);
});

// Mouse / Touch drag start
comparisonContainer.addEventListener("pointerdown", (event) => {

    isDragging = true;

    comparisonContainer.classList.add("dragging");

    comparisonContainer.setPointerCapture(
        event.pointerId
    );

    setSliderFromPosition(event.clientX);

});
// Mouse / Touch move
window.addEventListener("pointermove", (event) => {

    if (!isDragging) return;

    const rect =
        comparisonContainer.getBoundingClientRect();

    let percentage =
        ((event.clientX - rect.left) / rect.width) * 100;

    percentage =
        Math.max(0, Math.min(100, percentage));

    updateComparison(percentage);

});
// Mouse / Touch end
comparisonContainer.addEventListener("pointerup", stopDragging);
comparisonContainer.addEventListener("pointercancel", stopDragging);

// Responsive resize
window.addEventListener("resize", () => {
    updateComparison(slider.value);
});
// ==========================
// COUNTER ANIMATION
// ==========================

const counters =
    document.querySelectorAll(".counter");

counters.forEach(counter => {

    const target =
        Number(counter.dataset.target);

    let count = 0;

    const updateCounter = () => {

        const increment =
            Math.ceil(target / 100);

        if (count < target) {

            count += increment;

            if (count > target) {
                count = target;
            }

            counter.textContent = count;

            setTimeout(updateCounter, 20);

        } else {

            counter.textContent = target;

        }

    };

    updateCounter();

});

// ==========================
// FADE-IN ANIMATION
// ==========================

const fadeItems =
    document.querySelectorAll(".fade-in");

if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }

        });

    }, {
        threshold:0.15
    });

    fadeItems.forEach(item => {
        revealObserver.observe(item);
    });

} else {

    fadeItems.forEach(item => {
        item.classList.add("visible");
    });

}

// ==========================
// CONTACT FORM
// ==========================

const contactForm =
    document.querySelector(".contact-form");

if (contactForm) {

    contactForm.addEventListener("submit", (e) => {

        e.preventDefault();

        alert("Message Sent Successfully!");

        contactForm.reset();

    });

}

// ==========================
// SMOOTH SCROLL
// ==========================

document.querySelectorAll('a[href^="#"]')
.forEach(link => {

    link.addEventListener("click", (e) => {
        const targetSelector =
            link.getAttribute("href");

        const target =
            document.querySelector(targetSelector);

        if (!target) {
            return;
        }

        e.preventDefault();

        const header =
            document.querySelector("header");

        const headerOffset =
            header
                ? header.offsetHeight + 12
                : 0;

        const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerOffset;

        window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior:"smooth"
        });

    });

});

// ==========================
// CURRENT YEAR IN FOOTER
// ==========================

const copyright =
    document.querySelector(".copyright");

if (copyright) {

    const year =
        new Date().getFullYear();

    copyright.innerHTML =
        `&copy; ${year} All Rights Reserved.`;

}

console.log("Image Enhancer Website Loaded Successfully");}
