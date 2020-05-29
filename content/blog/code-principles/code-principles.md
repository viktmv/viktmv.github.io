---
title: code-principles
date: "2020-05-29T14:15:56"
tags: "programming, coding, javascript"
---

Recently I've been trying to compile and formulate a list of principles and values that are important to me, both in private life and in my career as software developer.  

My motivation here is quite simple. I think it's incredibly beneficial to write your thoughts down. This allows you to crystallize ideas inside your head into something concrete and make them clearer. It allows you to understand yourself better.

In this post I'll try to summarize the principles and rules I try to follow when writing code. This list is obviously not complete, and will be expanded as I re-evaluate new ideas.  

So here goes, my 6 principles of writing good quality code:
* **Make it work**
* **Clarity / Readability**
* **Simplicity**
* **Efficiency**
* **Refactoring**
* **Plan broadly, improvise the details**


### Make it work
This is mostly self-explanatory. Code should accomplish the goal it was written for.
Be it a business problem, or a more technical matter - code should work, and work well.

### Clarity / Readability
Code should be clear and readable. Ever looked at the code and thought _"What the hell is going on here?"_  

I think sometimes the problem is that it's really tempting to be smart and clever. To give your ego a little boost by writing really ingenious code that, to untrained eye, looks like a complete gibberish. While code like this can work, and work well, it completely obfuscates the meaning of the things you wanted to accomplish in the first place. This is not desirable.

Junior developer looking at my code should be able to understand the general sense of what is going on.

### Simplicity (Less-is-More)
While readable and clear, code should also be simple. That means not using complex data structures where something basic would suffice, not going for obscure patterns, and not trying to be overly clever with implementations.

Less is more. Unless it interferes with other principles, i.e. Readability

### Efficiency
Code should not only work, but work well.

That means there should be a conscious effort to make it efficient.
DB query that works, is easy to read, but takes a gazillion seconds to run is not what I'm striving for.

### Refactoring
Writing code is a multi-step process. First, I make it work. After that, I refactor.

While making it work reaches the main goal (solves a problem), it doesn't satisfy other goals.
To make code clear, simple, and efficient - you have to think and work on it some more. It's not just write-ship-rinse-repeat cycle.  

First implementation is always just a first draft. Drafts are meant to be re-written.

### Plan broadly, improvise the details
_Weeks of coding can save you hours of planning_ ©  

Start by thinking about the problem you want to solve first. Consider some approaches you can take, constrains that you might have, broad acrhitecture, general timelines etc.

But don't go into too much details just yet. It's like wire-framing with thick sharpie, you don't wanna get stuck over small details at this point.

Implementation details are best improvised, just because there's a huge possibility that they're gonna change either way.  Unexpected things come up, requirements change, refactoring might discover better approaches, life happens.

Meticulously planning every single details ahead of time doesn't really work in real life. This is why we have Agile. Sketching things as you go is a perfectly valid approach.
***

That's pretty much it. However, I do want to emphasize that formulating your own principles is always an on-going process. But the good thing is that you can use them as sort of a moral compass in your day-to-day decision making process.

It helps a lot to have something you can come back to in order to reflect on what motivates you and what you value in your craft.
