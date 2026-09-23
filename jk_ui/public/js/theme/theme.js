/**
 * JK Blue theme registration.
 *
 * Frappe v16 ships three desk themes and validates the list server-side in
 * frappe.core.doctype.user.user.switch_theme, which accepts only Light, Dark
 * and Automatic. Rather than patching core, this file:
 *
 *   1. normalises the theme attribute Frappe renders server-side,
 *   2. adds a fourth card to the stock theme dialog by extending the
 *      ThemeSwitcher prototype at runtime, and
 *   3. persists the choice through this app's own whitelisted endpoint.
 *
 * Nothing here runs on a page render; it is prototype work plus two attribute
 * reads, so the cost is a fraction of a millisecond once per page load.
 */

frappe.provide("jk_ui.theme");

const SLUG = "jk-blue";
const STORED = "JK Blue";

// desk.html renders data-theme from the stored value lowercased, which gives
// "jk blue" with a space. The stylesheet matches both spellings so there is no
// flash of unstyled content either way, but everything downstream is easier if
// the attribute is a single token.
const LEGACY = "jk blue";

const STORED_VALUE = {
	light: "Light",
	dark: "Dark",
	automatic: "Automatic",
	[SLUG]: STORED,
};

function normalise_attributes() {
	const root = document.documentElement;
	["data-theme", "data-theme-mode"].forEach((attr) => {
		if ((root.getAttribute(attr) || "").toLowerCase() === LEGACY) {
			root.setAttribute(attr, SLUG);
		}
	});
}

function extend_theme_switcher() {
	const ThemeSwitcher = frappe.ui && frappe.ui.ThemeSwitcher;
	if (!ThemeSwitcher || ThemeSwitcher.prototype.__jk_patched) return;

	const fetch_themes = ThemeSwitcher.prototype.fetch_themes;

	// Append rather than replace, so a future Frappe release that adds a
	// fourth stock theme keeps it.
	ThemeSwitcher.prototype.fetch_themes = function () {
		return fetch_themes.call(this).then(() => {
			if (!this.themes.some((theme) => theme.name === SLUG)) {
				this.themes.push({
					name: SLUG,
					label: __("JK Blue"),
					info: __("JK's branded blue theme"),
				});
			}
			return this.themes;
		});
	};

	// The stock implementation posts to a core endpoint that rejects any
	// theme outside its hardcoded list, so selection is routed through this
	// app instead. Behaviour for the three stock themes is unchanged.
	ThemeSwitcher.prototype.toggle_theme = function (theme) {
		this.current_theme = theme.toLowerCase();
		document.documentElement.setAttribute("data-theme-mode", this.current_theme);
		frappe.ui.set_theme(this.current_theme === "automatic" ? null : this.current_theme);

		frappe.show_alert({ message: __("Theme Changed"), indicator: "blue" }, 3);

		frappe.xcall("jk_ui.api.theme.set_theme", {
			theme: STORED_VALUE[this.current_theme] || theme,
		});
	};

	ThemeSwitcher.prototype.__jk_patched = true;
}

normalise_attributes();
extend_theme_switcher();

window.jk_ui.theme = {
	SLUG,
	STORED,
	is_active() {
		return document.documentElement.getAttribute("data-theme") === SLUG;
	},
};
