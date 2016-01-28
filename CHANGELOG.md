##coi-1601
* Can now configure whether instructions show by default.  (Turned on initially)
* Improved printing of archived disclosures.
* Fixed bug which prevented two new relations to simultaneusly added to different entities.
* Fixed validation of new entity relationships.  Previously it was possible to 
  submit an entity without a comment.

##coi-1512
* Fixed an issue when running the mock auth client that used the incorrect host 
  in some situations. Fixed by no longer including protocol of host on the
  redirect url. [View Commit](../../commit/54e2d57a70bc78bfb4c8bd92f220063ac347f11f)
* Progress through a disclosure is now tracked.
  If a user gets halfway through and stops, when they return
  they will be brought back to where they were. The data has always been
  saved. This will simply return them to that place in the process.  [View Commit](../../commit/1c77869fb8cb7905f1c438d9ecdb26d429aa9176)
* Fixed bug which prevented adding new relationships to existing entities  [View Commit](../../commit/cdf27883b167d9a856916ee078973009a04861f8)
* Fixed bugs with the next step button not enabling/disabling at the correct times  [View Commit](../../commit/4ae9ffe3b5fdbbcd7c92ee8b554a603836c34fa9)
* Now shows the revised date (and labels it as such) on the admin list view for
  revised disclosures. Un-revised disclosures still show the submitted date.  [View Commit](../../commit/ff428f15f3c4282c771cc39620499c700a40267b)
* Improved accuracy of the admin status filter  [View Commit](../../commit/6ead42b2c70fd018c67a8a49c8a1f58d5ff8e2b8)
* Fixed cancel button on the pi-revise/review screen  [View Commit](../../commit/7f0517f72be0b4d8bc714919d1cec156b56236fa)

##coi-1511

* Updated documentation
* Added an AUTH_OVER_SSL environment variable which can be set to false if running on the same server
* Load test framework for REST endpoints
* Added menus for admins to navigate to parts of the app without changing the URL
* Added a button for PIs to click when there are no entities
* General styling improvements
* Remove cancel from the certify screen
* React 0.14.2
* HTML 5 History for routing instead of hash based routing
