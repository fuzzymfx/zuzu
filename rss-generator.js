import fs from "fs/promises";
import syncfs from "fs";
import path from "path";
import rss from "rss";
import { JSDOM } from "jsdom";
import toml from "toml";
const config = await toml.parse(syncfs.readFileSync("./config.toml", "utf-8"));

const absUrl = config.base_url;
const title = config.title;
const author = config.author;
const description = config.description;
// Set up RSS feed
const feed = new rss({
  title: title,
  description: description,
  feed_url: `${absUrl}/feed.xml`,
  site_url: absUrl,
  guid: absUrl,
  date: new Date(),
  author: author,
  custom_namespaces: {
    content: "http://purl.org/rss/1.0/modules/content/",
  },
  custom_elements: [
    {
      "atom:link": {
        _attr: {
          href: `${absUrl}/feed.xml`,
          rel: "self",
          type: "application/rss+xml",
        },
      },
    },
  ],
});

// Parse HTML files in directory

async function generateXmls() {
  try {
    const directoryPath = path.resolve("./docs");
    const blogFiles = await fs.readdir(directoryPath);

    for (const file of blogFiles) {
      const filePath = path.join(directoryPath, file);
      if (path.extname(filePath) === ".html" && file !== "index.html") {
        const url = `${absUrl}/blog/${file}`;
        const html = await fs.readFile(filePath, "utf-8");

        const dom = new JSDOM(html);
        const title = dom.window.document.querySelector("title").textContent;
        const dateElement = dom.window.document.querySelector(
          'meta[name="publish-date"]'
        );
        const authorElement = dom.window.document.querySelector(
          'meta[name="author"]'
        );
        const descriptionElement = dom.window.document.querySelector(
          'meta[name="description"]'
        );
        const bodyElement = dom.window.document.querySelector("main");

        const date = dateElement ? dateElement.getAttribute("content") : "";
        let author = authorElement ? authorElement.getAttribute("content") : "";

        if (author === "<!-- AUTHOR -->") author = config.author;

        const description = descriptionElement
          ? descriptionElement.getAttribute("content")
          : "";
        const body = bodyElement ? bodyElement.innerHTML : "";
        const subtitle = description;

        const item = {
          title,
          description,
          url,
          date,
          author,
          custom_elements: [{ "content:encoded": body }, { subtitle }],
        };
        feed.item(item);
      }
    }

    const feedXML = feed.xml({ indent: true });
    const feedPath = path.resolve("./docs", "feed.xml");
    await fs.writeFile(feedPath, feedXML); // Using await with promise-based writeFile
    console.log("RSS feed generated successfully.");

    const rootPath = path.resolve("./docs");
    const rootFiles = await fs.readdir(rootPath);
    const sitemapItems = [];

    for (const file of blogFiles) {
      const filePath = path.join(directoryPath, file);
      if (path.extname(filePath) === ".html" && file !== "index.html") {
        const url = `${absUrl}/blog/${file}`;
        const stat = await fs.stat(filePath);
        const lastmod = new Date(stat.mtime).toISOString();
        const changefreq = "monthly"; // You can adjust this as needed
        const priority = 0.5; // You can adjust this as needed

        const sitemapItem = `
              <url>
                  <loc>${url}</loc>
                  <lastmod>${lastmod}</lastmod>
                  <changefreq>${changefreq}</changefreq>
                  <priority>${priority}</priority>
              </url>
          `;

        sitemapItems.push(sitemapItem);
      }
    }

    for (const file of rootFiles) {
      const filePath = path.join(rootPath, file);
      if (file.endsWith(".html") && file !== "index.html") {
        const url = `${absUrl}/${file}`;
        const stat = await fs.stat(filePath);
        const lastmod = new Date(stat.mtime).toISOString();
        const changefreq = "monthly";
        const priority = 0.5;

        const sitemapItem = `
              <url>
                  <loc>${url}</loc>
                  <lastmod>${lastmod}</lastmod>
                  <changefreq>${changefreq}</changefreq>
                  <priority>${priority}</priority>
              </url>
          `;
        sitemapItems.push(sitemapItem);
      }
    }

    const sitemapXML = `<?xml version="1.0";encoding="utf-8" standalone="yes"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${sitemapItems.join("\n")}
    </urlset>`;
    const sitemapPath = path.resolve("./docs", "sitemap.xml");
    await fs.writeFile(sitemapPath, sitemapXML);
    console.log("Sitemap generated successfully.");
  } catch (err) {
    console.error(err);
  }
}

generateXmls();
