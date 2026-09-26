/**
 * Desk chrome behaviour.
 *
 * Phase 2 is almost entirely CSS. The one thing a stylesheet cannot express is
 * whether the page has been scrolled, which is what separates the sticky page
 * head from the content beneath it. Everything else — the sidebar's collapse
 * to an icon rail, the search modal, the notification dropdown — is existing
 * Frappe behaviour that the stylesheet re-dresses without touching.
 *
 * Cost: one passive listener, rAF-throttled, toggling a single class on
 * <body>. No DOM scanning, no polling, no work at all under another theme.
 */

const SCROLLED = "jk-scrolled";
const THRESHOLD = 4;

let ticking = false;
let attached = false;

function is_jk_active() {
	return document.documentElement.getAttribute("data-theme") === "jk-blue";
}

function update(target) {
	ticking = false;

	// Scroll can come from the window or from an inner container depending on
	// the view, so read whichever element actually reported it.
	const top =
		target === document || target === window
			? document.scrollingElement?.scrollTop || 0
			: target.scrollTop || 0;

	document.body.classList.toggle(SCROLLED, top > THRESHOLD);
}

function on_scroll(event) {
	if (ticking) return;
	ticking = true;
	const target = event.target;
	window.requestAnimationFrame(() => update(target));
}

function attach() {
	if (attached) return;
	// Capture phase, because scroll events do not bubble: this catches the
	// window and any inner scroller with a single listener.
	document.addEventListener("scroll", on_scroll, { passive: true, capture: true });
	attached = true;
}

function detach() {
	if (!attached) return;
	document.removeEventListener("scroll", on_scroll, { capture: true });
	document.body.classList.remove(SCROLLED);
	attached = false;
}

function sync() {
	is_jk_active() ? attach() : detach();
}

sync();

// The theme can change without a reload, so follow the attribute the switcher
// writes. One observer, on one element, filtered to one attribute.
new MutationObserver(sync).observe(document.documentElement, {
	attributes: true,
	attributeFilter: ["data-theme"],
});
