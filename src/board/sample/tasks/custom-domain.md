---
type: Task
title: Point the custom domain at the site
description: lantern.example is bought; the registrar has not released it yet.
resource: /tasks/custom-domain.md
tags: [delivery]
status: stable
state: blocked
epic: /epics/delivery.md
priority: 21
generated:
  by: lantern-cli/1.0
  at: 2026-08-23T23:30:00+07:00
---
The domain is purchased. The registrar's transfer lock has not lifted, so the
records cannot be changed from this side. Nothing on the board can move it.

* [ ] Add the DNS records once the lock lifts
* [ ] Confirm the certificate issues

# Done when

`https://lantern.example` serves the home page.
