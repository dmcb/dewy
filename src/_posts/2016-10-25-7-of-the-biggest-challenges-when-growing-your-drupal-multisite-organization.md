---
title: 7 Of The Biggest Challenges When Drupal Grows At Your Institution
description: Your central web team has empowered your higher-ed insitution's digital presence with Drupal. The units on campus can now take charge of their own sites while your team is still at the controls of your institution's digital strategy. But over time, issues will arise that if left unchecked, could pose significant risks to your institution. This is a list of some of the biggest challenges and how they can be managed.
---

You've built a Drupal distribution for your higher-ed institution: a theme, a base set of content types, views and the modules that drive them. Now you are provisioning sites for all the units on campus with your Drupal distribution. These units will administer their websites, creating content without relying on your centralized web team to continue to build everything. This is the power of Drupal and why your institution chose it. It empowers your campus to own their sites, while still allowing your central web team the ability to control the institution's digital presence that fits with a broader digital strategy.

But as your institution hums along with Drupal to everyone's great satisfaction, there are many issues that will arise over time. Without oversight, these issues could become significant risks weighing over your institution's digital presence.

### 1. Providing a consistent feature set

Your web team will likely look to provide your institution's Drupal sites with functionality beyond what ships with Drupal by default. News articles. Event listings. Photo galleries. Accordions. Having standard, repeatable functionality across your institution's sites will allow your administrators and content authors to build rich, beautiful content across your digital presence.

Much functionality can be built directly in the Drupal UI through CCK, Views, Panels and Display Suite. But unless it is exported to code, these features will have to be built manually on each and every website - an impossible task. Worse yet, if this functionality isn't in code, when a change or bug fix needs to be applied to them, it must be done on a per site basis.

#### Solutions

