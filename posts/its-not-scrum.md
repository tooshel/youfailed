---
title: I don't know what's next, but it's not scrum
slug: its-not-scrum
date: 2026-11-09 09:00:00
author: Sheldon
---

I had a meeting with a guy who works at a company (as a part-time team lead and developer) that sells . . . you know what, I don't even think it matters. The point is it's mostly a software company. There are somewhere around 60 people on the engineering team. I don't know if that counts infrastructure and QA, but he's on a team of 5 that works on one of the products, and there are similar-sized teams for the other products. His team doesn't handle deployments. I only know that because he was surprised that I'm on the dev team AND I deploy code.

## The parable of Twitter

I started by telling him "the parable of Twitter." Musk comes in, cuts half the company, and Twitter does fine. All the predictions just didn't come true. Sure, it got more racist (people who were banned for saying racist stuff were let back on, so there's no denying that), but generally speaking it didn't go down, the features stayed the same, and it worked as well as it ever worked. Eventually Musk got bored with it and now it's just . . . existing.

## How many could you cut?

So then I asked him how many people they could cut from the team now that they have AI. The stuff he was doing sounded really cool and very much about automating the process of creating software. He's automating PRs by collecting feedback from humans, and over time the humans have less and less to say. All those "norms" that people give feedback about but that were never written down are getting built into the codebase.

He told me he would fire ZERO. They need everyone and there's always more work than they could ever do. He talked about the rewrite (lol, OF COURSE there's a rewrite) and how new ideas come in faster than they can build them.

But he also told me that not everyone on the team uses AI. There was resistance even to how he was using AI to do reviews . . . but his system got so good that now the humans can't even find anything to nitpick.

## 8 points to 30

So we kept going, and he told me about the pressure to do more and more and more and how it was getting overwhelming. They went from 8 story points per person per sprint to over 30. I asked how they divide up the work between 5 people and how they don't step on each other's toes with PRs coming in that fast. He said the problem with going fast is humans and communication. They can only go so fast, and this is the max.

## Why are you still doing scrum?

That's when I asked him why they're still doing scrum. Why they even spend time pointing things. Do they actually "stick to the plan" every sprint? Do people wait until standup to bring up blockers? Many, many questions.

And then I sorta lost it.

"I LOATHE when someone brings up a blocker at standup. That's a horrible time! If you're blocked, get on Slack or Teams or whatever and ask someone right then. And while I'm at it, why do I need to tell everyone what I'm working on . . . isn't that what the board is for?? The only good thing about standup is having time to talk to humans. The rest is pointless."

At first he resisted everything I said. There was a point to the process, he said, and humans needed to sign off and approve things. But the more I opened up about what I really thought, the more he opened up too.

## Nobody needs to "sign off"

I told him: you need to care about the database. Make sure you have backups, make sure you can undo a deploy, be careful with migrations. But besides that, it's software. The design guy doesn't need to "sign off." If the design could use some updates, go update it. If we missed some accessibility, fix it. If the copy sounds like Claude wrote it, empower the writer to fix it and deploy those fixes. Don't let something sit as a PR for weeks, iterating over it and trying to push it forward, because someone still hasn't perfected the design.

"I don't know the answers, but I know that the way we've done it up till now is wrong. And it was probably wrong even before AI."

## Don't perfect the ticket

He started to come around and said, "Well, maybe then people work together to write the tickets and get the ACs just right."

I pushed back on that too. If you tell Claude exactly what to do, sure, it'll do it. But you're missing out on the magic! If you're vague, Claude will build something better and more functional than you thought possible. So instead of perfecting a ticket and handing it off to Claude, you have an idea, and then you either empower the stakeholder to iterate on their own . . . or you work with them and iterate together.

Instead of spending hours and hours perfecting a design or the wording or whatever, you have Claude make something and then, get this . . . you SEND A MESSAGE to the stakeholder and the designer with a screenshot and get feedback in real time. Or jump on a call and show them. This is something developers NEVER do, and it's embarrassing.

The worst developers are the ones who want all the details in the ticket. They don't understand the business or the problem they're trying to solve. We don't need that type of developer anymore.

## Blockers only

The more we talked, the more he came around. He told me, "Now that you bring it up, I also don't get why people bring up blockers at standup . . . it's usually just two people talking and no one else cares. And yeah, why not bring it up earlier!"

Then he said, "And it's so much worse. Some days we skip talking about what we're working on and have a 'blockers only' meeting!"

I laughed because I could totally see our Scrum Master (let's call him David) proposing that.

## What scrum is actually for

I should have asked him what he thought the point of scrum was. Instead I told him what I think it is.

The point of agile and scrum is to optimize for predictability. You start the sprint saying you're going to get XYZ done, and at the end of two weeks, you get XYZ done. That's what scrum is for. And you know what? Even before AI, that just led to a horrible waste of resources. Developers are conditioned to do the least possible and promise the least. Developers are conditioned not to question why anything is being done and to just do it, since it's not in their control to decide what to do. I think it leads to the worst developers and the slowest teams. Putting project managers between developers and stakeholders made developers ignorant of the real problems, and somehow we all just accepted it and went along.

After I said that, it was like a lightbulb went on. He was free to talk and share what he really thought.

## Half the team

He told me it was him and one other person doing the bulk of the work.

So I asked if he would cut the others. He punted. It wasn't his decision, he said, and he cares about them and doesn't want them to be out of work. Fair enough.

So I asked another way: if we plucked out half the team, would your team get faster or slower?

After an hour of REAL TALK, I think he agreed it would probably be faster.

## It's still exhausting

We also talked about how just because AI does the work doesn't mean it isn't exhausting. Sometimes you feel an overwhelming sense of dread just looking at the output and trying to think of what's next. You've got 10 windows open and you just cycle between them.

So no, I don't think anyone has this figured out. I know I don't. Again, I don't know what the future is, but one thing I do know is that it's not scrum.

Sheldon
