.. _bite_list_component:

Bite List Component
===================

Main component responsible of rendering and altering the bites, both in the selected set or the available bites list.
The component changes it's state into editing mode when the "edit" flag is passed on from the Bites module.

A set of actions is exposed by the component: onEdit, onReset, onSave. These were necessary since the triggering buttons have
effects in other components as well.

Individual bite rendering, inside both selected and available bites sections, is handled by the :doc:`../bite/bite`
