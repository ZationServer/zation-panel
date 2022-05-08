import {uniqueNamesGenerator, adjectives, colors, names, animals} from "unique-names-generator";
import {ServerType} from "../definitions/serverInformation";

const combinedNameAdjective = [...adjectives,...colors];
const combinedNames = [...names,...animals];

export function generateServerName(id: string, type: ServerType): string {
    return uniqueNamesGenerator({
        dictionaries: [combinedNameAdjective,combinedNames],
        seed: type + id,
        separator: " ",
        style: 'capital'
    });
}