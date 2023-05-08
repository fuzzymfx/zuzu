import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import rss from 'rss';

// Set up RSS feed
const feed = new rss({
    title: 'Anubhav\'s Blog',
    feed_url: 'https://anubhavp.dev/blog/feed.xml',
    site_url: 'https://anubhavp.dev/blog',
    guid: 'https://anubhavp.dev/blog',
    date: new Date(),
    author: 'Anubhab Patnaik',
    custom_namespaces: {
        content: 'http://purl.org/rss/1.0/modules/content/',
    },
    custom_elements: [
        { 'atom:link': { _attr: { href: 'https://anubhavp.dev/blog/feed.xml', rel: 'self', type: 'application/rss+xml' } } },
    ],
});

// Parse HTML files in directory
const directoryPath = path.resolve('docs');
fs.readdir(directoryPath, function(err, files) {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }
    files.forEach(function (file) {

        const filePath = path.join(directoryPath, file);
        if (path.extname(filePath) === '.html'
        && file !== 'index.html'
        && file !== 'search.html'

        )  {
            const url = `https://anubhavp.dev/blog/${file}`;
            const html = fs.readFileSync(filePath, 'utf-8');
            
            const dom = new JSDOM(html);
            const title = dom.window.document.querySelector('title').textContent;
            const date = dom.window.document.querySelector('meta[name="publish-date"]').getAttribute('content');
            const author = dom.window.document.querySelector('meta[name="author"]').getAttribute('content');
            const description = dom.window.document.querySelector('meta[name="description"]').getAttribute('content');
            const body = dom.window.document.querySelector('body').innerHTML;

            const item = {
                title,
                url,
                date,
                author,
                custom_elements: [
                    { 'content:encoded': body },
                ],
            };
            feed.item(item);
        }
    });
    // Generate RSS feed XML and save to file
    const feedXML = feed.xml({ indent: true });
    const feedPath = path.resolve('docs', 'feed.xml');
    fs.writeFileSync(feedPath, feedXML);
    console.log('RSS feed generated successfully.');
});