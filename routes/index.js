const { RichEmbed } = require("discord.js");

const {
  runner: wotdRunner,
  render: wotdRender
} = require("../commands/fun/wotd");

const {
  runner: hnRunner,
  getEmbeds: hnGetEmbeds
} = require("../commands/utility/hacker-news");

const { runner: doraemonRunner } = require("../commands/fun/doraemon-today");

const { runner: jokeRunner } = require("../commands/fun/joke");

const {
  runner: jsTrendingRunner,
  render: jsTrendingRender
} = require("../commands/utility/javascript-trending");

const {
  WOTD_CHANNEL_ID,
  WOTD_KEY,
  HN_CHANNEL_ID,
  HN_KEY,
  JT_CHANNEL_ID,
  JT_KEY
} = process.env;

const root = (req, res) => {
  res.render("index");
};

const joke = async (req, res) => {
  const { setup, punchline } = await jokeRunner();

  res.render("joke", { description: `${setup} ${punchline}` });
};

const doraemon = async (req, res) => {
  const { image, description } = await doraemonRunner();
  res.render("doraemon", { image, description });
};

const javascript_trending = async (req, res, client) => {
  if (req.query.key === JT_KEY) {
    const result = await jsTrendingRunner();

    client.channels
      .get(JT_CHANNEL_ID)
      .send(
        new RichEmbed()
          .setColor(`#ff6600`)
          .setDescription(`**Trending Javascript Repositories Today**`)
      );

    jsTrendingRender(result).forEach(value => {
      client.channels
        .get(JT_CHANNEL_ID)
        .send(new RichEmbed().setColor(`#008000`).setDescription(value));
    });

    return client.channels
      .get(JT_CHANNEL_ID)
      .send(
        new RichEmbed()
          .setColor(`#ff6600`)
          .setTimestamp()
          .setFooter(`Source: Github Trending`)
      )
      .then(() => {
        res.sendStatus(200);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(400);
  }
};

const wotd = async (req, res, client) => {
  if (req.query.key === WOTD_KEY) {
    const _wotd = await wotdRunner();

    return client.channels
      .get(WOTD_CHANNEL_ID)
      .send(wotdRender(_wotd))
      .then(() => {
        res.sendStatus(200);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(400);
  }
};

const hn = async (req, res, client) => {
  if (req.query.key === HN_KEY) {
    const titles = await hnRunner();

    client.channels
      .get(HN_CHANNEL_ID)
      .send(hnGetEmbeds(titles).one)
      .catch(() => {
        res.sendStatus(500);
      });

    client.channels
      .get(HN_CHANNEL_ID)
      .send(hnGetEmbeds(titles).two)
      .catch(() => {
        res.sendStatus(500);
      });

    return client.channels
      .get(HN_CHANNEL_ID)
      .send(hnGetEmbeds(titles).three)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(400);
  }
};

module.exports = {
  root,
  wotd,
  hn,
  joke,
  javascript_trending,
  doraemon
};
