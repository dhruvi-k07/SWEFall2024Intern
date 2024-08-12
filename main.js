const axios = require("axios");
const client = require('@sendgrid/mail');

// Configuration
const MONDAY_API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjM5NTUzMDgyMSwiYWFpIjoxMSwidWlkIjo2NDYxODMxNSwiaWFkIjoiMjAyNC0wOC0xMVQwNDo1MDoxNS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjQ4NjM1MzUsInJnbiI6InVzZTEifQ.OAiEqv2kfD6HgjBDUA1LJjTnmfRoeQbFACrFs7GDGp4";
const MONDAY_BOARD_ID = "7202199016";
const SENDGRID_API_KEY = 'sendgrid_api_key';

AWS.config.update({ region: "us-east-1" });
client.setApiKey(SENDGRID_API_KEY);

// Part 1: Function to fetch data from Monday.com
async function fetchMondayBoardData() {
  const query = `
    query {
      boards(ids: ${MONDAY_BOARD_ID}) {
        name 
        items_page {
          items {
            id
            name
            column_values {
              id
              value
            }
          }
        }
      }
    }`;

  const result = [];

  try {
    const response = await axios.post(
      "https://api.monday.com/v2",
      { query: query },
      {
        headers: {
          Authorization: MONDAY_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const boards = response.data?.data?.boards || [];

    if (boards.length !== 0) {
      const items = boards[0].items_page.items || {};
      if (items.length !== 0) {
        for (let i = 0; i < items.length; i++) {
          let obj = {};
          obj.name = items[i].name;
          for (let j = 0; j < items[i].column_values.length; j++) {
            obj[`${items[i].column_values[j].id}`] =
              items[i].column_values[j].value;
          }
          result.push(obj);
        }
      }
    }
    return result;
  } catch (error) {
    console.error(
      "Error fetching data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// Part 2: Function to send an email using SendGrid
async function sendEmail(toEmail, emailContent) {
  const message = {
      personalizations: [
          {
              to: [
                  {
                      email: toEmail
                  }
              ]
          }
      ],
      from: {
          email: 'dhruvikunvarani1404@gmail.com',
          name: 'Dhruvi Kunvarani'
      },
      subject: 'Client Feedback',
      content: [
          {
              type: 'text/plain',
              value: emailContent
          }
      ]
  };

  try {
      await client.send(message);
      console.log(`Email sent to ${toEmail}`);
  } catch (error) {
      console.error(`Error sending email to ${toEmail}:`, error.response ? error.response.body : error.message);
      throw error;
  }
}

const getEmail = (data) => {
  const JSONData = JSON.parse(data)
  return JSONData.email || ''
}

// Main function to execute the steps
async function main() {
  try {
    // Part 1: Fetch data from Monday.com
    const boardData = await fetchMondayBoardData();

    // Part 2: Send emails
    for (const entry of boardData) {
      const email = getEmail(entry["client_email"]);
      const emailContent = entry["email_content"];

      if (email != '' && emailContent) {
        await sendEmail(email, emailContent);
      }
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

// Run the main function
main();

// Bonus: Railway CI/CD configuration (commented out)
// module.exports = {
//   railway: {
//     schedule: "0 */4 * * 1-5", // Run every 4 hours Monday-Friday
//     script: "npm start"
//   }
// };
