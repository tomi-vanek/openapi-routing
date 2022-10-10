import {promises as fsPromises} from 'fs';
import path from 'path';

const fileName = 'pie-chart.jpg';
const __dirname = path.join(new URL('.', import.meta.url).pathname + '');
const fileNameWithPath = path.join(__dirname, '../assets/', fileName);

// this handler shows, how to provide binary value in response
export async function handleGet(params) {

    const result = {
        mime: 'image/jpg',
        data: fsPromises.readFile( fileNameWithPath ),
    };

    // If we add to the response also file name,
    //   the binary data in HTTP response will be provided as download,
    //   browser will not try to render it.
    if (params.download) {
        result.fileName = fileName;
    }

    return result;
}
