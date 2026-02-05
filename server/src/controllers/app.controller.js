const getJokes = async (req, res) => {
  const { joke } = req.query;

  console.log("joke: ", joke);

  if (!joke) {
    throw new Error("Joke is required!");
  }

  if (joke == 1)
    return res.status(200).json([
      {
        id: 1,
        joke: "hello",
      },
      {
        id: 2,
        joke: "hii",
      },
      {
        id: 2,
        joke: "whatsupp",
      },
    ]);
};

export { getJokes };
