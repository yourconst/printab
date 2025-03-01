import table from "../src";
import * as Helpers from "../src/helpers";

const text = 'askdbkaflfa;\nluhf;sa;fash;afskfbkfsaafkashbfilasfikbl';
const formatted = Helpers.setStringMaxWidth(text, 10);

console.log(formatted);
console.log(Helpers.Console.getSizes(formatted.join('\n')));

console.log(table.print([
    { "id": 5001, "type": "None" },
    { "id": 5002, "type": "Glazed" },
    { "id": 5005, "type": "Sugar" },
    { "id": 5005, "type": "1Sugar" },
    { "id": 5005.123, "type": "5Sugar" },
    { "id": 5005, "type": "2Sugar" },
    { "id": 5007, "type": "Powdered Sugar" },
    { "id": 5006, "type": "Chocolate\nwith\nSprinkles\ntrailing\nm" },
    { "id": 1235003, "type": "Chocolate" },
    { "id": 5004, "type": "Maple", "optional": null },
    { "id": 5004, "type": "Maple", "optional": "value" },
], {
    header: {
        name: 'Test',
        color: 'blue',
    },
    columns: [
        { field: 'id', color: 'green', align: 'number', valign: 'middle' },
        { field: 'type', color: 'red', align: 'right' },
        { field: 'optional' },
        { header: 'transformed', transform: (row) => row.id/*  + row.type + row.optional */, color: 'lightblue', valign: 'top' },
    ],
    order: [
        { order: 'desc', field: 'id' },
        { order: 'asc', field: 'type' },
        { order: 'desc', field: 'optional' },
    ],
    border: { color: 'default', indent: 1, vindent: 0 },
    // empty: {
    //     null: 'hello',
    // },
}));

table.print([{
    hello: 'world',
    more: 'one',
    number: 123,
}]);
