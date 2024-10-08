![PriceHound_Logo_WHITEBG_V3](https://github.com/user-attachments/assets/75ba909d-8c00-4f63-8068-897120534420)

## PriceHound
Welcome to the **PriceHound** repository. This project has been developed as part of our coursework for COMP602: Software Development Practices at Auckland University of Technology (AUT) in Aotearoa, New Zealand, in 2024.

## Project Overview
PriceHound is a price comparison web application designed to help users find the best deals on their favourite products. Our application scrapes data from online retailers in New Zealand and Australia, allowing users to compare prices and find discounts, all from the comfort of their couch!
The project allowed us to work with a modern tech stack while applying best practices in software development, focusing on collaboration, testing, and deployment.

## Features
***PriceHound*** provides the following key features:

- ***Product Search:*** Users can search for products across multiple online retailers, filtering results by preset or custom price ranges.
- ***Price Comparison:*** Compare prices from different websites in real-time, ensuring users always get the best deal.
- ***Select the currency:*** Compare products using your preferred currency with live conversion of product pricing in your currency of choice.
- ***User Reviews:*** Submit and view user ratings and reviews for all products.
- ***Wishlist:*** Save products to a personal wishlist for future reference.
- ***Responsive Design:*** A mobile-friendly interface that provides seamless experiences on desktop and mobile devices.
- ***Authentication:*** Secure login and registration using Firebase authentication (Google, email/password or passwordless sign-in options).
- ***User Account Management:*** Users can easily manage aspects of their accounts with our user account management interface, where they can change their name, password, email, profile picture, or delete their account. 
- ***Contact Form:*** Users can contact us using our contact form, which stores submissions in our Firestore database and sends email notifications using the MailJet API.
- ***Ad Revenue:*** Ads can be displayed throughout the site using our internal ads feature in addition to detecting ad blockers to recover potentially lost revenue.

## Technologies
This project uses a variety of technologies and tools to achieve our goals:
- **React**: The frontend library used to build the interactive and dynamic user interface.
- **Node.js & Express**: Our Backend framework is used to handle server requests and create API endpoints.
- **Puppeteer**: A web scraping tool to collect real-time product data from online retailers.
- **Firebase**: Used for user account authentication, database management and storage throughout the website.
- **Google Cloud**: Used to deploy and host our website
- **Other Libraries**: We incorporated a range of other libraries for miscellaneous tasks and enhancements throughout the project.

## Getting Started
Follow these steps to get **PriceHound** locally on your machine.

#### Prerequisites
Ensure you have the following installed:
- Node.js ([Install Node](https://nodejs.org/en/download/package-manager))
- npm (Node package manager) ([Install NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))

#### Clone the Repository
   ```
   git clone https://github.com/thomasbrears/SDP_PriceHound.git
   ```
#### Install Dependencies
   Navigate to the project directory and install the required dependencies for both the frontend and backend:
   ```
   cd frontend 
   npm install
   ```
   ```
   cd backend 
   npm install
   ```
   
#### Run the Application
1. **Frontend**: In one terminal Window: 
    ```
    cd frontend
    npm start
    ```

2. **Backend**: In a second terminal Window: 
    ```
    cd backend
    npm run dev
    ```
#### Access the Website
With the frontend and backend running, open your browser and navigate to: ```http://localhost:3000```

Note: Firebase authentication and certain database functionalities may not work without access to the private API keys. 

## The ***PriceHound*** Development Team
- [Thomas Brears](https://thomas.brears.xyz)
- [Jack C](https://github.com/JCCourt)
- [Campbell](https://github.com/kiwiicam)
- [Xu](https://github.com/sueyan9)

## Contributing
If you'd like to contribute to ***PriceHound***, follow these steps:
1. Fork the repository.
2. Create a new feature branch (```git checkout -b feature-branch```).
3. Commit your changes (```git commit -m 'Add new feature'```).
4. Push to the branch (```git push origin feature-branch```).
5. Submit a pull request.

## Licence
This project and its contents are the intellectual property of the project team. It is intended solely for educational purposes and cannot be reproduced, copied, or distributed without prior permission from the authors.

**Thank you for visiting the PriceHound repository.**
