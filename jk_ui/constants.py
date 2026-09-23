"""Shared constants for JK UI.

The theme label is the value stored on User.desk_theme and offered in the
theme dialog. Frappe lowercases it into the ``data-theme`` attribute on the
desk's <html> element, which is what the stylesheet keys off.
"""

#: Stored on User.desk_theme and shown in the theme switcher.
THEME_LABEL = "JK Blue"

#: The Property Setter that adds THEME_LABEL to the User.desk_theme options.
THEME_PROPERTY_SETTER = "User-desk_theme-options"

#: The stock options Frappe ships on the field, in Frappe's own order.
STOCK_THEMES = ("Light", "Dark", "Automatic")
