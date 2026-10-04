---
type: Task
title: Set up search
description: A reader who knows the word should find the page.
resource: /tasks/set-up-search.md
tags: [delivery]
status: stable
state: backlog
epic: /epics/delivery.md
priority: 20
generated:
  by: lantern-cli/1.0
  at: 2026-08-23T23:30:00+07:00
---
Client-side search over the built pages. No server, in keeping with
[static-site-no-cms](../decisions/static-site-no-cms.md).

* [ ] Build the index at build time
* [ ] Add the search box to the header

# Done when

Typing a heading's words into the box lists that page first.
