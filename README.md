# Discord Rate Limit Check

This Discord bot checks whether specific IP addresses are rate-limited by Discord. The bot responds to the `!check` command by providing rate limit information for a list of predefined IP addresses.

## Features

- Checks if specified IP addresses are rate-limited by Discord.
- Provides detailed information about each IP address.
- Uses Discord.js v14 for interacting with the Discord API.
- Fetches the bot token from the `.env` file.

## Prerequisites

- Node.js v16.6.0 or higher
- npm (Node Package Manager)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Embotic-xyz/Ratelimit-Check.git
    cd ratelimit-check
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. In the `.env.example` file, add your Discord bot token, then rename it to `.env`


## Usage

1. Start the bot:
    ```sh
    node index.js
    ```

2. Use the `!check` command in any channel the bot has access to. The bot will respond with an embed containing the rate limit status of each specified IP address.

## Code Overview

- `index.js`: Main file containing the bot logic.
- `.env`: Environment file for storing sensitive information like the bot token.

### Main Functionality

- The bot listens for the `!check` command and responds with an embed containing rate limit information for a list of predefined IP addresses.
- It uses the `axios` library to make HTTP requests to the Discord API, passing each IP address as a header to check its rate limit status.

## Example

Here is an example of what the bot's response might look like:

https://prnt.sc/cPGwaCbKkV8f

## Dependencies

- [discord.js](https://www.npmjs.com/package/discord.js)
- [axios](https://www.npmjs.com/package/axios)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [colors](https://www.npmjs.com/package/colors)

## Contributing

If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the GPL-3.0 License. See the LICENSE file for details.
