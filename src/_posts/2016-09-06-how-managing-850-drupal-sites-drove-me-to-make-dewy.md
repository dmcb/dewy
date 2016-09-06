---
title: How Managing 850 Drupal Sites Drove Me To Make Dewy
description: Keeping an eye on a few Drupal sites manually is no big deal. But managing 850 Drupal sites for a higher-ed institution means spending countless hours writing scripts just to see what's going on. From this, Dewy was born.
---

I led the maintenance of 850 production Drupal sites (and hundreds more development and test sites) for a large higher-ed institution. It's one thing to maintain a few Drupal sites, but when you have 850 sites, each with different site administrators and content authors, it's very difficult to having any clue what's going on. You can't log in to all the sites, so you have to find a more automated, scalable way of peaking at your sites.

![One does not simply](/img/posts/one-does-not-simply.jpg)

When I started, our sites were in Drupal 4, and it was the pre-[Drush](http://www.drush.org) days. So we wrote bash scripts to grab MySQL connection strings from settings.php files, connect to databases, do queries and present the information in some sort of human readable way. It felt good to write these scripts. We were taking charge of our Drupal environment. But when another team meeting came and went with more seemingly innocuous questions raised such as "Hey, we need to do an upgrade of webforms, how many sites are on the old version of it?", to only be able to answer the questions hours later after writing and running another script, it stopped feeling so good.

![Bash, make it stop](/img/posts/bash.gif)

Drush came and it made script writing less awful. We could jump to writing queries without parsing settings.php files ourselves. Sometimes we could even get by using API calls and variable get commands and not even need queries at all to figure out what our sites were doing. But it was still a lot of time wasted, and it never felt like we really had a full awareness of how our sites were behaving.

So rather than continue to do the same monotonous yet time consuming script writing over and over again, I set out to build something new. A platform I could connect my Drupal sites to. A platform that knows everything going on with the sites I manage. That platform is **Dewy**. If Drush commands and bash scripts were a way to take a peak into my Drupal environment, Dewy is what opens the door wide open and lets you in. So how does it work?

### Filters
Once you load the Dewy module on to your sites and switch it on, your sites will report to Dewy. It doesn't matter whether your sites live on a server running under your desk or on a Pantheon environment, if your site can be seen on the web, it can be used with Dewy. Once your site is on Dewy, how can you make your bash scripts a thing of the past? Filters.

![Panels and Display Suite](/img/posts/sites-panels-and-ds.gif)

This is Dewy's killer feature and raison d'être. Dewy can filter through all your sites down to a list tailored to your query. Show me sites that have both Panels and Display Suite enabled. Show me sites that have no caching set. Show me what sites have more than 1000 nodes. No problem. Dewy turns all those random one-off bash scripts into a powerful and easy to use site filtering system. Which means:

* **No more bash scripting**
* **No more having to dive in to the Drupal database schema**
* **No more having to run the same queries across multiple environments**
* **No more figuring out how to output query results into something human readable**
* **No more waiting for scripts to execute**

And the best part (other than all that goodness I just mentioned) is that the flexibility of this filter system allows the building of queries for use cases I haven't even dreamed up yet.

### Discovery
If the filter system in Dewy is about finding what sites matter to you for a particular scenario, the main site view is about discovering what sites may also matter for scenarios you might not have been thinking about.

I built Dewy to find groups of sites that were relevant to the problems our team was trying to solve that day. *What sites are using excessive disk space?* *What sites are still using the old versions of Webforms and need an upgrade?* The list went on. But when I hooked up our sites to Dewy and listed them in a view that compared various metrics, something interesting happened - many sites on our environment that I hadn't thought about made themselves known.

![Site activity](/img/posts/sites-activity.gif)

I found sites that had health and activity metrics shockingly below the majority of sites elsewhere on our environment. Some of these sites were ones that literally hadn't been touched in years. These were the kind of sites our team always wanted to clean up but that were nearly impossible to find. And here they were, screaming to be cleaned up.

### Sound familiar?

So if any of these challenges hit a little too close to home during your Drupal site maintenance, Dewy is for you. Please follow along for updates, Dewy is coming soon!