/**
 * Workspace accessibility.
 *
 * Frappe renders every shortcut widget with role="link", tabindex="0" and an
 * aria-label, but binds activation to click only — there is no keydown handler
 * anywhere in the widget code. A keyboard user can therefore tab onto a
 * shortcut and has no way to follow it.
 *
 * This closes that gap globally, for every workspace in every app, with one
 * delegated listener. It is additive: nothing else in Frappe listens for these
 * keys on these elements, so there is no risk of an action firing twice.
 *
 * Gated on the theme like the rest of the app, so switching to Light or Dark
 * returns the desk to exactly stock behaviour.
 */

const ACTIVATE_KEYS = new Set(["Enter", " ", "Spacebar"]);
const SELECTOR = ".widget.shortcut-widget-box[tabindex]";

let attached = false;

function is_jk_active() {
	return document.documentElement.getAttribute("data-theme") === "jk-blue";
}

function on_keydown(event) {
	if (!ACTIVATE_KEYS.has(event.key)) return;

	// Only act when the focused element is a shortcut, so a key pressed in a
	// field or anywhere else is left entirely alone.
	const active = document.activeElement;
	if (!active || !active.matches?.(SELECTOR)) return;

	// Space would otherwise scroll the page out from under the shortcut.
	event.preventDefault();
	active.click();
}

function sync() {
	const active = is_jk_active();
	if (active === attached) return;

	if (active) {
		document.addEventListener("keydown", on_keydown);
	} else {
		document.removeEventListener("keydown", on_keydown);
	}
	attached = active;
}

sync();

new MutationObserver(sync).observe(document.documentElement, {
	attributes: true,
	attributeFilter: ["data-theme"],
});
