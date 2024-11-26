/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

// Take the user's URL
import inquirer from 'inquirer';
import qr from "qr-image";
import fs from "fs";


inquirer
  .prompt([
    {
      type: "input",
      name: "userInput",
      message: "Please enter the site URL:",
    },
  ])
  .then(({ userInput }) => {
    // Store the user's response in a variable
    const userInputVariable = userInput;

    const qr_url = qr.image(userInputVariable, { type: "png" });
    qr_url.pipe(fs.createWriteStream("qr_code.png"));

    const writableStream = fs.createWriteStream("URL.txt");
    writableStream.write(userInputVariable);
    writableStream.end();
  })
  .catch((error) => {
    console.error("Error occurred:", error);
  });




