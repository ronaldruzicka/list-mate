# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
pnpm dlx sv create

# create a new project in my-app
pnpm dlx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `pnpm install`, start a development server:

```sh
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

## Database

The app uses SQLite via Drizzle. Schema lives in `src/lib/db/schemas`; migrations are in `drizzle/`.

| Script             | Description                             |
| ------------------ | --------------------------------------- |
| `pnpm db:generate` | Generate migrations from schema changes |
| `pnpm db:migrate`  | Apply migrations                        |
| `pnpm db:push`     | Push schema directly (dev)              |
| `pnpm db:studio`   | Open Drizzle Studio (browser UI)        |

### Viewing data

**Drizzle Studio** (recommended): browse and edit tables in the browser.

```sh
pnpm db:studio
```

Studio reads `sqlite.db` in the project root (see `drizzle.config.ts`). The app uses `DATABASE_URL` at runtime — keep it pointed at the same file (e.g. `DATABASE_URL=sqlite.db` in `.env`) so Studio and the app see the same data.

**SQLite CLI** (optional):

```sh
sqlite3 sqlite.db
.tables
SELECT * FROM list;
.quit
```

You can also open `sqlite.db` in a GUI such as [DB Browser for SQLite](https://sqlitebrowser.org/).

## Building

To create a production version of your app:

```sh
pnpm build
```

You can preview the production build with `pnpm preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
