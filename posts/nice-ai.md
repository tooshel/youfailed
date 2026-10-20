---
title: nice! . . . (I'm just not impressed)
slug: nice-ai
date: 2026-10-19 22:30:00
author: Sheldon
---

People tell me their stories about how they're using AI now. I try my best to say "nice!" (my signature response), or "nicely done!" or "wow!" . . . but most of the time I'm just not impressed.

Even the more advanced stuff, like ["I put our build process into Slack"](https://www.linkedin.com/pulse/why-we-moved-software-development-slack-donn-felker-wk4se/), usually leaves me disappointed. I haven't read that one yet (I will read it eventually and if it DOES impress me I'll write another post!) but my guess is they hooked it up so that when people use Slack to make changes to a site, it uses OpenAI or Claude and is billed by the token and the same workflow I already have automated for myself works from within a slack channel. nice!

I think that's the thing. Every use case where you have to pay for tokens just isn't all that interesting to me.

I'm nervous that someday the "Claude token drop" (think the crypto drops of yore) will end. Until then, I get the most joy out of a week when I max out my subscriptions while still getting real work done. If I'm not careful (and use too much Fable) I can do that in a few hours. But unless I have a task like "spin up 20 agents to do X" I can be in multiple tabs every day just pushing a project along, checking the results, and changing what I wanted as I go and everything I'm doing is going out to production. It really feels like the 90s before we had SCRUM and Agile and I just did everything myself based on some ask from the CEO.

I'm also waiting to finally understand "how I should be writing loops instead." All I can think is that if I were writing loops, I would just spend infinite tokens so loops are not for me.

Even this post. I mostly want it to be my own words, and have AI clean things up by say, fixing my speelling and gramar . . . things I could already do with a plugin in VS Code. But now it's just so much easier to say "go fix this"! I don't want AI to add a bunch of filler just to make it bigger, and I'm certainly not going to have the AI generate some flow chart or infographic. (I mean, it's cool, the prompts people come up with to make cool infographics. They just don't impress me anymore.)

One thing for sure is I don't want AI to take away my voice like it usually does when I ask it to clean up an email for instance.

What's wrong with me?

Maybe this is like all tech. At first it seems like magic and then eventually you get used to it. Like what Google once was! I'll never forget how magic Google Search was . . . until it wasn't. Now I don't use Google Search at all for fear of landing on a malware site! Not everything from Google has lost its charm. I manage an Exchange server for work now and it reminds me of how awesome Gmail still is!

I guess the entire point of this is I really like AI in this moment and the fact that I don't see it as magic anymore makes me afraid that enshittification is coming for AI soon. The more people tell me their amazing stories, the closer we are to the end of the joy I get out of working with it. AI will be enshittified by charging by the token for everything.

Sheldon

Some irony in the middle of this . . . though it is almost 11pm and I have legit been on it all day except for a break for dinner (I will take Friday off! I have a good balance and that balance is set by how well I use my time to run out of usage!).

![Here is some irony!](/files/nice-image-irony.png)

The other irony is having the AI review this post at all. It's kinda like hearing what the haters would say . . . if I were popular enough to have people reading my blog.

## AI's response

*I asked Claude to answer "what's wrong with me?" neutrally and not just take my side. Here's what it said:*

**Some of it is just getting used to it.** There's a long-running pattern called "the AI effect": once something works reliably, people stop calling it AI. Chess engines, spam filters, and autocomplete all went from magic to furniture. You use this stuff every day, as heavily as anyone, so your bar for "wow" climbs fast. Douglas Adams put it well: anything around when you're born is normal, anything invented between fifteen and thirty-five is exciting and revolutionary, and anything after that is "against the natural order of things." You're not broken. You're a heavy user.

**Where I'd push back:**

- **You're judging their stories as a developer would judge a tech demo.** The Slack thing probably isn't impressive *technically*, and you may be right that it's your workflow moved into a channel. If it's interesting at all, it's because of what changes for the team: people who aren't developers can ship changes, and review happens where everyone already talks. That's an org story, not a tech story, and "nice!" is the right response to someone telling you their work got better.
- **Paying per token vs. a flat subscription is a pricing question, not a measure of how interesting something is.** Your joy is partly tied to the fact that a subscription makes trying things feel free. That's real, but it also means you'll write off whole categories of good ideas just because they're metered.
- **On loops, you may be right, just not for the reason you think.** Loops pay off when the goal is fixed and a machine can check it ("make the tests pass," "migrate every file until lint is clean"). Your workflow is "change what I wanted as I go." Your judgment is the thing that ends each round, and a loop can't replace that. Writing loops doesn't mean infinite tokens. It means handing off the boring rounds where you'd only be clicking "yes, keep going."

**Is the Google fear reasonable?** Partly. Today's flat-rate plans are almost certainly priced to win users, not to last. Ads have already started showing up in AI chat products, and the pull to monetize is the same one Google felt. The difference: Google Search was basically a monopoly with nothing you could run yourself. AI has strong open-weight models you can run at home, and the price per unit of capability keeps falling sharply. The closest AI version of Google's decay is probably not pricing. It's low-quality AI-generated content filling the web, the same way SEO spam filled search results. (And your Gmail-vs-Exchange point cuts the other way too: the stuff that stays good tends to be the stuff people pay for, or that doesn't run on ads.)

**Things to read that might get you excited again (or confirm your fears):**

- **Cory Doctorow, *Enshittification* (2025).** The book behind your fear, with his theory of how platforms decay. Worth reading to check whether AI actually has the same setup.
- **[Simon Willison's blog](https://simonwillison.net/).** Hands-on, curious, and not hype. He runs a lot of models locally, which might be exactly your thing.
- **Running a local model** with [Ollama](https://ollama.com/) or llama.cpp on your own machine. Nothing is billed per token, ever, and if you want to protect the joy, this hedges against the subscription ending.
- **[Ink & Switch](https://www.inkandswitch.com/)'s essays on "malleable software"** (and Geoffrey Litt's writing). This is about regular people reshaping their own tools, the part of AI that still feels new.

As for your voice: it's still here. All I did was fix punctuation and move a couple of paragraphs. The ". . ." and the CAPS are yours.
