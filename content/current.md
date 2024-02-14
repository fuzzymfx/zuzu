---
title: "Current shenanigans"
---
<style>
 .image{
 justify-content: center;
 align-items: center;
 display: flex;
 flex-direction: column;
 }
</style>

##### Current, 2024

[Here's what I am reading and writing these days](/reading.html)

Happy New Year, muchachos! I hope you had a good one. I just returned to Bangalore after a much-needed break in my hometown. Leaving home and returning to the city was a bit of a bummer, but such is life! The dreaded omicron variant is wreaking havoc in the city. I am starting a new career at RadiusAI as a Software Engineer, and I am pretty stoked :D

At Radius AI I am involved in building an async uptime monitoring service using Rust, and also a concurrent heartbeat service in Python. I will update this page with more details soon.

Here's an improved version of Llama Index's sub-querying engine used to generate SQL from Natural Language: [Neak](/blog/neak.html).

Coming onto Dough: a rich, modular, and customisable content generator, crafted in Rust, [here's everything](https://anubhavp.dev/blog/dough.html) you need to know.
This is a breakdown of the tasks I was working on:

v2:

- Improving the rendering engine:
  - ~~Add a refresh feature while rendering slides~~
    - Hot Module Reload( FIX )
  - ~~Add support for rendering **nested syntax**~~
  - Add support for the maximum width and height of the terminal. Write a word wrapper.
  - ~~Address the color storage issue for multiline elements, ensuring ANSI escape sequences are properly stripped: Refine color correction post-alignment~~
  - Enhance rendering for complex markdown elements like links within headings or lists.
    - ~~lists.~~
    - blockquotes.
  - Provide comprehensive support for common Markdown elements.
    - ~~Improve the rendering of thematic breaks~~
  - ~~Improve the design language.~~
  - Image support for terminals with image capabilities is pending. *(Kitty, iTerm2, etc.)*
- ~~Syntax Highlighting in code blocks~~
  - ~~Improve the performance of syntax highlighting. The current implementation is CPU intensive. Use a different library for syntax highlighting, or parallel threads to improve performance.~~
- ~~Custom text alignment: A regex match for individual text alignment~~
  - ~~Improve the alignment of segments of text.~~
- ~~Implement running code blocks on separate threads and displaying results in the current console.~~

I am done with most of what I had planned for Dough. Check out the entire [TODO list here](https://github.com/fuzzymfx/dough/blob/main/README.md#contributing). I want peers to contribute to the pending issues making this a more robust open-source project.

**Feb**

On a personal trajectory, [Srijan](https://injuly.in) and I have identified a pain point in the developer/ consumer tooling space. We are working on a solution to solve it. We are still in the early stages of the product, and I will be sharing more details soon. The codename for the project is *'Hoid'*. Hoid has a lot of moving parts. I am focused on the market research now. I believe that tech has become a commodity. There isn't anything that you cannot build using tech anymore. Money is in solving the right set of problems.

To give a sneak into Hoid, here are some of the things that I am working on:

- content recommendation engine
- search engine using vectors
- content aggregation
- bookmarks, and TL;DR

Meanwhile, I am exploring esoteric programming languages and also planning to build a distributed file system in Rust.

I stumbled upon [Substack](https://substack.com/), a platform for independent writers. I will be writing on substack as well. This **does not change** the fact that this will still be my primary blog.

<div id="substack-feed-embed"></div>
<script>
  window.SubstackFeedWidget = {
    substackUrl: "fuzzymf.substack.com",
    posts: 3,
    hidden: ["image"]
  };
</script>
<script src="https://substackapi.com/embeds/feed.js" async></script>

Feel free to check out whatever [else I have written](https://fuzzymf.substack.com) and [subscribe to my newsletter](https://fuzzymf.substack.com/subscribe) to get notifications about new posts.

---

[The past year](/blog/23.html)
