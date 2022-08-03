import { responseFile } from './responses.js';

// TODO: public directories should be configurable
const publicRoutes = ['/ui', '/assets'];

// handle requests for static files in public directories
export async function handlePublicFile( req, res, rootDir ) {
    const { pathname } = new URL(req.url.startsWith('http') ? req.url : 'http://localhost' + req.url);
    rootDir = rootDir ? normalize(rootDir) : '';

    const fileName = rootDir + pathname;

    if ( publicRoutes.some(x => pathname.startsWith(x)) ) {
        await responseFile(res, fileName);
        return true;
    } else {
        return false;
    }
}

function normalize(fileName) {
    fileName = fileName ? fileName + '' : '';
    if (fileName.endsWith('/')) {
        // remove ending slash character
        fileName = fileName.substring(0, fileName.length - 1);  
    }

    return fileName;
}