import {promises as fsPromises} from 'fs';

const fileName = new URL('.', import.meta.url).pathname
    + '../assets/pie-chart.jpg';

export async function handleGet() {
    return {
        mime: 'image/jpg',
        data: fsPromises.readFile(fileName),
    };
}
