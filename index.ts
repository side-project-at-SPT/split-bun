// provide a cli-style interface
// 1. login 2. info 3. exit
// login: ask for username and password => print welcome message => print "press any key to continue" => back to the main menu
// info: print "This is the info command" => print "press any key to continue" => back to the main menu
// exit: print "Goodbye!" => close the interface
// every time the user enter without words, flush the input and ask again
// when type password in the terminal, it should be hidden

console.log("Hello via Bun!");

import { question } from "./utils";

import { updateUser, getUser } from "./sqlite";

// console.log(db.query("select 'Hello world' as message;").get()); // => { message: "Hello world" }
updateUser({ name: "aaa" });
// console.log(db.query("select * from users limit 1;").get());

let exitFlag = false;

const login = async () => {
  const url = new URL("https://spt-games-split.zeabur.app/api/v1/users");
  console.log(`You are about to login to ${url}`);
  const name = await question("Enter name: ");
  const password = await question("Enter password: ", { hidden: true });
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, password }),
  });
  if (response.ok) {
    const { token } = await response.json();
    updateUser({ name, token, is_login: 1 });
  } else {
    console.error(`${response.status} ${response.statusText}`);
    try {
      const { error } = await response.json();
      console.error(error);
    } catch (error) {
      console.error("No additional information available");
    }
  }
};

// const pressAnyKeyToContinue = () => {
//   console.log("Press any key to continue...");
//   console.error("(currently not working)");
//   console.log();
// };

const info = () => {
  console.log("This is the info command");
};

const exit = () => {
  console.log("Goodbye!");

  // break the loop
  exitFlag = true;
};

const main = async () => {
  const guestPrompt = "1. login 2. info 3. exit\n";
  const userPrompt = "1. logout 2. info 3. exit\n";
  let count = 0;

  while (count < 10) {
    const { is_login } = getUser();
    let input;
    if (is_login) {
      console.log("You are logged in");
      input = await question(`${userPrompt}Enter your choice: `);
    } else {
      input = await question(`${guestPrompt}Enter your choice: `);
    }
    switch (input) {
      case "1":
        console.clear();
        await login();
        break;
      case "2":
        console.clear();
        info();
        break;
      case "3":
        exit();
        break;
      default:
        console.clear();
        break;
    }

    if (exitFlag) {
      break;
    }
    count++;
  }
};

main();
