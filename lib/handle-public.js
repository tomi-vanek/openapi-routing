import { responseFile } from './responses.js';
import path from 'path';

// TODO: public directories should be configurable
const publicRoutes = ['/ui', '/assets'];

// handle requests for static files in public directories
export async function handlePublicFile( req, res, rootDir ) {
    const { pathname } = new URL(req.url.startsWith('http') ? req.url : 'http://localhost' + req.url);

    // TODO: maybe this normalization os not necessary
    rootDir = rootDir ? normalize(rootDir) : '';

    const fileName = path.join(rootDir, pathname);

    if ( publicRoutes.some(x => pathname.startsWith(x)) ) {
        return await responseFile(res, fileName);
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