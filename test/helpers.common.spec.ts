import printab from '../dist';
import { expect } from 'chai';

describe('Helpers', () => {
    it('getNumber', () => {
        expect(printab.Helpers.getNumber('x 123%')).eq('123');
        expect(printab.Helpers.getNumber('x 123.1234567%')).eq('123.1234567');
        expect(printab.Helpers.getNumber('x 123.1234567%23498 4325')).eq('123.1234567');
        expect(printab.Helpers.getNumber('x 123.1234567 23498 4325')).eq('123.1234567');
        expect(printab.Helpers.getNumber('123.1234567 23498 4325')).eq('123.1234567');
        expect(printab.Helpers.getNumber(123.1234567)).eq('123.1234567');
        expect(printab.Helpers.getNumber('x asd%')).eq(undefined);
    });

    it('setStringMaxWidth', () => {
        expect(printab.Helpers.setStringMaxWidth('asd as djadsjo', 5)).deep.eq(['asd a', 's dja', 'dsjo']);
        expect(printab.Helpers.setStringMaxWidth('asd\nas\ndjadsjo', 5)).deep.eq(['asd', 'as', 'djads', 'jo']);
        expect(printab.Helpers.setStringMaxWidth('asd as djadsjo', 1)).deep.eq('asd as djadsjo'.split(''));
    });

    it('sortByOrder', () => {
        const data = [
            { p1: 1, p2: '3', p3: 'bcd' },
            { p1: 1, p2: '2', p3: 'abcde' },
            { p1: 2, p2: '2', p3: 'abcd' },
            { p1: 2, p2: '1', p3: 'c' },
            { p1: 3, p2: '1', p3: 'abc' },
            { p1: 4, p2: '3', p3: 'abc' },
        ];

        const original = [...data];
        
        expect(printab.Helpers.sortByOrder(data, [])).not.eq(data);
        expect(data).deep.eq(original);
        expect(printab.Helpers.sortByOrder(data, ['p3', 'p1'])).not.eq(data);
        expect(data).deep.eq(original);
        expect(printab.Helpers.sortByOrder(data, ['p3', 'p1'], false)).not.eq(data);
        expect(data).deep.eq(original);

        expect(printab.Helpers.sortByOrder(data, ['p3'], true)).eq(data);
        expect(data).not.deep.eq(original);

        expect(printab.Helpers.sortByOrder(data, ['p3', 'p2', 'p1'])).deep.eq([
            original[4],
            original[5],
            original[2],
            original[1],
            original[0],
            original[3],
        ]);
    });
});
