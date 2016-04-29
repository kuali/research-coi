##coi-1604

######Issues
* Increased project title column to accommodate titles up to 2000 characters.
* Fixed issue where screen became unresponsive upon selecting a travel relationship when adding a financial entity.
* Fixed issue where new disclosures were not picking up the latest configuration.
* Fixed issue with navigating the screening questionnaire when a question had child questions for both yes and no answers.
* Fixed issue where warning for not having a financial entity displayed when there was an incomplete entity even if there was a complete entity already.
* Fixed issue where users were not allowed to move forward if there was an incomplete relationship on a financial entity, by allowing the user to either remove the in progress relationship, or clicking the undo button when editing a financial entity.
* Fixed issue where UI was not displaying the configured disclosure types in all place in the reporter view.
* Made the 'I have no entities to disclose' button larger.

######Features in Production
* Ability to order declaration types set by the reporter in the configuration view.

######Features behind a Feature Flag
* Ability to reassign additional reviewers.
* Ability to configure and assign project level dispositions to submitted disclosures. 
* System will set disclosure level disposition that is the highest risk disposition type of all the project dispositions.
* Ability to filter disclosures based on disposition in the admin list view.
* Ability to create and display rich text instructions.
* Ability to automatically assign additional reviewers based on the reporter's primary department.
* Ability to configure and send the email notifications to COI Admin when reporter a new disclosure is submitted by a reporter
* Ability to configure and send the email notifications to a reporter when a new project’s creation requires an annual disclosure update.
* Ability to configure and send the email notifications to reporter when their disclosure is sent back, approved, expired or about to expire.
* Ability to configure and send the email notifications related to additional review.


##coi-1603
* Renamed migration files to facilitate migrations being ran in alphabetic order. New migration files will follow the YYYYMM_xxx.js naming convention. The following sql script will fix your existing knex_migrations table if needed.

    > update knex_migrations set name = '000000_001.js' where name = '1.js'; 
    
    > update knex_migrations set name = '000000_002.js' where name = '2.js';
    
    > update knex_migrations set name = '000000_003.js' where name = '3.js';
    
    > update knex_migrations set name = '000000_004.js' where name = '4.js';
    
    > update knex_migrations set name = '000000_005.js' where name = '5.js';
    
    > update knex_migrations set name = '000000_006.js' where name = '6.js';
    
    > update knex_migrations set name = '000000_007.js' where name = '7.js';
    
    > update knex_migrations set name = '000000_008.js' where name = '8.js';
    
    > update knex_migrations set name = '000000_009.js' where name = '9.js';
    >

* Moved bootstrap data needed for the application to run from the seed file into the migrations.  This will make it easier to keep this data up-to-date.
* Fixed bug where general attachments were not displaying on the admin view.
* Fixed bug where occasionally questions were not being displayed on the admin detail view.
* Fixed bug where revise/response screen would work for admins when they had commented on their own disclosure.
* Added ability to display a warning message if a user answers no to all 'Yes/No' type parent screening questions and an active entity exists.
* Added ability to display a message and block progress if a user answers yes to one or more 'Yes/No' type parent screening questions and no active entity exists
* Added functionality to update a users disclosure's status from 'Up to Date' to 'Update Needed' if a new project is added for that user, or update a user's disclosure from 'Update Needed' to 'Up to Date' if a user is removed from a project.
* Added ability for COI Admin to view Additional reviewers who have completed their reviews and the date their review was assigned.
* Fixed bug where submitted disclosure was editable if user types in URL.
* Added ability in Review Comments Aggregate view for reviewer and COI admin to see to whom a comments are visible.
* Fixed issue where the reporter could see the name of COI Admin who made review comment.
* Made some minor UI adjustments.
* Began work on notifications, documentation will be provided upon completion.

##coi-1602
* Fixed bug on the pi-revise screen which prevented adding a new relation to an existing entity while reviewing.
* Added ability to retrieve all management plan uploads as a zip file from an archived disclosure.
* Added ability to expand/collapse instructions by step.
* Added ability to add additional reviewers to disclosures that have been submitted for approval.
* Added reviewer role that can view and make comments on disclosures submitted for approval where they have been added as an
  additional reviewer.
* Added the approval date of annual disclosures in the admin detail view.
* Added ability to skip to the certification step if all screening questions are answered 'No' and there
  are no financial entities on an Annual Disclosure.
* Disclosures that have passed their expiration date are automatically set to an "Expired" status.
* Added ability to edit comments that have not yet been sent back to the reporter.
* Added ability to configure which projects, roles, and statuses require disclosure.


##coi-1601
* Now tracks the user id, user name, and time of change when a config modification is made.  DB MIGRATION REQUIRED!
* Instruction box now spans full width of the pane.
* Can now configure whether instructions show by default.  (Turned on initially)
* Improved printing of archived disclosures.
* Fixed bug which prevented two new relations to simultaneusly added to different entities.
* Fixed validation of new entity relationships.  Previously it was possible to 
  submit an entity without a comment.
* Changed wording of "Clear Filter" button on the admin list view filter by
  status to 'Reset Filter'
* Added ability to view management plans on archived disclosures
* Fixed Travel Log view by filter to display correctly when 'Not Yet Disclosed'
  is selected.
* Added ability for admins to add attachments to a disclosure being reviewed.
* Added ability to auto approve disclosures with out financial entities.  Can turn on/off
  in the configuration (Turned off initially).

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
