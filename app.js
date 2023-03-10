const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running");
    });
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

const convertToCamelCase = (dbObject) => {
  return {
    movieName: dbObject.movie_name,
  };
};

//GET Movies API
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `SELECT * FROM movie;`;
  const moviesArray = await db.all(getMoviesQuery);
  console.log(moviesArray);
  response.send(moviesArray.map((eachMovie) => convertToCamelCase(eachMovie)));
});

//POST Movies API
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  console.log(movieDetails);
  const { directorId, movieName, leadActor } = movieDetails;
  const postMovieQuery = `INSERT INTO movie(director_id,
        movie_name,lead_actor) VALUES (${directorId}
            ,'${movieName}','${leadActor}';`;
  const dbResponse = await db.run(postMovieQuery);
  const movieId = dbResponse.lastID;
  response.send("Movie Successfully");
});
