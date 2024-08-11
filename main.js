const axios = require("axios");

const MONDAY_API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjM5NTUzMDgyMSwiYWFpIjoxMSwidWlkIjo2NDYxODMxNSwiaWFkIjoiMjAyNC0wOC0xMVQwNDo1MDoxNS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjQ4NjM1MzUsInJnbiI6InVzZTEifQ.OAiEqv2kfD6HgjBDUA1LJjTnmfRoeQbFACrFs7GDGp4";
const MONDAY_BOARD_ID = "7202199016";

// Part 1 Function to fetch data from Monday.com
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
          let obj = {}
          obj.name = items[i].name;
          for(let j = 0; j< items[i].column_values.length; j++){
            obj[`${items[i].column_values[j].id}`] = items[i].column_values[j].value
          }
          result.push(obj);
        }
      }
    }
    return result
  } catch (error) {
    console.error(
      "Error fetching data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// Main function to execute the Part 1 & Part 2
async function main() {
  try {
    // Step 1: Fetch data from Monday.com
    const boardData = await fetchMondayBoardData();

    console.log(boardData);
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

// Run the main function
main();