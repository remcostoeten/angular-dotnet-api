# Angular + Assessment

Small Angular app built around a handed-off backend plus an external API.

Usually not a fan of code comments as the functions should describe themselves, but for the sake of this project, I left some comments here and there to explain thought process or things I would have done in a real app that I skipped for the sake of time.

## Routes

### /

Contains a nicely AI-generated summary of all the PRs so you can incrementally see the changes I've made.

### /books

Contains the actual app / main feature

- Post book form with title, author and price toggleable between EUR and BTC, fetched from CoinGecko on mount and on post
- Render all books in a list
- On click render {id} endpoint response in a detail panel. On mount, default to first index
- Basic search/filter

## Tech / approach

Mostly using newest Angular APIs like signals and the reactive HTTP methods.

Scaffolded with ng new, Tailwind CSS for styling.

## Structure of the repo

Structure of the Angular app is mostly feature-first. I'm not sure what is the standard in Angular but personally I am a fan of seperation of concerns and co-location. 

For a larger React example, see [docker-manager](https://github.com/remcostoeten/dora/tree/master/apps/desktop/src/features/docker-manager).

```
/features/{feature}
  /api           # server-related: models, services
  /components   # feature-specific components
  /{types,state,utilities}

/shared         # reused across features
  /types
  /ui
  /utilities

/{pages,views}  # route-level components

/core           # app-level: api-config.ts, base services (create.ts, read.ts, update.ts, destroy.ts)
```

## Run API / app
At least, on Linux Ubuntu. 
```bash
./run-api-and-app.sh
```

```text
./run-api-and-app.sh
Port 5145 is not in use.
Run api? (Y/n): 
API started in background on http://localhost:5145 (PID 669634).
Run frontend too? (y/N): y
Frontend started in background on http://localhost:4200 (PID 669733).
```

Or cd manually and dotnet run / IDE integration and npm start for the frontend.

```bash
./run-api-and-app.sh exit
```

```text
Stopped API PID 676006.
Stopped Frontend PID 676081.
Stopped Frontend PID 676082.
bye.
```
