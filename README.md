## How to run the app?
1. Install necessary packages (see `package.json`).
2. Open one terminal, navigate to `./server_side`, and run: `node server.js`.
3. You might need to adjust your MongoDB connection string to match the existing one in `server.js`.
4. Open another terminal, navigate to the root directory of the project, and run: `npm start`.

## How to use the app?
1. Create a group with specific shifts according to your requirements.
2. Enter the group by clicking "Show All Groups" and selecting the desired group.
3. You will see the group's shift details as submitted in the creation stage.
4. Add employees by clicking "Join Group" at the bottom of this page, by entering employee name, email, and checking the checkbox for each available shift by this employee, then click "Submit".
5. Repeat stage 4 for as many employees as you need. (You can also enter the same name and email with different shift availability and submit, it will update this employee's data in the database)
6. Important: Go back to the main page by clicking "Go Back".
7. Click again on "Show All Groups" and choose the same group.
8. Now you will see how many employees have joined the group but are yet to be assigned shifts.
9. At the bottom of the page, you will see the "Assign Shifts Automatically" button. Click it.
10. Re-enter the group section, you will now see that 0 employees that joined the group are yet to be assigned, and a prompt telling you to scroll to the bottom to see the existing assignment.
11. Click "Show Existing Assignment" - and ta-da, you will now see the assignment to send to your employees.

### Disclaimers and Notes:
1. The automatic shifts assignment algorithm takes into account both the order of employee form submissions, prioritizing early submitters, and also the total number of shifts available by employees - prioritizing those who have fewer shifts submitted.
2. We are aware that there are existing algorithms and packages for shift scheduling, but we intentionally chose to implement it ourselves as a learning exercise as we both wanted to dive in and use this project as a learning experience.
3. The original project structure supplied by the ChatGPT was messy and unstructured, causing many issues and making debugging very difficult. We learned a lot about how a MERN project should be set up (and how not to).
4. Some of the visuals are not shown properly when recording the screen, such as a nav menu for the shifts hours.

## Plans for Production:
See attached Trello board screenshot, as we plan to follow those changes in order to make the app scalable and robust.

      
       