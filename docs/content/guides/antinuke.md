---
title: Anti-nuke
description: Automatic rollback and admin-approved punishment against raids and rogue staff.
group: Systems
---

# Anti-nuke

Anti-nuke protects your server from **mass destruction**: someone deleting every channel, banning your members, spamming roles or handing out admin. It reacts in seconds, **undoes the damage** and then lets your administrators decide what happens to the offender.

Alongside it, the **raid guard** watches for floods of brand new accounts arriving and offers your administrators a one-click way to quiet the whole server down.

> [!NOTE]
> Damselette **never bans, kicks or strips anyone on its own**. Anti-nuke rolls back and asks. A human always makes the final call.

Anti-nuke is **on by default** on every server. Commands are listed under [Server Admin](#/commands/antinuke).

Two layers work together:

| Layer | Watches for | Responds by |
|---|---|---|
| **Anti-nuke** | Mass destruction in the audit log | Rolling the damage back, then asking an admin |
| **[Raid guard](#raid-guards)** | Floods of new accounts joining | Asking an admin, then locking the server down |

## How it works

1. **Detection.** Damselette watches your server's audit log. When someone who is not trusted goes over a limit, it counts as a breach.
2. **Rollback.** The damage is undone immediately.
3. **Quarantine** *(on by default).* The offender temporarily loses only the roles that carry powerful permissions, such as Administrator, Manage or Kick/Ban. A rogue moderator is stopped instantly without being banned.
4. **Approval request.** An **Approve / Dismiss** message is posted in your anti-nuke log channel (falling back to your mod-log or the system channel), and the server owner receives a copy by direct message.
5. **Decision.**
   - **Approve** applies your configured punishment (`ban`, `kick` or `strip` all roles) and logs a case.
   - **Dismiss** does nothing to the user and gives back any quarantined roles.

While a request is waiting (up to 12 hours), further protected actions by the same user are still undone as they happen. If nobody answers in time the request expires and the quarantined roles are returned.

### Who can approve

Only an **Administrator** or the server owner can press the buttons, with two safeguards: the offender can never approve their own case, and an admin cannot approve a punishment against someone whose top role is equal to or above theirs.

## What is protected

Each action has a limit inside a time window. Going **over** the limit triggers a breach, so with a limit of 2 the third action is the one that trips it.

| Protected action | Default limit |
|---|---|
| Channel deletes | 2 per 15 s |
| Channel creates | 3 per 15 s |
| Role deletes | 2 per 15 s |
| Role creates | 3 per 15 s |
| Member bans | 5 per 30 s |
| Member kicks | 5 per 30 s |
| Webhook creates | 2 per 15 s |
| Emoji deletes | 3 per 15 s |
| Server name, icon or vanity URL changes | 2 per 60 s |
| Granting Manage Server, Roles, Channels, Webhooks, Kick or Ban to roles or members | 3 per 60 s |
| Granting **Administrator** | Never allowed |
| Member prunes | Never allowed |
| Adding a non-whitelisted bot | Never allowed |

Normal staff work, such as a few bans or giving someone a moderator role, stays comfortably below these numbers. Change any of them with [`/antinuke limit`](#/commands/antinuke).

### Combined score

Doing a little of everything should not slip past. Each action adds its count divided by its limit, and when two or more **different** actions reach a total of **2.0** it counts as a breach. For example, two role deletes plus two bans plus two channel deletes would trigger it even though each stays under its own limit.

## What rollback restores

| Damage | Damselette's response |
|---|---|
| Deleted channels | Recreated with their category, position, topic and permissions. |
| Deleted roles | Recreated with their settings and permissions. |
| Channels, roles and webhooks created by the offender | Deleted. |
| Mass bans | Members are unbanned. |
| Unauthorised bots | Kicked from the server. |
| Deleted emoji | Restored. |
| Permission grants | Reverted. |
| Server name, icon or vanity changes | Reverted. |

> [!WARNING]
> Some things cannot be undone: kicked or pruned members must rejoin on their own, and role assignments that belonged to a deleted role cannot be restored.

## Staff-friendly limits

Strict defaults are great for strangers but frustrating for your own team, so you can give trusted people more room without turning protection off.

- **Staff roles.** [`/antinuke staffrole add`](#/commands/antinuke) gives members of a role **2×** the limits after they have been in the server for seven days. Actions that are never allowed stay never allowed.
- **Relax.** [`/antinuke relax @user 2h`](#/commands/antinuke) gives one person **3×** limits for up to 24 hours, perfect for a big cleanup. Use `off` to cancel.
- **Whitelist.** Whitelisted users and bots are ignored entirely. Whitelisting a bot also lets it be added.

The **server owner** is always trusted.

## Raid guard

A raid never touches the audit log. Nobody deletes a channel — a hundred fresh accounts simply arrive and start talking, which is why anti-nuke alone would never notice. The raid guard watches **joins** instead.

When `joins` brand new accounts arrive inside `windowSec`, Damselette posts a **Lock the server down / Dismiss** alert in the anti-nuke log channel and sends the server owner a direct message. It does not touch anybody until an Administrator presses a button.

| Choice | What happens |
|---|---|
| **Lock the server down** | `@everyone` loses **Send Messages**, **Send Messages in Threads**, **Add Reactions** and **Embed Links** in every text channel for the configured time. Nobody is banned, kicked or timed out. |
| **Dismiss** | Nothing at all. Members can carry on talking. |

Everything the lockdown changed is remembered, so when the timer ends — or when you run [`/antinuke raid lock duration:off`](#/commands/antinuke) — every channel is put back **exactly** how it was, including permissions it never touched. An approved lockdown is written to the mod log as a `LOCKDOWN` case.

### Your staff are never caught in it

- Members of a staff role, and anyone holding **Administrator**, are never counted as raid traffic when they join.
- A lockdown explicitly **allows** your staff roles to speak: the ones you set with `/antinuke staffrole add`, plus any role that can manage, ban, kick, moderate or delete messages. Moderators keep working while everyone else goes quiet.
- Voice channels, categories and threads are left alone entirely.
- Only Administrators can start or end a lockdown, and only the **server owner** can change the settings.

### Tuning it

| Setting | Default | Command |
|---|---|---|
| Detection | 10 accounts younger than 7 days, within 10 seconds | [`/antinuke raid threshold`](#/commands/antinuke) |
| Lockdown length | 30 minutes | [`/antinuke raid lockdown`](#/commands/antinuke) |
| Detection on or off | On | [`/antinuke raid mode`](#/commands/antinuke) |
| Lock or unlock by hand | — | [`/antinuke raid lock`](#/commands/antinuke) |
| What it is doing right now | — | [`/antinuke raid status`](#/commands/antinuke) |

Raise the threshold for a busy community, or lower it and the account age if you are a small server that cannot tell a raid from a normal busy evening.

> [!NOTE]
> Join detection needs the **Server Members Intent**, which is enabled by the person who runs Damselette in the Discord Developer Portal. See [Permissions](#/docs/permissions).

## Who can change settings

Only the **server owner** can change anti-nuke settings. Administrators can view `/antinuke status` and the lists. This stops a hijacked admin account from disabling protection or whitelisting itself.

## Make sure it works

Run `/antinuke status` after setup. It verifies the permissions below and warns you if a powerful role sits above Damselette.

- **View Audit Log** is required. Without it nothing can be detected.
- **Ban Members**, **Kick Members**, **Manage Roles**, **Manage Channels**, **Manage Webhooks**, **Manage Server** and **Manage Expressions** (or simply Administrator).
- Damselette's role should be at the **very top** of your role list, so it can restore and punish.

For the [raid guard](#raid-guards) you additionally need **Manage Channels** (or Administrator) to lock a server down, and the **Server Members Intent** turned on in the Developer Portal so Damselette can see members joining.

Finally, set a log channel with [`/antinuke logchannel`](#/commands/antinuke) so approval requests land where your admins will see them.
