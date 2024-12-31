# SERAPH Implementation on Eliza

This is an implementation of SERAPH using the Eliza framework.

## Quick Start

1. Duplicate the .env.example template:

```bash
cp .env.example .env
```

2. Configure your .env file with required credentials:

```diff
-DISCORD_APPLICATION_ID=
-DISCORD_API_TOKEN= # Bot token
+DISCORD_APPLICATION_ID="YOUR_DISCORD_APP_ID"
+DISCORD_API_TOKEN="YOUR_DISCORD_BOT_TOKEN"
...
-OPENROUTER_API_KEY=
+OPENROUTER_API_KEY="YOUR_OPENROUTER_KEY"
```

3. Install dependencies and start SERAPH:

```bash
pnpm i && pnpm start --characters="characters/seraph.character.json"
```

## Adding Clients

Enable different platforms by adding them to the clients array:

```diff
- clients: [],
+ clients: ["discord"], # Add platforms you want to use
```

## Supported Platforms

SERAPH can be configured to run on:

- Discord
- Twitter
- Additional platforms supported by Eliza

## Environment Setup

Each platform requires specific credentials in your .env file:

### Discord

```env
DISCORD_APPLICATION_ID="YOUR_APP_ID"
DISCORD_API_TOKEN="YOUR_BOT_TOKEN"
```

### Twitter

```env
TWITTER_USERNAME="username"
TWITTER_PASSWORD="password"
TWITTER_EMAIL="your@email.com"
```

### OpenRouter (for AI capabilities)

```env
OPENROUTER_API_KEY="your-key-here"
```

## Custom Character Configuration

While this implementation uses the SERAPH character file by default, you can modify the character settings by editing `characters/seraph.character.json` or creating your own character file.

## License

See the LICENSE file for details.
