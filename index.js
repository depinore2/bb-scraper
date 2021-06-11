const { JSDOM } = require('jsdom');
const axios = require('axios');
const fs = require('fs');

const url = process.argv[2] || 'https://www.spotrac.com/mlb/statistics/player/';
async function main() {
    const html = (await axios.get(url)).data;
    const dom = new JSDOM(html);
    const headings = [...dom.window.document.querySelectorAll('th')].map(heading => heading.innerHTML).join(',')
    const rows = [...dom.window.document.querySelectorAll('[data-cap]')].map(row => [...row.querySelectorAll('td')].map(td => `"${td.querySelector('a')?.innerHTML || td.innerHTML}"`).join(',')).join('\n')

    var output = [headings, rows].join('\n');
    fs.writeFileSync('./out.csv', output);
}
main();