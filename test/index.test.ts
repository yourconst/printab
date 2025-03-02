import printab from "../dist";

describe('Fake', () => {
    it('Simple', () => {
        const build = printab.build([{
            hello: 'world',
            more: 'one',
            number: 123,
        }]);

        expect(build).toEqual(build);
    });
});

const text = 'askdbkaflfa;\nluhf;sa;fash;afskfbkfsaafkashbfilasfikbl';
const formatted = printab.Helpers.setStringMaxWidth(text, 10);

console.log(formatted);
console.log(printab.Helpers.Console.getSizes(formatted.join('\n')));

printab([
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
});

const data = [{"label":"second","duration_avg":0.07973605049699545,"duration_min":0.07777136498689652,"duration_max":0.08193187700212001,"duration_sum":797.3605049699545,"duration_cnt":10000,"memory_avg":-307.2984,"memory_min":-8679.896,"memory_max":8177.88,"memory_sum":-3072984,"memory_cnt":10000},{"label":"fourth","duration_avg":0.080668842099607,"duration_min":0.07925988399982452,"duration_max":0.08253437399864197,"duration_sum":806.6884209960699,"duration_cnt":10000,"memory_avg":-202.3712,"memory_min":-8499.552,"memory_max":8175.096,"memory_sum":-2023712,"memory_cnt":10000},{"label":"first","duration_avg":0.08112376850098371,"duration_min":0.08007294400036336,"duration_max":0.08263357500731945,"duration_sum":811.2376850098372,"duration_cnt":10000,"memory_avg":-161.4576,"memory_min":-8523.888,"memory_max":8211.464,"memory_sum":-1614576,"memory_cnt":10000}];
const decimals = 3;
const base = data[0];
const timeResolutions = { s: 1, ms: 1e-3, us: 1e-6, ns: 1e-9 };
const memoryResolutions = { B: 1, KB: 1e3, MB: 1e6, GB: 1e9 };
const timeMult = 1e3;



printab(data, {
    header: {
        name: `Per unit count: ${base.duration_cnt}`,
        color: 'yellow',
    },
    number: { decimals },
    columns: [
        'label',
        { header: 'Duration:', transform: () => '', align: 'left' },
        { header: 'avg', field: 'duration_avg', align: 'number', number: { multiplier: timeMult, resolutions: timeResolutions } },
        { header: 'avg%', transform: (r) => `x ${r.duration_avg/base.duration_avg}`, color:'green', align: 'number' },
        { header: 'min', field: 'duration_min', align: 'number', number: { multiplier: timeMult, resolutions: timeResolutions } },
        { header: 'min%', transform: (r) => `x ${r.duration_min/base.duration_min}`, color:'green', align: 'number' },
        { header: 'max', field: 'duration_max', align: 'number', number: { multiplier: timeMult, resolutions: timeResolutions } },
        { header: 'max%', transform: (r) => `x ${r.duration_max/base.duration_max}`, color:'green', align: 'number' },
        { header: 'Memory:', transform: () => '', align: 'left' },
        { header: 'avg', field:'memory_avg', color:'yellow', align:'number', number: { resolutions: memoryResolutions } },
        { header: 'min', field:'memory_min', color:'yellow', align:'number', number: { resolutions: memoryResolutions } },
        { header: 'max', field:'memory_max', color:'yellow', align:'number', number: { resolutions: memoryResolutions } },
    ],
});
