const core = require("@actions/core");
const Micropub = require("micropub-helper");
// const parsePost = require("./parse-post");

const getPath = () => {
  return process.cwd() + "/cache/jsonfeed-to-mastodon.json"
}

async function run() {
  try {
    const token = core.getInput("token");
    const endpoint = core.getInput("endpoint");
    const micropub = new Micropub({
      token,
      clientId: "https://github.com/grantcodes/micropub-action",
      micropubEndpoint: endpoint,
    });

    const cache = require(getPath());
    console.log(cache)
    let items = Object.values(cache).reverse();
    console.log(items)
    let latest = items[0];
    let tootUrl = latest.toots[0];
    let originalUrl = latest.url;


    console.log(`Updating ${originalUrl} with link ${tootUrl}`);

    const url = await micropub.update(originalUrl, {
      add: {
        syndication: tootUrl
      }
    });

    console.log(`Successfully posted to ${url}`);
    core.setOutput("url", url);
  } catch (err) {
    console.error("Error creating micropub post");
    console.error(err);
    core.setFailed(err && err.message ? err.message : err);
  }
}

run();
