---
title: 5 Ways Dewy Will Help Your Move To Drupal 8
---
Drupal 8 continues to mature and the possibility for large Drupal 7 organizations to make the jump comfortably is becoming more real. Having survived upgrading hundreds of sites for a large higher-ed institution from Drupal 5 to Drupal 7, I learned the biggest pain points that slowed the whole migration down:

* Not knowing all the modules we depended on

    Identifying all the modules we actually used on our environment and what sites used them was essential to figuring out what upgrade and migration paths we needed to plan for, as well as determining what sites could be migrated together. Unfortunately it was an extremely time consuming process to document. Even worse, by the time we had a full understanding of our environment, there was no guarantee our site admins hadn't already changed their sites.

* Having sites with different, outdated modules versions

    To make core upgrades and content migration the least painful they can be, it was important to get all sites onto the latest supported versions of their modules. But doing these module upgrades was made even more difficult than we anticipated because we had many sites running different versions of the same module, meaning an upgrade to one site may not have all the same steps as that same module's upgrade on another site.

* Difficulty reaching out to the users we scheduled for moves

    Once we had a sizable group of sites using only modules and content we had upgrade paths for, it was time to move the sites. Contacting the admins of these sites to confirm their move dates and to let them know of possible changes and disruption was a necessity. The time spent figuring out what the email addresses actually were of our admins were was frustrating.

* Migrating more stuff than we needed to

    We spent time moving sites we later identified weren't really in use at all and had no relevance to the digital strategy of the institution. The migration was long enough without spending time moving sites that no one cared about.

So how can Dewy help?

### 1. Spot sites with different module versions and pending upgrades

Glancing through the modules list of all the sites we are looking to upgrade we can spot what modules are using the same version across our sites and what modules have multiple versions running.

![Module versions](/img/posts/module-versions.gif)

We can see what modules have new versions to be updated to and what sites need those updates.

![Module updates](/img/posts/module-updates.gif)

### 2. Find what modules aren't essential to your Drupal environment

There’s likely been a lot of modules made available to sites where the sites aren’t actually use any more. It’s easy to find modules that see little to no usage rates across our environment.

![Module usage](/img/posts/module-usage.gif)

### 3. Hunt down abandoned modules

There may be modules that are enabled on our sites that actually aren’t doing anything. We can take a look at webforms sites and find what what sites enable the module, but don’t actually have any webform content.

![Module usage](/img/posts/sites-no-webforms.gif)

### 4. Identify what sites that don't need to be moved at all

We can quickly check for sites that are better off being deprovisioned on our environment than upgraded to Drupal 8. Choose what factors matter to you. If the site is in maintenance mode, but hasn’t been edited in months, that’s a good sign that the site has been abandoned.

![Module usage](/img/posts/sites-abandoned.gif)

Sites that haven’t been logged into in the past year and are receiving nearly no traffic are probably good candidates for deprovisioning instead of a time consuming Drupal 8 migration.

![Module usage](/img/posts/sites-no-visitors.gif)

### 5. Organize what sites will be moved and what admins to contact

Taking a look through our sites, we can identify which ones are entirely on the latest versions of their modules and have no database updates pending. Tag them for upgrade so that we can refer to this list throughout the upgrade process

![Module usage](/img/posts/sites-to-upgrade.gif)