# Initialize resources, add in common resources and variables:
set Directory [file dirname [info script]]
set pageName  [file root [info script]]

::resource::init
::resource::add common ::resource::src [file join $Directory common]


::view::return