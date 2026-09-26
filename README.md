# JK UI

A modern, professional interface for Frappe and ERPNext.

JK UI installs alongside your existing system and gives it a new look — cleaner
layouts, clearer typography, better spacing and a blue brand identity — without
changing how anything works. Every screen behaves exactly as before.

---

## What problem it solves

Out of the box, ERPNext looks like an engineering tool. Dense rows of text,
almost no visual hierarchy, and screens that are hard to scan quickly. It works
well, but it does not look like a product you would confidently put in front of
a client.

JK UI changes the presentation layer only. Your data, your documents, your
permissions and your business rules are untouched. What changes is how easy the
system is to read and navigate:

- Important actions are easy to find
- Document status is visible at a glance
- Long forms are broken into readable sections
- Tables and reports are easier to scan
- The interface works properly on tablets and phones

---

## Versions

Built and tested against **Frappe v16** and **ERPNext v16**.

---

## What the JK Blue theme does

JK Blue is the branded theme. Blue is used deliberately, not everywhere — for
the things that should stand out:

- Primary buttons such as Save and Submit
- The workspace you are currently in
- Links and clickable values
- Selected rows
- Charts and key figures
- Focus outlines when navigating by keyboard

Everything else stays on a calm, light blue-grey background so the content is
what you notice first.

---

## What is covered

| Area | What changed |
| --- | --- |
| Sidebar | Clearer navigation, obvious current location, grouped sections |
| Top bar | Readable breadcrumbs, separated actions, shadow when scrolling |
| Search | Looks like a real search box, with a keyboard shortcut hint |
| Notifications | Tidier panel, clear unread count |
| Workspaces | Cards with spacing and grouping, tidier dashboards |
| Dashboards | Clearer numbers, trends and charts |
| List views | Taller rows, sticky headers, visible selection, clearer status |
| Forms | Section headings, clearer labels, obvious required fields |
| Child tables | Readable rows, clear required columns, tidy buttons |
| Reports | Clean tables, clearer filters, easier scanning |
| Dialogs | Consistent headers, footers and buttons |
| Menus and tooltips | Matching rounded, shadowed style |
| Mobile and tablet | Usable layouts, no sideways scrolling |

---

## How the three themes work

Your system has three themes, and each person chooses their own:

1. **Frappe Light** — the standard ERPNext appearance, completely unchanged
2. **Timeless Night** — the standard dark appearance, completely unchanged
3. **JK Blue** — the branded theme this app provides

This is deliberate. JK UI only paints when JK Blue is selected. If someone
prefers the standard look, they switch back and see exactly the original
ERPNext, with nothing left over.

---

## Installing

```bash
bench get-app jk_ui <repository-url>
bench --site <your-site> install-app jk_ui
bench build --app jk_ui
```

Then restart the site's web process, so it picks up the new app.

---

## Choosing the theme

Click your avatar at the bottom of the sidebar, or press **Ctrl + Shift + G**
(**Cmd + Shift + G** on a Mac), and pick **JK Blue**.

The choice is saved to your user account, so it stays after refreshing,
navigating, and logging out and back in. Each user chooses independently.

---

## What happens to new DocTypes

Nothing needs to be done. JK UI styles the framework itself, not individual
document types, so any DocType, workspace, report or app added later
automatically appears in the new design. This was verified by creating new
DocTypes and workspaces during testing and confirming they inherited the
styling with no extra configuration.

---

## What is intentionally not customised

- **Light and Dark themes** — left exactly as ERPNext ships them, by design
- **Business logic** — no calculations, validations or workflows are touched
- **DocType definitions** — no fields, permissions or structures are changed
- **Frappe and ERPNext core files** — never modified
- **Report calculations** — only how results are displayed
- **Specialised views** — Kanban, Gantt and Calendar keep their standard look

---

## Known limitations

1. **Cancelled documents** are styled but were not visually verified, because
   testing that would mean permanently cancelling a real document.
2. **Reports that return no rows show an empty area.** ERPNext itself draws
   nothing in that case, so there is nothing for the theme to style.
3. **Row highlighting when selecting records** uses a modern browser feature.
   In older browsers the highlight simply does not appear; nothing breaks.
4. Some styling could not be exercised because the test system had no such data
   — for example trend arrows on dashboard figures.

---

## Development architecture

- A standard Frappe custom app; Frappe and ERPNext are never modified
- Styling is driven by design tokens, so colours and spacing are defined once
- All styling is scoped to the JK Blue theme, which is what protects Light and Dark
- JavaScript is kept to about 4 KB and used only where styling genuinely cannot
  do the job
- No external frameworks or libraries

Full detail is in `JK_UI_TECHNICAL_DOCUMENTATION.md`.

---

## Testing status

Built over six reviewed stages, each verified in a real browser driving a live
site rather than by inspecting code:

- 10 standard ERPNext DocTypes plus custom ones, across lists and forms
- Workspaces, dashboards, reports, dialogs and child tables
- Four screen sizes from desktop to phone
- All three themes
- Keyboard navigation and focus checks
- Confirmed no leftover changes to Frappe or ERPNext

A plain-language guide for end users is in `JK_UI_USER_MANUAL.md`.
