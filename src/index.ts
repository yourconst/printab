import { Table, TTableOptions } from './Elements';
import type * as Helpers from './helpers';

export function print<O extends Helpers.TRow>(
    rows: O[],
    options?: TTableOptions<O>,
    target?: Console | HTMLElement | ((data: string) => any),
) {
    const table = new Table(rows, options);

    if (!target || target === console) {
        console.log(table.buildConsole());
    } else
    if (typeof target === 'function') {
        target(table.buildConsole());
    } else
    if (target instanceof HTMLElement) {
        const tmp = document.createElement('span');
        tmp.innerHTML = table.buildHtml();
        target.appendChild(tmp.childNodes[0]);
    } else {
        throw new Error('printab: Wrong print target');
    }
}

export function build<O extends Helpers.TRow>(
    type: 'console' | 'html',
    rows: O[],
    options?: TTableOptions<O>,
) {
    const table = new Table(rows, options);

    if (type === 'console') {
        return table.buildConsole();
    }

    return table.buildHtml();
}

type Extra = {
    print?: typeof print;
    build?: typeof build;
}

const dflt: typeof print & Extra = print;

dflt.print = print;
dflt.build = build;

export default <typeof print & Required<Extra>> dflt;
