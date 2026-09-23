"""Install and migrate hooks for JK UI.

The only schema-level change the app makes is one Property Setter that adds
"JK Blue" to the User.desk_theme select options. It ships as a fixture so a
fresh install reproduces it, and it is re-applied on every migrate so that a
Frappe upgrade which rewrites the field cannot silently drop the option.
"""

import frappe

from jk_ui.constants import STOCK_THEMES, THEME_LABEL, THEME_PROPERTY_SETTER


def after_install():
	register_theme_option()


def after_migrate():
	register_theme_option()


def before_uninstall():
	"""Leave the site exactly as it was found.

	Anyone still on JK Blue is moved back to Light before the option
	disappears, otherwise their User record would hold a value the field no
	longer offers.
	"""
	reset_users_to_light()
	frappe.db.delete("Property Setter", {"name": THEME_PROPERTY_SETTER})


def register_theme_option():
	"""Add JK Blue to User.desk_theme, idempotently."""
	options = "\n".join([*STOCK_THEMES, THEME_LABEL])

	existing = frappe.db.get_value(
		"Property Setter", THEME_PROPERTY_SETTER, ["name", "value"], as_dict=True
	)

	if existing:
		if existing.value != options:
			frappe.db.set_value("Property Setter", existing.name, "value", options)
			frappe.clear_cache(doctype="User")
		return

	frappe.get_doc(
		{
			"doctype": "Property Setter",
			"name": THEME_PROPERTY_SETTER,
			"doctype_or_field": "DocField",
			"doc_type": "User",
			"field_name": "desk_theme",
			"property": "options",
			"property_type": "Text",
			"value": options,
		}
	).insert(ignore_permissions=True)

	frappe.clear_cache(doctype="User")


def reset_users_to_light():
	users = frappe.get_all("User", filters={"desk_theme": THEME_LABEL}, pluck="name")
	for user in users:
		frappe.db.set_value("User", user, "desk_theme", "Light", update_modified=False)
	if users:
		frappe.clear_cache()
