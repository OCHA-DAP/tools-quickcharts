Bite Component
==============

This component handles the rendering of the individual bite.
It's layout is affected by the "edit" and "add" input properties and it can generate 3 states:

* view mode - whole app is in view mode, and current bite has rendered
* edit mode - app in edit mode, bite is in the selected list and it can be edited
* add mode - bite is in the available list and app is in edit mode; the bite has a preview placeholder that suggests it's type

When rendering the bite in the selected list, it's contents is going to be different depending on the bite's type. Various
content components are available:

* :doc:`content/content-chart`
* :doc:`content/content-topline`
