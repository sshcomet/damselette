---
title: Permissions
description: What you need to run each command, and what Damselette needs to carry it out.
group: Reference
---

# Permissions

Every command has two permission requirements: what **you** need to use it, and what **Damselette** needs in the server to carry it out. Discord hides commands from members who lack the required permission, and server admins can fine-tune who sees what in **Server Settings → Integrations**.

> [!TIP]
> If you would rather not think about it, give Damselette the **Administrator** permission. Everything below is for servers that prefer the least privilege.

## Permissions by feature

| Feature | Damselette needs |
|---|---|
| Moderation | Ban Members, Kick Members, Moderate Members, Manage Messages, Manage Channels, Manage Nicknames, Manage Roles, Move Members |
| Tickets | View Channels, Send Messages, Embed Links, Attach Files, Read Message History, Manage Channels |
| Anti-nuke | View Audit Log, Ban Members, Kick Members, Manage Roles, Manage Channels, Manage Webhooks, Manage Server, Manage Expressions |
| Raid guard | Manage Channels, plus the **Server Members Intent** enabled by the person who runs Damselette |
| Everything | View Channels, Send Messages, Embed Links, Read Message History |

The **Server Members Intent** is a switch in the Discord Developer Portal, not a server permission. Without it Damselette cannot see members joining, so join-flood detection stays silent. Everything else in the table is a normal channel or server permission.

## Role position

Permissions are not enough on their own. Damselette's role must sit **above** any role it needs to manage, and above the highest role of any member it moderates. Place it at the top of the role list for the best results.

## Command reference

The table below is generated from the command reference, so it is always up to date.

{{permissions-table}}
