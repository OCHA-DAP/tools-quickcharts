.. HXL Preview documentation master file, created by
   sphinx-quickstart on Thu Feb  2 07:58:03 2017.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to HXL Preview's documentation!
=======================================

When a user uploads a HXLated data set to HDX they are presented with the option to show an auto generated dashboard giving insights into and overviews of their data.
This dashboard is produced by the HXL Preview.

Terminology
-----------
We got the application's terminology from a cooking analogy, so this is going to be familiar:
 - HXL Bite - A bite is one element of a dashboard, be it a key figure, pie chart, bar chart or more
 - HXL Ingredient - The requirements of the HXL data set to make the HXL bite.  If the ingredients are not there, the bite cannot be made
 - HXL Recipe - How you use the ingredients to make the bite
 - HXL Cookbook - The library of HXL bites (ingredients + recipes)

The look
--------

1. View mode
............

The user is presented with a 3 by 2 grid of HXL bites. The number of rows varies and is adjusted by the user editing the preview and adding/removing bites.

2. Edit mode
............

When toggling the edit mode, the current screen will transform and the user will see 2 sections:
 - Current selection - the selected bites, displayed in the view mode, are available here for the user to tweak or remove
 - Available visualisations - more bite options are shown here from which the user might choose to add them to the "Current selection" - bites shown here are not rendered in order to not overwhelm the browser (lots of combinations might occur and generate a lot of available bite)

For the selected bites the user has a set of available actions:
 - remove - current bite is removed and sent back to the "Available visualisations" section
 - reorder - by using drag&drop the user might change the order in which the bites appear
 - tweak - with in place editors the title/description/subtitle/etc can be changed

In-depth documentation
----------------------

Contents:

.. toctree::
   :maxdepth: 10

   src/app/bites/bites


Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`

