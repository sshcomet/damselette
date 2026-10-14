---
title: Introduction
description: What Damselette is and how to read these docs.
group: Start here
---

# Introduction

**Damselette** is a Discord bot that watches over your community. It combines a complete moderation toolkit, a private support ticket desk and automatic protection against server raids, wrapped in a calm, moonlit personality.

These docs explain everything the bot does and every command you can use. If you are new, begin with [Getting started](#/docs/getting-started). If you know what you are looking for, press `/` or `Ctrl K` to search.

## What's inside

| Area | What it does | Learn more |
|---|---|---|
| **Moderation** | Warnings, timeouts, kicks, bans, channel control and a numbered case log. | [Guide](#/docs/moderation) · [Commands](#/commands/moderation) |
| **Tickets** | A button-driven support desk with private channels and transcripts. | [Guide](#/docs/tickets) · [Commands](#/commands/tickets) |
| **Anti-nuke** | Rolls back mass-destruction and asks your admins before punishing. | [Guide](#/docs/antinuke) · [Commands](#/commands/admin) |
| **Utility** | Avatars, user and server info, latency. | [Commands](#/commands/utility) |

## How to read command syntax

Damselette uses Discord's slash commands. Type `/` in any channel and pick a command from the list.

- `<angle brackets>` mark a **required** option.
- `[square brackets]` mark an **optional** option.
- `a|b` means choose one of the listed values.
- Commands with sub-commands, such as `/ticket close`, are written with a space between the parts.

```text
/timeout user:<member> duration:<time> [reason]
```

## Durations

Commands that take a time, like `/timeout` and `/antinuke relax`, accept a number followed by a unit. You can chain several together.

| Unit | Meaning | Example |
|---|---|---|
| `s` | seconds | `45s` |
| `m` | minutes | `10m` |
| `h` | hours | `2h` |
| `d` | days | `1d` |
| `w` | weeks | `1w` |

`1h30m` means one hour and thirty minutes.

## Permissions at a glance

Each command page lists two things: the permission **you** need to run it, and what **Damselette** needs in order to carry it out. Discord also hides commands you are not allowed to use. The full list lives on the [Permissions](#/docs/permissions) page.

> [!TIP]
> Not sure why something failed? Damselette replies with a short explanation, usually about role order or a missing permission. The [FAQ](#/docs/faq) covers the common ones.
