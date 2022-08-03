import { promises as fsPromises } from "fs";
import YAML from 'yaml'

export async function readSchema(fileName) {
    const content = (await fsPromises.readFile(fileName)).toString();
    const type = fileName.split('.').pop().toLowerCase();

    if (['json'].includes(type)) {
        return JSON.parse(content);
    } else if (['yaml', 'yml'].includes(type)) {
        return YAML.parse(content);
    } else {
        throw new Error(`File type must be either JSOM or YAML, but is ${type}.`);
    }
}
