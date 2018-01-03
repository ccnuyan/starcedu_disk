import fs from 'fs';
import path from 'path';
import config from '../../config';
import assets from '../../build/assets.json'; // eslint-disable-line

let rawIndexHTML = fs.readFileSync(path.join(__dirname, './index.html'), 'utf-8');

rawIndexHTML = rawIndexHTML.replace('_starc_edu_title_', config.title);

const styles =
    Object.keys(config.resources.stylesheets).map(key => (
        `<link href="${config.resources.stylesheets[key]}" rel="stylesheet"/>`));
styles.push(`<link href="${assets.app.css}" rel="stylesheet"/>`);
rawIndexHTML = rawIndexHTML.replace('_starc_edu_styles_', styles.join('\n'));

const scripts =
    Object.keys(config.resources.scripts).map(key => (
        `<script src="${config.resources.scripts[key]}"></script>`));

scripts.push(`<script src="${assets.vendor.js}"></script>`);
scripts.push(`<script src="${assets.app.js}"></script>`);

rawIndexHTML = rawIndexHTML.replace('_starc_edu_scripts_', scripts.join('\n'));

const indexHTML = rawIndexHTML;

export default indexHTML;

