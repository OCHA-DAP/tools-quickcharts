.. _bite_list_component:

Bite List Component
===================

Main component responsible of rendering and altering the bites, both in the selected set or the available bites list.

A set of actions is exposed by the component: onReset, onSave. These were necessary since the triggering buttons have
effects in other components as well.

Individual bite rendering, inside both selected and available bites sections, is handled by the :doc:`../bite/bite`
