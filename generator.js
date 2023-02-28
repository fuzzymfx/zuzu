#!/usr/bin/env node

import fs from 'fs'
import glob from 'glob'
import matter from 'gray-matter'
import mkdirp from 'mkdirp'
import path from 'path'
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import string from 'string'
import { getOutputPdfname, generatePDF } from './pdf-generator.js'
import toml from 'toml'
const config = toml.parse(fs.readFileSync('./config.toml', 'utf-8'));
// console.log(config)

const slugify = s => string(s).slugify().toString()

const absUrl = config.base_url

const md = MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight(str, language) {
        if (language && hljs.getLanguage(language)) {
            try {

                return hljs.highlight(str, { language: language }).value;
            } catch (err) {
                console.log(err)
            }
        }

        return null;
    }
}).use(markdownItAnchor, { slugify });


const readFile = (filename) => {
    const rawFile = fs.readFileSync(filename, 'utf8')
    const parsed = matter(rawFile)
    const html = md.render(parsed.content)

    return {...parsed, html }
}

const templatize = (template, { date, title, content, author }) =>
    template
    .replace(/<!-- PUBLISH_DATE -->/g, date)
    .replace(/<!-- TITLE -->/g, title)
    .replace(/<!-- CONTENT -->/g, content)
    .replace(/<!-- AUTHOR -->/g, author)

const saveFile = (filename, contents) => {
    const dir = path.dirname(filename)
    mkdirp.sync(dir)
    fs.writeFileSync(filename, contents)
}

const getOutputFilename = (filename, outPath) => {
    const basename = path.basename(filename)
    const newfilename = basename.substring(0, basename.length - 3) + '.html'
    const outfile = path.join(outPath, newfilename)
    return outfile
}

const processFile = async(filename, template, outPath) => {
    const file = readFile(filename)
    const outfilename = getOutputFilename(filename, outPath)
    const outpdfname = getOutputPdfname(filename, outPath)

    const templatized = templatize(template, {
            date: file.data.date,
            title: file.data.title,
            content: file.html,
            author: file.data.author,
        })
        // await generatePDF(filename, outpdfname)
    saveFile(outfilename, templatized)
    console.log(`📝 ${outfilename}`)
        // console.log(`📝 ${outpdfname}`)
}
const JSONify = (arr, filename, jsonpath) => {
    const file = readFile(filename)
    const outfilename = getOutputFilename(filename, '')
        // console.log(outfilename)
    file.data.link = absUrl + outfilename
    file.data.content = file.html
    arr.push(file.data)
    var json = JSON.stringify(arr);
    fs.writeFileSync(path.resolve(jsonpath, 'search.json'), json, 'utf8');

}
const buildRssFeed = () => {
    import ('./rss-generator.js')
}

const copystatic = (srcPath, outPath) => {
    mkdirp.sync(path.join(outPath, 'static/css'))
    mkdirp.sync(path.join(outPath, 'static/js'))
    const jsonoutPath = path.join(outPath, 'static/')
    const cssOutPath = path.join(outPath, 'static/css')
    const jsOutPath = path.join(outPath, 'static/js')

    const cssfilenames = glob.sync(srcPath + '/**/*.css')
    cssfilenames.forEach((cssfilename) => {
        const cssoutfilename = path.basename(cssfilename)
        fs.copyFileSync(cssfilename, path.join(cssOutPath, cssoutfilename))
    })

    const jsfilenames = glob.sync(srcPath + '/**/*.js')
    jsfilenames.forEach((jsfilename) => {
        const jsoutFilename = path.basename(jsfilename)
        fs.copyFileSync(jsfilename, path.join(jsOutPath, jsoutFilename))
    })
    const htmlfileNames = glob.sync(srcPath + '/**/*.html')
    htmlfileNames.forEach((htmlfilename) => {
        if (!htmlfilename.includes('template.html')) {
            const htmloutFilename = path.basename(htmlfilename)
            fs.copyFileSync(htmlfilename, path.join(outPath, htmloutFilename))
        }
    })

    fs.copyFileSync(path.join(srcPath, '/static/search.json'), path.join(jsonoutPath, 'search.json'))
}

const main = () => {
    const srcPath = path.resolve(config.source_dir || 'content')
    const staticPath = path.resolve(config.template_dir || 'templates/initial/')
    const outPath = path.resolve(config.output_dir || 'docs')
    const template = fs.readFileSync(config.templateHTML || './templates/initial/template.html', 'utf8')
    const filenames = glob.sync(srcPath + '/**/*.md')
    const jsonPath = path.resolve(config.json_dir || 'templates/initial/static')
    const arr = []

    filenames.forEach((filename) => {
        processFile(filename, template, outPath)
        JSONify(arr, filename, jsonPath)
    })
    copystatic(staticPath, outPath)
    buildRssFeed()
}

main();