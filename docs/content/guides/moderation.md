---
title: Moderation
description: How Damselette's moderation tools, cases and safety checks work.
group: Systems
---

# Moderation

Damselette gives your team everything needed to handle problems calmly: warnings, timeouts, kicks, bans, channel controls and member management. Every command shares the same safety rules and the same record keeping, so the experience is consistent whichever tool you reach for.

See the [Moderation commands](#/commands/moderation) for syntax and options.

## Cases

Most moderation actions create a **case**: a numbered record containing the type, the member, the moderator who acted, the reason and, where relevant, the duration. Case numbers count up separately in each server, starting at 1.

| Case type | Created by |
|---|---|
| `WARN` | `/warn` |
| `TIMEOUT` / `UNTIMEOUT` | `/timeout`, `/untimeout` |
| `KICK` | `/kick` |
| `BAN` / `SOFTBAN` / `UNBAN` | `/ban`, `/softban`, `/unban` |
| `VOICEKICK` | `/voicekick` |
| `LOCK` / `UNLOCK` | `/lock`, `/unlock` |
| `PURGE` | `/purge` |
| `ANTINUKE` | A punishment approved by an administrator through [anti-nuke](#/docs/antinuke) |

If you set a mod-log channel with [`/config modlog`](#/commands/config), each new case is also posted there as an embed. Without one, cases are still stored and can be reviewed with `/history`.

## Reviewing a member

- `/warnings` shows a member's **active** warnings.
- `/history` shows **everything**, including removed warnings, and works for users who have already left the server.
- `/delwarn` removes one warning and `/clearwarnings` removes them all. Removed warnings are never erased; they stay in `/history` marked as removed, so you always have an audit trail.

## Notifying members

When you warn, time out, kick, ban or softban someone, Damselette first sends them a direct message with the action and your reason. If the member has direct messages turned off, the action still goes ahead.

> [!TIP]
> Write reasons as if the member will read them, because they will. Clear reasons reduce appeals.

## Safety checks

To stop accidents and abuse, Damselette checks role order before it touches a member. An action is refused when:

- you target **yourself**, **the server owner** or **Damselette**;
- the target's highest role is **equal to or above yours** (the server owner is exempt from this rule);
- the target's highest role is **equal to or above Damselette's**.

Role assignment with `/role` goes further and also checks the role being handed out, so nobody can grant a role higher than their own.

## Channel control

- `/lock` and `/unlock` toggle the `@everyone` permission to send messages in a text channel. Roles that were explicitly allowed to speak, like your moderators, keep their access.
- `/slowmode` sets a delay between messages from 0 seconds (off) up to 6 hours.
- `/purge` bulk deletes up to 100 recent messages, optionally from a single user. Discord prevents deleting messages older than 14 days in bulk, so those are skipped.

## Member management

- `/nickname` changes or resets nicknames.
- `/role add` and `/role remove` manage roles.
- `/voicekick` disconnects someone from voice without removing them from the server.

## Troubleshooting

| You see | What to do |
|---|---|
| "Your highest role must be above the target's highest role." | Move your role above the member's, or ask someone with a higher role. |
| "My highest role must be above the target's highest role." | Drag Damselette's role higher in **Server Settings → Roles**. |
| "I was unable to ban that user." | Check that Damselette has **Ban Members**. |
| "I cannot timeout that member." | Discord blocks timeouts on administrators and the owner. |
| Commands don't appear for you | You lack the permission the command needs. See [Permissions](#/docs/permissions). |
