---
title: FAQ
description: Quick answers to common questions.
group: Reference
---

# Frequently asked questions

## Why doesn't a command show up for me?

Discord hides commands from members who lack the required permission. Check the command's page for what you need. Server admins can also restrict commands per role in **Server Settings → Integrations → Damselette**.

## Damselette says my role isn't high enough.

Move Damselette's role up in **Server Settings → Roles**. It can only act on members and roles that sit below it. For the best experience put it at the very top.

## Will Damselette ban people by itself?

No. Anti-nuke rolls back damage and, if you keep **quarantine** on, temporarily removes the offender's powerful roles. A ban, kick or role strip only happens after an administrator approves it.

## Who can change anti-nuke settings?

Only the server owner. Administrators can view the status and lists. This protects you if an admin account is compromised.

## A raid flooded my server. What now?

Press **Lock the server down** in the alert Damselette posts. Everyone loses the ability to post in text channels while your staff roles keep talking normally, and the lockdown lifts itself when the timer runs out — or immediately with `/antinuke raid lock duration:off`. Nobody is banned by this; see the [Raid guard](#/docs/antinuke).

## A trusted moderator keeps tripping anti-nuke.

Add their role with `/antinuke staffrole add` to double their limits, give them `/antinuke relax` for a temporary boost during a cleanup, or raise a limit with `/antinuke limit`. As a last resort, `/antinuke whitelist add` makes them fully trusted.

## Can I bring a banned user back?

Yes. Use `/unban` with their Discord user ID. They can rejoin with a new invite.

## What is the difference between `/ban`, `/softban` and `/kick`?

- `/kick` removes someone, who may rejoin freely.
- `/softban` bans and immediately unbans, wiping their last seven days of messages, and they may rejoin.
- `/ban` keeps them out until you unban them.

## Why were some messages not deleted by `/purge`?

Discord only allows bulk deleting messages that are less than 14 days old, and `/purge` looks at the 100 most recent messages.

## A ticket transcript is missing message text.

Transcripts need Damselette to be able to read message content. If text is missing, the bot's message content access may be disabled. Contact the person who manages Damselette for your community.

## Can members open more than one ticket?

By default each member can have one open ticket. Raise the limit with the `max_open` option of `/ticket setup`, up to 10.

## Does Damselette store my data?

Damselette keeps what it needs to function for your server: its settings, moderation cases, tickets and anti-nuke records.

## Something is wrong. Where can I get help?

Check the relevant page of these docs first. If you still need a hand, reach out through the support link on the home page when one is available.
