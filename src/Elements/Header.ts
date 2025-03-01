import * as Helpers from '../helpers';
import type { Table } from './Table';

export interface IHeaderOptions {
    name?: string;
    color?: Helpers.Color;
    align?: Helpers.Align;
}
export type THeaderOptions = IHeaderOptions | string;

export class Header<O extends Helpers.TRow, P extends keyof O = keyof O> {
    static parseOptions(o?: THeaderOptions): Helpers.RecursiveRequired<IHeaderOptions> {
        if (typeof o === 'string') {
            return {
                name: o,
                align: 'center',
                color: 'default',
            };
        }
        return {
            name: '',
            align: 'center',
            color: 'default',
            ...o,
        };
    }

    readonly options: Helpers.RecursiveRequired<IHeaderOptions>;

    constructor(readonly table: Table<O>, options?: THeaderOptions) {
        this.options = Header.parseOptions(options);
    }

    get minWidth() {
        return Helpers.Console.getWidth(this.options.name || '') + 2 * this.table.border.indent + 2;
    }

    get hasName() {
        return !!this.options.name;
    }
}
