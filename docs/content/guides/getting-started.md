---
title: Getting started
description: Invite Damselette and configure it in a few minutes.
group: Start here
---

# Getting started

Setting up Damselette takes a few minutes. You will need the **Manage Server** permission to add the bot and configure it.

## 1. Invite Damselette

Press the **Invite** button in the top bar or on the [home page](#/) to add Damselette to your server, then approve the permissions it asks for.

> [!NOTE]
> The simplest option is to grant **Administrator**. If you prefer to be selective, the [Permissions](#/docs/permissions) page lists exactly what each feature needs.

## 2. Move Damselette's role to the top

Discord only lets a bot act on members and roles that sit **below** its own role. Open **Server Settings → Roles** and drag the Damselette role as high as you can, ideally to the very top.

This matters most for [anti-nuke](#/docs/antinuke), which has to restore deleted roles and channels and punish rogue accounts, and for moderation commands, which can only target members below the bot.

## 3. Choose a mod-log channel

Pick or create a private channel for your moderators and run:

```text
/config modlog channel:#mod-log
```

From now on every moderation case is posted there with its number, user, moderator and reason.

## 4. Set up tickets (optional)

If you want a support desk, create a category for tickets, a support role and (optionally) a log channel, then run:

```text
/ticket setup panel_channel:#support category:Tickets support_role:@Support log_channel:#ticket-logs
```

Damselette posts an **Open Ticket** panel in `#support`. See the [Tickets guide](#/docs/tickets) for the full flow.

## 5. Check anti-nuke

Anti-nuke is **on by default**. Tell it where to send alerts, then check that everything is healthy:

```text
/antinuke logchannel channel:#security-alerts
/antinuke status
```

`/antinuke status` tells you if a permission is missing or if a powerful role sits above Damselette. The [Anti-nuke guide](#/docs/antinuke) explains how the protection behaves and how to tune it.

The same page also covers the **raid guard**, which watches for floods of brand new accounts joining. It is on by default and alerts your administrators without touching anyone; approving that alert locks the server down for everyone except your staff. It needs **Manage Channels** and the Server Members Intent to be enabled by whoever runs Damselette.

> [!WARNING]
> Only the **server owner** can change anti-nuke settings. This is intentional, so a compromised administrator cannot turn protection off.

## 6. Review your settings

```text
/config view
```

shows the mod log and ticket settings in one place. Then explore the [command reference](#/commands) to see everything Damselette can do.
