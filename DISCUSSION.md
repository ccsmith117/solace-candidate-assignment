## Intro

Hello!  My name is Cody Smith and this is my attempt at the Solace Engineering Assignment.  Thank you for taking the time to read this.

I will lay out at a high level what I got done in the time limit provided and what changes I'd highly recommend doing as a follow on.  I broke the work into 4 PRs but if I had the time I would've likely broken it out at least one more for the final touches.  

My reasoning to having the separate PRs is to break the work down into more easily reviewable chunks.  Additionaly, I attempted to break the PRs down as if they were each meant to be the result of a series of tickets breaking down the work for this project.

Each PR does build off of the last, so it is a fun chain of PRs.  Though a couple of them probably could've been done in parallel with some coordination if it is needed to be worked on by multiple engineers.  Ideally, each PR would've been reviewed and merged  before the next work started.

### PRs
#### PR #1 - Fix the current implementation
  1. Thought process here is to get the current implementation in a working state and to better understand the project.  As it is, the search bar wasn't working correctly and there were numerous hydration errors in the console.
  2. Fixed the search to actually filter out the results returned from the API.  The search was triggering on every keystroke as well, but I would come back to that in a follow up PR. 
  2. Once the app console errors were clear and the app worked right, I considered PR one to be done.


#### PR #2 - Pretty up the design and improve searching
  1. With the base functionality working, I wanted to make some visual improvements and make the search more efficient.  I want to make the page desktop friendly and be in line with the [Solace marketing website](https://www.solace.health/) since it has a pretty nice and clean design.
  2. Added a header bar with the Solace logo as an SVG added similar to the market site
  3. Tried to mimic the header font but Solace's marketing font for their copy was not available on Google Fonts so I tried to do something close to mimic it.
  4. Used a similar color palette as the marketing website to help the table stand out and be easy on the eyes.  Also leveraged box shadows like the website to give it a clean, modern touch.
  5. Made the Specialities in "pills" to make it easier to digest.
  6. Improved search to utilize debouncing to prevent a new search on every keystroke like it was doing before, which can be extremely negative for network and rendering performance. With that, I called this PR done.

#### PR #3 - Implement TanStack to move towards filtering table data server side
  1. With our database having potentially hundreds of thousands of records for a user to query on, it is not going to be feasible to do the current implementation.  We need to be able to have the backend handle the filtering and provide us with the data in a paginated fashion.  
  2. A step towards doing that and managing the table effectively is utilizing [TanStack Table](https://tanstack.com/table/latest).  It is an enterprise grade solution for building tables with built in column headers to sort the data in ascending/descending order, assisting with pagination, additional filters, and a lot more.  It is easy to customize with styles and flexible.  
  3. Though it is overkill for simply replacing the existing table, we are moving towards being able to handle a much larger dataset more easily with a more robust 3rd party table solution.  It also does require us to use an additional dependency, but I think it is well worth the tradeoff.


#### PR #4 - Initial implementation of server side fetching and clean up
  1. With TanStack Table in place, I went forward with a server side implementation to showcase what I am thinking.  I wasn't able to do much on the backend to reflect this well, but what is there I think shows the general idea.
  2. The general idea is that we make a call to fetch the data based on the initial search and table parameters.  Page 1, 10 results per page, no filtering by the search bar.
  3. On the server side, it'll take those parameters and filter the results down based on that query.  This isn't wired up to the database, but if it was, this is where you'd have the database queried to fetch the first set of results to return.
  4. During this time there are loading indicators to let the user know that the contents of the page are loading.
  5. Once the API request is complete, we will receive the records and some table/pagination metadata such as how many records fit the filtering criteria in total, what the current page is, if there are any additional pages, etc.



## Additional Improvements
### Frontend
- Add robust unit testing with Jest/Vitest and React Testing Library. 
- Add E2E or integration testing with happy paths for the user to prevent regression.
- Add accessibilty improvements
   - Add aria attributes for screen readers
   - Ensure colors used are readable for color blind users
   - Be able to navigate the website using only a keyboard
- Add filtering by additional datapoints like city, years of experience, specialties
  - Additionally, if the user refreshes, have the results stored in session so the filtering can be re-applied automatically without them having to re-apply them manually
- Work with design and product to make a better design for the specialties
   - Current design is okay but a bit clunky in my opinion
 - Better styling for phone number to be like (618) 123-4567.  I totally missed this.
 - Consider showing photos of the Advocate as well in the grid or have each row represent a more detailed card summarizing the advocate instead of a standard table row
- Tested in Firefox-  Chrome and any other browsers (like Safari, Firefox, etc) testing recommended
- Leverage NextJS file based routing since that is standard convention for modern NextJS and would make the app easier to extend into having more pages
- Upgrade deprecated dependencies to prevent security vulnerabilities
- Add observability and logging


### Backend
- Add input validation to prevent unbound page requests and bad inputs
- Harden for production
  - Authentication measures
  - Environment config and env variables for DB credentials
  - Limit access to backend via gateway (this would help with rate limiting and DDOS attacks)
  - Be aware of PII (like phone number) and compliance with sensitive data like it
- Add API documentation using OpenAPI/Swagger
- Add observability, logging, and performance monitoring (IE DataDog)
- Expand searching capabilities to allow for fuzzy matching, faceted/filtered search on hundreds of thousands of records with a platform like ElasticSearch to optimize search performance

