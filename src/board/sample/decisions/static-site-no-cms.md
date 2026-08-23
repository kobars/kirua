---
type: Decision
title: Static site, no CMS
description: Markdown in the repository, built to HTML. A CMS would add a login to a site with one author.
resource: /decisions/static-site-no-cms.md
tags: [process]
status: stable
generated:
  by: claude-code/fable-5
  at: 2026-08-23T23:30:00+07:00
---

# Decision

Lantern is Markdown files in a repository, built to static HTML on every push.
There is no content management system and no database.

# Why

One author, no editorial workflow, and every page is reviewed as a diff. A CMS
would add an account, a host, and a second place for content to live, for a
site that fits in a folder.

# Revisit if

A second author needs to publish without opening a pull request.
