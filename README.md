# SurReal Estate Web Application

## Introduction
A real estate website where users can search for properties for sale, book appointments for onsite visits, and make a
deposit to purchase the property. This website is similar to Zillow.com but with the functionality to only purchase
properties. Real Estate web application where realtors can publish their listings, which are then viewed by web visitors
looking for properties to purchase.

## Core Features
- Main Page where non-authenticated users can see all the properties available for sale and authenticated users see
  their recommended properties based on their previous searches and/or preferences.
- The user can search and then filter the properties seen in the main page by selling price (high/low), by square
  feet, by available amenities such as a garage, terrace, number of bedrooms, ect.
    - Users should be able to search and then filter (Like Zillow, you can search an area, and then filter by property
      type, square footage, etc.). Users will have the filters listed, but they should be able to search by keyword or area,
      and then further filter the results.
- The user can select a property and the following options will be available.
    - See the full property details (# of bedrooms, bathrooms, sqft, address, price, description, …) and a section with photos.
    - Book an onsite visit (only available for authenticated users)
    - Send a message to the real estate agent requesting more information regarding the property.
    - Make an initial deposit to purchase the property (only available for authenticated users)
        - To make a deposit the user needs to upload some documentation such as his/her driver's license.
- Interactive map displaying the properties available for sale.
- Ability for authenticated users to post comments on a property.
- Authenticated users from the staff/admin web team can create/add new properties to the website.

## Extra Features
- Dashboard with property price metrics including average selling price of similar properties, property selling price
- history, predicted price based on similar houses, …
- Recommended properties/similar properties tab.
- Ability to disable new comments or onsite visits to properties that have an initial deposit on them. Maybe also adding
- some visual (like “reserved”) to the property main image.
