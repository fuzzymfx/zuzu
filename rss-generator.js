import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import rss from 'rss';

// Set up RSS feed
const feed = new rss({
    title: `Example RSS Feed`,
    description: `Example RSS Feed`,
    feed_url: 'https://example.com/feed.xml',
    site_url: 'https://example.ecom',
    image_url: 'https://example./apple-touch-icon.png',
    managingEditor: 'John Doe',
    webMaster: 'John Doe',
});

// Parse HTML files in directory
const directoryPath = path.resolve('docs');
fs.readdir(directoryPath, function(err, files) {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(function(file) {
        // console.log(file);
        const filePath = path.join(directoryPath, file);
        if (path.extname(filePath) === '.html') {
            const html = fs.readFileSync(filePath, 'utf-8');
            const $ = cheerio.load(html);

            // Extract article data
            const title = $('title').text();
            const date = $('meta[name="publish-date"]').attr('content');
            const author = $('meta[name="author"]').attr('content');
            const content = $('article').html();

            // Add article to RSS feed
            feed.item({
                title: title,
                description: content,
                author: author,
                date: date,
                url: `https://example.com/blog/${file}`,
                guid: `https://example.com/blog/${file}`,
            });
        }
    });

    // Generate RSS feed XML and save to file
    const feedXML = feed.xml({ indent: true });
    const feedPath = path.resolve('docs', 'feed.xml');
    fs.writeFileSync(feedPath, feedXML);
    console.log('RSS feed generated successfully.');
});