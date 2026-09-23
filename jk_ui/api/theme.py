"""Desk theme persistence for JK UI.

Frappe stores the desk theme on User.desk_theme and exposes
``frappe.core.doctype.user.user.switch_theme`` to change it, but that endpoint
validates against a hardcoded list of the three themes Frappe ships. Adding a
fourth theme therefore needs an endpoint of its own; this is it. It applies the
same rule as core — a user may only change their own theme — and refuses any
value that is not a registered option.
"""

import frappe
from frappe import _

from jk_ui.constants import THEME_LABEL

#: The themes a user may select. Extending JK UI with a second branded theme
#: (a JK Dark, say) means adding it here, to the Property Setter options and to
#: the stylesheet — nothing else.
ALLOWED_THEMES = ("Light", "Dark", "Automatic", THEME_LABEL)


@frappe.whitelist()
def set_theme(theme: str) -> str:
	"""Persist the current user's desk theme.

	Returns the stored value so the caller can confirm what was applied.
	"""
	if theme not in ALLOWED_THEMES:
		frappe.throw(
			_("{0} is not a valid desk theme.").format(frappe.bold(theme)),
			title=_("Unknown Theme"),
		)

	# set_value rather than a document save: this is a single user preference
	# written on every theme click, and it must not fire User validation or
	# touch the modified timestamp of the user record.
	frappe.db.set_value("User", frappe.session.user, "desk_theme", theme, update_modified=False)
	frappe.clear_cache(user=frappe.session.user)

	return theme
