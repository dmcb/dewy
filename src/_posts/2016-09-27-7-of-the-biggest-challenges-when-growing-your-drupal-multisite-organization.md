---
title: 7 Of The Biggest Challenges When Drupal Grows At Your Institution
description: Your central web team has empowered your higher-ed insitution's digital presence with Drupal. The units on campus can now take charge of their own sites while your team is still at the controls of your institution's digital strategy. But over time, issues will arise that if left unchecked, could pose significant risks to your institution. This is a list of some of the biggest challenges and how they can be managed.
---

You've built a Drupal distribution for your higher-ed institution: a theme, a base set of content types, views and the modules that drive them. Now you are provisioning sites for all the units on campus with your Drupal distribution. These units will administer their websites, creating content without relying on your centralized web team to continue to build everything. This is the power of Drupal and why your institution chose it. It empowers your campus to own their sites, while still allowing your central web team the ability to control the institution's digital presence that fits with a broader digital strategy.

Your institution hums along with Drupal to everyone's great satistfaction, but there are many issues that will arise over time. Without oversight, these issues could become significant risks weighing over your institution's digital presence.

### 1. Providing a consistent feature set

#### The Challenge

Your web team will likely look to provide your institution's Drupal sites with functionality beyond what ships with Drupal by default. News articles. Event listings. Photo galleries. Accordions. Having standard, repeatable functionality across your institution's sites will allow your administrators and content authors to build rich, beautiful content across your digital presence.

Much functionality can be built directly in the Drupal UI through CCK, Views, Panels and Display Suite. But unless it is exported to code, these features will have to be built manually on each and every website - an impossible task. Worse yet, if this functionality isn't in code, when a change or bug fix needs to be applied to them, it must be done on a per site basis.

#### Solutions

* [Put your functionality into code and modules](http://derekmcburney.com/blog/drupal-distros-that-scale-part-4/) so that it can be deployed to multiple sites at once and maintained in one location.
* Make sure the modules you create providing this functionality are tagged with version numbers just like any [Drupal.org module](https://www.drupal.org/project/project_module) so that you know what site has what version of what functionality in use.
* Keep modules across your sites using the same version if possible. This simplifies maintenance when every site has the exact same upgrade path for a module should an update be released, and provides a consistent user experience for all your site's users.


### 2. Outdated sensitive content

With a distributed network of content authors accross the sites at your higher-ed institution, the content of your digital presence may begin to take on a form that might not mesh with your digital strategy.

...

### 3. Site sprawl

Provisioning sites is easy. Either your team will approach a unit on campus, or vice-versa to go about creating a new Drupal site.

To physically spin up a new site, you might be using [Pantheon](http://pantheon.io). You may have created a Drupal distribution, or Drush make file that you apply to a blank Drupal site. You may have a script that copies a database and files from a template Drupal site in order to spin up a new site. [Or any of the combination of these, really](http://derekmcburney.com/blog/drupal-distros-that-scale-part-2/).

But if Drupal is humming along at your insitution, you have site provisioning figured out. What's much more difficult to deal with is *site deprovisioning*. The issues with having too many sites at your insitution is obvious - more sites that need security updates, more content that can go out of date, more load on your servers, databases on your server, etc. If you want your institution to stay on curve and be nimble with a digital strategy, carrying less sites along for the ride makes things much easier.

...

### 4. Module sprawl

Like site sprawl, having too many modules on your environment makes things difficult. Every module on a site slows down the execution of that site. There are more hooks fired and more parsing of the file system.

More importantly, every module on a site also slows down your web team. Security updates can't go ignored and more modules on sites means more updates that need to be applied on those sites.

...

### 5. User deprovisioning

You will likely find at your institution that there are many users who have administrative or authoring roles for multiple sites, possibly across several units on campus.

...

### 6. Sites that run away in size

Enforcing maximum file upload sizes for any given field, or site or environment wide is easy. Enforcing a total size for an entire website is difficult. And while diskspace is cheap, it is not always plentiful. At large higher-ed institutions there are always new initiatives finding evermore intensive ways of consuming what diskspace is available. So it's important to be responsible with your resources.

...

### 7. Security

Security matters and you don't need to be reminded why. In Drupal, it can be very difficult to keep up with all the security updates that are posted - cross site scripting this, request forgery that, the alerts are frequent and it can be time consuming to approach them with the rigor that may be required across your environment.

This problem is exacerbated by the more modules and sites you have, especially when there are lots of sites at your institution that may not always have official eyes on them. The last thing you want is for some dark corner of your digital presence to have actually been a giant Viagra ad for the past several years.

...