* [Put your functionality into code and modules](http://derekmcburney.com/blog/drupal-distros-that-scale-part-4/) so that it can be deployed to multiple sites at once and maintained in one location.
* Make sure the modules you create providing this functionality are tagged with version numbers just like any [Drupal.org module](https://www.drupal.org/project/project_module) so that you know what site has what version of what functionality in use.
* Keep modules across your sites using the same version if possible. This simplifies maintenance when every site has the exact same upgrade path for a module should an update be released, and provides a consistent user experience for all your site's users. Dewy can easily spot how many versions of the same module you are running across your environment.

![Version usage in Dewy](/img/posts/7-of-the-biggest-challenges-when-growing-your-drupal-multisite-organization/versions.gif)

### 2. Content that deviates from your digital strategy

With a distributed network of content authors accross the sites at your higher-ed institution, the content of your digital presence may begin to take on a form that may no longer resemble the intentions of your digital strategy. This is inevitable. Sites go stale. The organization changes. 

#### Solutions

* Determine what sites are the first tier of your institution and focus on the quality of content of those sites the most. These would be the sites that are most closely associated with the brand, and the sites that your users visit the most. [Google Analytics](https://www.drupal.org/project/google_analytics) or Dewy can help you determine what sites are most used at your institution.
* Sites that aren't on your first tier can be made more restricted. Possibilities include the amount of customization those second tier sites are entitled to so they have less opportunity to depart from the brand you've created, or a different theme that makes explicit to visitors that the institution doesn't take responsibility for this content.
* Regular content audits of your first tier of sites. Dewy can help you keep track of what's considered a first tier site via the site tagging system.
* Use Dewy to spot outdated and sensitive content across all your sites. An old brand motto? References to the institution's previous President? Dewy can parse all your content to find the sites with those references.

![Content lookup in Dewy](/img/posts/7-of-the-biggest-challenges-when-growing-your-drupal-multisite-organization/content.gif)

### 3. Site sprawl

Provisioning sites is easy. Either your team will approach a unit on campus to grant them a Drupal site, or they will come looking to request one from you. To physically spin up a new site, you might be using [Pantheon](http://pantheon.io). You may have created a Drupal distribution, or Drush make file that you apply to a blank Drupal site. You may have a script that copies a database and files from a template Drupal site in order to spin up a new site. [Or any of the combination of these, really](http://derekmcburney.com/blog/drupal-distros-that-scale-part-2/).

What's much more difficult to deal with is site *deprovisioning*. The issues with having too many sites at your insitution is obvious - more sites that need security updates, more content that can go out of date, more load on your servers, databases on your server, etc. If you want your institution to stay on curve and be nimble with a digital strategy, carrying less sites along for the ride makes things much easier.

#### Solutions

* Create rules around what is considered an inactive site that will be deprovisioned by your team and communicate these rules transparently to your users when you create a site for them. A good rule is that an administrator of the site must log in to the site every X months to indicate that the site hasn't been abandoned.
* Look for sites that have little to no traffic, are seldom modified, haven't been signed on to in a long time or are in maintenance mode. Dewy can help you define these rules and find sites that match your criteria quickly.

![Number of versions](/img/posts/7-of-the-biggest-challenges-when-growing-your-drupal-multisite-organization/stale-sites.gif)

### 4. Module sprawl

Like site sprawl, having too many modules on your environment makes things difficult. Every module on a site slows down the execution of that site. There are more hooks fired and more parsing of the file system.

More importantly, every module on a site also slows down your web team. Security updates can't go ignored and more modules on sites means more updates that need to be applied on those sites.

#### Solutions

* Avoid adding modules to your environment only because a site administrator is requesting it. Instead determine what their goal is, because what they may be looking for may not require the module they are requesting.
* Create a review process so that when a request for a new module is made by one of your site admins, it is compared against existing offerings. For example, the [User One](https://www.drupal.org/project/userone) module may not be needed if you are already providing the [User Protect](https://www.drupal.org/project/userprotect) module.
* Deprovision modules that may no longer be in use, or only exist for sites that are edge cases in your digital strategy. Dewy can help spot modules that are no longer in use.

![Module utilization in Dewy](/img/posts/7-of-the-biggest-challenges-when-growing-your-drupal-multisite-organization/utilization.gif)

### 5. User deprovisioning

You will likely find at your institution that there are many users who have administrative or authoring roles for multiple sites, possibly across several units on campus. You will also find that many of these users leave their roles or end their careers at your institution during the life of the web site. This exposes a risk to your web presence as those who are no longer permitted to have access to update your web sites actually still do. Depending on how many sites

#### Solutions

* Use [CAS](https://apereo.github.io/cas/) or another form of single sign-on with Drupal, so that terminating that user's privilege with your single sign-on service prevents that user from signing on to any of the Drupal sites they once had access to. If Drupal site permissions haven't been updated to reflect that the user may no longer be with the institution, and they are still set to have edit privileges on your sites, it will no longer matter because your single sign-on provider will fail the authentication before Drupal's permissions take over.
* Update that user's role across all sites they have access to. If the user is no longer with the institution, instead of deleting the account, block the account. [Account deletion can have unwanted side effects](https://www.drupal.org/node/1732920).
* Use Dewy to help find what sites that user is on.

![User lookup in Dewy](/img/posts/7-of-the-biggest-challenges-when-growing-your-drupal-multisite-organization/user-lookup.gif)

### 6. Sites that run away in size

Enforcing maximum file upload sizes for any given field, or site or environment wide is easy. Enforcing a total size for an entire website is difficult. And while diskspace is cheap, it is not always plentiful. At large higher-ed institutions there are always new initiatives finding evermore intensive ways of consuming what diskspace is available. So it's important to be responsible with your resources.

#### Solutions

* Write a script to periodically check the file size of your sites. This can be done by using the [du command](http://www.linfo.org/du.html) but involves knowing where the files and private files directories are for each site (the locations of these directories may be be changed by site administrators that have the permission to do so).
* Use Dewy to build a filter that shows exactly what sites are using a disk space amount that you aren't comfortable with.

![Site size lookup in Dewy](/img/posts/7-of-the-biggest-challenges-when-growing-your-drupal-multisite-organization/size-lookup.gif)

### 7. Security

Security matters and you don't need to be reminded why. In Drupal, it can be very difficult to keep up with all the security updates that are posted - cross site scripting this, request forgery that, the alerts are frequent and it can be time consuming to approach them with the rigor that may be required across your environment.

This problem is exacerbated by the more modules and sites you have, especially when there are lots of sites at your institution that may not always have official eyes on them. The last thing you want is for some dark corner of your digital presence to have actually been a giant Viagra ad for the past several years.

#### Solutions

* Follow [Drupal Security](https://twitter.com/drupalsecurity) on Twitter or view the [Drupal security advisories](https://www.drupal.org/security) page on a regular basis.
* Use the Update module to see what security updates are on your site. [Or better yet, don't](https://dewy.io/blog/stop-the-update-module-from-scaring-your-clients-and-users/).
* Use Dewy to quickly see all pending security and non-security updates across all your sites.

![Pending security updates in Dewy](/img/posts/7-of-the-biggest-challenges-when-growing-your-drupal-multisite-organization/security-updates.gif)
