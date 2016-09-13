---
title: Stop Scaring Your Clients And Users With The Update Module
description: The update module provides an important view of what modules are out-of-date and insecure on your Drupal site. But to your users and clients, the list is confusing, alarming, and the more they see these warnings before you can get to them, the more risk to your reputation.
---

The update module in Drupal provides extremely useful functionality on your Drupal sites by combing through all modules on a site to determine what modules are out-of-date and if there is also a security update pending for them. It's always important to keep modules up-to-date, especially when there are security vulnerabilities that can be patched up.

![Update messages](/img/posts/updates.png)

The problem with the update module is that if you have enabled it for your own convienience as the maintainer of the site, any other users of the backend CMS can also see the warning messages generated from the module. These users may be your clients, that are paying you to keep the site updated and are wondering why you temporarily failed to do so. Or they may be the authors of the sites across your multi-site organization, that may be confused by the output and overly frightened at the messages they are seeing. 

![Scary update messages](/img/posts/scary-updates.png)

With both these scenarios likely to cause you much more harm than good, it is time to turn off the update module. With the update module turned off, site administrators of will no longer be presented with any alarming update messages. But neither will you. Another way must be found to get the same useful information about pending updates and security updates without the update module.

### 1. Drush

[Drush](http://www.drush.org/en/master/) is a command-line utility that will do just that. Once installed, it can be run at the root directory of a Drupal install to issue commands to a Drupal site (a baseurl can be specified for Drupal roots with multi-site). The command `pm-updatestatus` presents a view of the output the update module once gave us.

    $ drush pm-updatestatus

    Name                                               Installed Version  Proposed version  Message        
    Drupal                                             7.38               7.50              SECURITY UPDATE availab
    Chaos tools (ctools)                               7.x-1.9            7.x-1.10          Update available
    Context (context)                                  7.x-3.6            7.x-3.7           Update available
    Display Suite (ds)                                 7.x-2.11           7.x-2.14          Update available
    Entity API (entity)                                7.x-1.6            7.x-1.7           Update available
    Features (features)                                7.x-2.7            7.x-2.10          SECURITY UPDATE available
    Field collection (field_collection)                7.x-1.0-beta10     7.x-1.0-beta11    Update available
    Field Group (field_group)                          7.x-1.4            7.x-1.5           SECURITY UPDATE available
    Flag (flag)                                        7.x-3.7            7.x-3.8           SECURITY UPDATE available
    Hierarchical Select (hierarchical_select)          7.x-3.0-beta2      7.x-3.0-beta7     Update available
    Panels (panels)                                    7.x-3.5            7.x-3.7           SECURITY UPDATE available
    Link (link)                                        7.x-1.3            7.x-1.4           Update available
    Metatag (metatag)                                  7.x-1.7            7.x-1.17          Update available
    RoleAssign (roleassign)                            7.x-1.0            7.x-1.1           Update available
    Search API (search_api)                            7.x-1.16           7.x-1.20          SECURITY UPDATE available
    Solr search (search_api_solr)                      7.x-1.9            7.x-1.11          Update available
    Universally Unique ID (uuid)                       7.x-1.0-beta1      7.x-1.0-beta2     Update available
    Views (views)                                      7.x-3.12           7.x-3.14          SECURITY UPDATE available
    Webform (webform)                                  7.x-4.12           7.x-4.14          Update available

Using Drush allows you to save time by no longer needing to log in to your site. Better yet, Drush gets this information without requiring the update module, so this update information is no longer scaring your clients.

### 2. Dewy

The downside of Drush is that you have to run commands against your sites. While far better than logging in to each individual site, there are downsides:

* No module-centric view

    Drush will present a list of the modules that have updates for each site you run the command against (automatically run against multiple sites using [@sites](https://codedrop.com.au/blog/run-drush-commands-all-sites-drupal-multi-site)). This is useful output for a few sites, but if you are generating a list of updates across dozens or hundreds of sites, it may be more useful to see updates by module - not site. This is especially true in multi-site environments where many sites may be using the same module in the same code base.

* Overhead reporting updates on multiple environments

    If your sites are on multiple environments, you'll need to create a [Drush site alias file](http://www.drush.org/en/master/usage/#site-aliases) and make sure your SSH connectivity is working from the environment running the Drush command to the environment the site lives on. This site alias file must be kept up-to-date. For example, whenever you create a new site, that site will need to be appended to the site aliases file. That's simple enough, but when you're adding dozens of sites, the time wasted on this tedious task is compounded. Things get worse if you forget to add a site to your alias file and don't realize it.

Dewy solves these problems. Add the Dewy module to your sites, and Dewy runs all the commands, handles all the connectivity to multiple environments, and presents module-centric views in addition to a per-site view.

![Per-module view](/img/posts/updates-by-module.gif)

Dewy wastes less of your time and gives you more information.

### Do yourself a favour

If you're responsible for the maintenance of more than a site or two, you need to stop relying on the update module to determine if maintenance needs to be done. Logging in to your sites to check for updates is a time consuming process, and it is assured that your site administrators will often see the alarming update warnings before you do. Drush helps avoids these shortcomings, and Dewy is even faster and more informative.