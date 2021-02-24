# Interview Scheduler

Interview Scheduler is a Single Page App, built using React for learning purposes.
It allows users to book interviews in timeslots on different days.

## Final Product

!["Home Page"](https://github.com/eyoa/scheduler/blob/master/public/images/Screenshots/HomePage.png)
!["Form"](https://github.com/eyoa/scheduler/blob/master/public/images/Screenshots/Form.png)
!["Booked Interview"](https://github.com/eyoa/scheduler/blob/master/public/images/Screenshots/BookedInterview.png)
!["Select another day "](https://github.com/eyoa/scheduler/blob/master/public/images/Screenshots/SelectAnotherDay.png)

## Setup

Install dependencies with `npm install`.

## Dependencies notes

- Note the react version is : react v 16.9.0
- react-test-renderer is a matching version

## works with the provided scheduler-api

[Scheduler API](https://github.com/lighthouse-labs/scheduler-api)

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

## Running Cypress testing

```sh
npm run cypress
```

# Features

- Allows students to book interviews with a mentor
- appointments can be made between 12 - 5 pm for each day of the week
- information is persistent on the API server using PostgreSQL database
- Test Driven Development with Jest
- testing with Cypress
- implemented web sockets for updating information with multiple users

# Technical Specifications

- React
- Webpack, Babel
- Axios
- WebSockets
- Storybook, Webpack Dev Server, Jest, Testing Library
