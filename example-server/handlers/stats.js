import {promises as fsPromises} from 'fs';
import path from 'path';

const fileName = 'pie-chart.jpg';
const fileNameWithPath = path.normalize(
    new URL('.', import.meta.url).pathname + '../assets/' + fileName
);

// this handler shows, how to provide binary value in response
export async function handleGet(params) {

    const result = {
        mime: 'image/jpg',
        data: fsPromises.readFile( fileNameWithPath ),
    };

    if (params.download) {
        result.fileName = fileName;
    }

    return result;
}
