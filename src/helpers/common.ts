export const colors = {
    default: '\x1b[0m',
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    purple: '\x1b[35m',
    lightblue: '\x1b[36m',
};

export type Color = keyof typeof colors;
export type Align = 'left' | 'center' | 'right' | 'number';
export type VAlign = 'top' | 'middle' | 'bottom';

export type TRow = Record<string, any>;

export type RecursiveRequired<T> = Required<{
    [P in keyof T]: T[P] extends object | undefined ? RecursiveRequired<Required<T[P]>> : T[P];
}>;

export function setStringMaxWidth(s: string, maxWidth: number) {
    const lines = s.split('\n');

    const result: string[] = [];

    for (const line of lines) {
        if (line.length <= maxWidth) {
            result.push(line);
            continue;
        }

        for (let i = 0; i < line.length; i += maxWidth) {
            result.push(line.substring(i, i + maxWidth));
        }
    }

    return result;
}

export type Property = string | number | symbol;

export type Order = 'asc' | 'desc';
export type OrderBy<T extends Property> = T | {
    field: T;
    order?: Order;
}

export function sortByOrder<O extends TRow>(array: O[], order: OrderBy<keyof O>[], mutate = false) {
    if (!mutate) {
        array = array.slice();
    }

    const os = order.map(o =>
        typeof o !== 'object'
            ? ({
                f: o,
                o: 1,
            })
            : ({
                f: o.field,
                o: o.order === 'desc' ? -1 : 1,
            }));

    return array.sort((a, b) => {
        for (const o of os) {
            const av = a[o.f];
            const bv = b[o.f];

            let res = o.o;
            
            res *= av > bv ? 1 : av === bv ? 0 : -1;

            // if (typeof av === 'number') {
            //     res *= av - bv;
            // } else {
            //     res *= av > bv ? 1 : av === bv ? 0 : -1;
            // }

            if (res !== 0) {
                return res;
            }
        }
        return 0;
    });
}

const numberRegExp = /-{0,1}[0-9]+(\.([0-9])*)*/g;
export function getNumber(value: number | string): string | undefined {
    if (typeof value === 'number') {
        return value.toString();
    }

    return value.match(numberRegExp)?.[0];
}
