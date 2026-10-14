---
title: Tickets
description: Run a private support desk with one-click tickets and transcripts.
group: Systems
---

# Tickets

The ticket system gives your members a private place to talk to staff. Nobody has to learn a command: they click a button, describe their problem and a private channel appears. When the issue is resolved, a transcript is delivered and the channel is cleaned up.

The staff-side commands are listed under [Ticket commands](#/commands/ticket).

## Setting it up

Prepare three things in your server:

1. A **text channel** for the panel, such as `#support`.
2. A **category** where ticket channels will be created.
3. A **support role** for the people who will answer tickets.

Optionally add a **log channel** for events and transcripts, then run [`/ticket setup`](#/commands/ticket). Damselette posts the panel and saves your choices. Run the command again whenever you want to move the panel or change something.

You can also choose how many tickets a member may have open at once (`max_open`, from 1 to 10, default 1).

## How a ticket works

1. A member clicks **Open Ticket** on the panel.
2. A form asks for a **subject** (up to 100 characters) and a **description** (up to 1000 characters).
3. Damselette creates a private channel named like `ticket-0007`, visible only to the member, the support role and Damselette.
4. The member and the support role are mentioned, and an embed shows the request with **Claim** and **Resolve & Close** buttons.
5. Staff talk with the member inside the channel.

If a member already has the maximum number of open tickets, Damselette links them to their existing one instead of creating another.

## Who counts as staff

A member is **ticket staff** if they have **Administrator**, **Manage Server** or the **support role** from setup. Only staff can claim, resolve, list, view or manage tickets.

## Claiming

Staff press **Claim** to show the rest of the team that they are handling the ticket. The button becomes **Claimed** and the claimer is recorded.

## Adding and removing people

Use `/ticket add` to bring another member into the channel, for instance a senior moderator, and `/ticket remove` to take them out again. The person who opened the ticket can never be removed.

## Resolving a ticket

Press **Resolve & Close** and optionally write resolution notes, or run `/ticket close`. Damselette then:

1. Marks the ticket as resolved.
2. Builds a **text transcript** of the conversation, including attachment links.
3. Sends the transcript and resolution to the **log channel** and to the **member's direct messages**.
4. Deletes the channel after five seconds.

> [!NOTE]
> Readable transcripts depend on Damselette being able to read message content. Without it, message text may be missing.

## Reviewing tickets

- `/ticket list` shows recent tickets filtered by `open`, `resolved`, `closed` or `all`.
- `/ticket view` shows one ticket in full: subject, description, owner, claimer, timestamps and resolution.

## Permissions needed

Damselette needs **View Channels**, **Send Messages**, **Embed Links**, **Attach Files**, **Read Message History**, and **Manage Channels**. Without Manage Channels it cannot create or delete ticket channels.
