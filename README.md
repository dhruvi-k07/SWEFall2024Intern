# SWE Intern - Fall 2024 - Walton Systems Coding Challenge

## Challenge Overview

This coding challenge consists of two main parts, with an optional bonus part:

- **Part 1**: Fetch data from a Monday.com board using their GraphQL API.
- **Part 2**: Extract the email from each row of the board data and send an email with the associated email content using an email service.
- **Bonus**: Include a Railway CI/CD configuration that schedules the script to run every 4 hours, Monday through Friday.

## Implementation Details

### Part 1: Fetch Monday Board Data

In this part, the script fetches data from a Monday.com board using their GraphQL API. The board contains the following columns:

- **Name** (`name`)
- **Email** (`client_email`)
- **Email Content** (`email_content`)

The script retrieves all items from the board, extracting the necessary columns for processing.

### Part 2: Send Emails

Originally, I was instructed to use the SendGrid Email API to send emails. However, due to certain constraints, I used **AWS SES (Simple Email Service)** instead. The script extracts the email addresses and corresponding email content from the Monday.com board data and sends emails to each recipient using AWS SES.

### Bonus: Railway CI/CD Configuration

The script includes a configuration for Railway CI/CD that schedules the script to run every 4 hours from Monday to Friday. This configuration is commented out at the bottom of the `main.js` file, as requested.
