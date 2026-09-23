# JK UI

A global design system for Frappe and ERPNext, delivered as a custom app. It
adds a fourth desk theme, **JK Blue**, which restyles every module, DocType,
list, form, report, dashboard and dialog in the installation — including apps
that are not installed yet — without modifying a single Frappe or ERPNext file.

## How it works

Frappe v16's desk is built entirely on CSS custom properties, scoped by a
`data-theme` attribute that `desk.html` renders server-side from the signed-in
user's `User.desk_theme`. Almost every component in the desk derives from two
primitive ramps (`--gray-*`, `--blue-*`) plus a small set of semantic variables.

JK UI binds its own tokens onto those variables under
`[data-theme="jk blue"]`. Re-pointing the ramps re-skins the whole desk at
once, so no DocType needs per-DocType styling, no DOM is scanned at runtime and
no markup is rewritten.

```
public/scss/_tokens.scss      --jk-* primitives and semantic aliases
public/scss/_theme.scss       binds those onto Frappe's own variables
public/scss/_foundation.scss  shape, elevation and interaction states
public/scss/_switcher.scss    the theme dialog (the one unscoped block)
public/js/theme/theme.js      registers the theme with the stock switcher
```

Because every rule except the theme dialog is scoped to the theme selector,
the stylesheet paints nothing when any other theme is selected.

## Hooks used

| Hook | Purpose |
| --- | --- |
| `app_include_css` | the single desk stylesheet |
| `app_include_js` | theme registration (~2 KB) |
| `after_install` / `after_migrate` | adds `JK Blue` to the `User.desk_theme` options, idempotently |
| `before_uninstall` | moves users back to Light and removes the option |
| `fixtures` | ships the Property Setter so a fresh install reproduces it |

No `doc_events`, no `override_doctype_class`, no core patches.

## Choosing the theme

Avatar menu → **Toggle Theme** (or `Ctrl/Cmd + Shift + G`). JK Blue appears
beside the three stock themes. The choice is stored on the User record, so it
survives refresh, navigation, logout and login.

Frappe's own `switch_theme` endpoint validates against a hardcoded list of its
three themes, so selection is routed through `jk_ui.api.theme.set_theme`, which
applies the same permission rule and rejects unknown values.

## Install on another site

```bash
bench get-app jk_ui <repository-url>
bench --site <site> install-app jk_ui
bench build --app jk_ui
```

Restart the site's web process afterwards, so it can import the new app.

## Remove safely

Switching back to Light or Dark in the theme dialog is enough to disable the
theme for one user; the stylesheet then applies nothing.

To remove it from the site entirely:

```bash
bench --site <site> uninstall-app jk_ui
bench build
```

`before_uninstall` moves anyone still on JK Blue back to Light and deletes the
Property Setter, so no User record is left holding a value its field no longer
offers. Since no core file is touched, the stock interface returns immediately.

## Compatibility

Developed against Frappe v16 and ERPNext v16.
