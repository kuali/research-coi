V1.0.3
* Fixed an issue when running the mock auth client that used the incorrect host 
  in some situations. Fixed by no longer including protocol of host on the
  redirect url.
* Progress through a disclosure is now tracked.
  If a user gets halfway through and stops, when they return
  they will be brought back to where they were. The data has always been
  saved. This will simply return them to that place in the process.
* Fixed bug which prevented adding new relationships to existing entities
* Fixed bugs with the next step button not enabling/disabling at the correct times
* Now shows the revised date (and labels it as such) on the admin list view for
  revised disclosures. Un-revised disclosures still show the submitted date.
* Improved accuracy of the admin status filter
* Fixed cancel button on the pi-revise/review screen

V1.0.2

* Updated documentation
* Added an AUTH_OVER_SSL environment variable which can be set to false if running on the same server
* Load test framework for REST endpoints
* Added menus for admins to navigate to parts of the app without changing the URL
* Added a button for PIs to click when there are no entities
* General styling improvements
* Remove cancel from the certify screen
* React 0.14.2
* HTML 5 History for routing instead of hash based routing
