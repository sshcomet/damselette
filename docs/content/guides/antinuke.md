---
title: Anti-nuke
description: Automatic rollback and admin-approved punishment against raids and rogue staff.
group: Systems
---

# Anti-nuke

Anti-nuke protects your server from **mass destruction**: someone deleting every channel, banning your members, spamming roles or handing out admin. It reacts in seconds, **undoes the damage** and then lets your administrators decide what happens to the offender.

> [!NOTE]
> Damselette **never bans, kicks or strips anyone on its own**. Anti-nuke rolls back and asks. A human always makes the final call.

Anti-nuke is **on by default** on every server. Commands are listed under [Server Admin](#/commands/antinuke).

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

## Who can change settings

Only the **server owner** can change anti-nuke settings. Administrators can view `/antinuke status` and the lists. This stops a hijacked admin account from disabling protection or whitelisting itself.

## Make sure it works

Run `/antinuke status` after setup. It verifies the permissions below and warns you if a powerful role sits above Damselette.

- **View Audit Log** is required. Without it nothing can be detected.
- **Ban Members**, **Kick Members**, **Manage Roles**, **Manage Channels**, **Manage Webhooks**, **Manage Server** and **Manage Expressions** (or simply Administrator).
- Damselette's role should be at the **very top** of your role list, so it can restore and punish.

Finally, set a log channel with [`/antinuke logchannel`](#/commands/antinuke) so approval requests land where your admins will see them.
