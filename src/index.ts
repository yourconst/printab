import * as _Elements from './Elements';
import * as _Helpers from './helpers';

export function printab<O extends _Helpers.TRow>(
    rows: O[],
    options?: _Elements.TTableOptions<O>,
    target?: Console | HTMLElement | ((data: string) => any),
) {
    const table = new _Elements.Table(rows, options);

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

export { _Elements as Elements };
export { _Helpers as Helpers };

export namespace printab {
    export import Elements = _Elements;
    export import Helpers = _Helpers;

    export type BuildType = 'console' | 'html';

    export function build<O extends _Helpers.TRow>(
        rows: O[],
        options?: _Elements.TTableOptions<O>,
        type: BuildType = 'console',
    ) {
        const table = new _Elements.Table(rows, options);
    
        if (type === 'console') {
            return table.buildConsole();
        }
    
        return table.buildHtml();
    }
}

export default printab;
