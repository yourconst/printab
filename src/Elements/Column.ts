import * as Helpers from '../helpers';
import * as Common from "./common";
import type { Table } from './Table';
import { Header, IHeaderOptions, THeaderOptions } from './Header';

export type TCellTransformer<O extends Helpers.TRow> = (row: O) => any;

export type IColumnOptions<O extends Helpers.TRow, P extends keyof O = keyof O> = {
    field?: P;
    transform?: TCellTransformer<O>;
    header?: THeaderOptions;
    color?: Helpers.Color;
    align?: Helpers.Align;
    valign?: Helpers.VAlign;
    number?: Common.INumberOptions;
    empty?: Common.TEmptyOptions;
} & ({
    field: P;
} | ({
    transform: TCellTransformer<O>;
} & ({
    header: string | Required<Pick<IHeaderOptions, 'name'>> & IHeaderOptions;
} | {
    field: P;
})));
export type TColumnOptions<O extends Helpers.TRow, P extends keyof O = keyof O> = IColumnOptions<O, P> | P;

export class Column<O extends Helpers.TRow, P extends keyof O = keyof O> {
    readonly field?: P;
    readonly transform?: TCellTransformer<O>;
    readonly header: Helpers.RecursiveRequired<IHeaderOptions>;
    readonly align: Helpers.Align;
    readonly valign: Helpers.VAlign;
    readonly color: Helpers.Color;
    readonly number: Helpers.RecursiveRequired<Common.INumberOptions>;
    readonly empty: Helpers.RecursiveRequired<Common.IEmptyOptions>;
    _width = 0;
    _widthDecimals = 0;

    readonly range = {
        min: 0,
        max: 0,
    };

    readonly cells: string[] = [];

    constructor(readonly table: Table<O>, options: TColumnOptions<O, P>) {
        const o: IColumnOptions<O, P> = typeof options === 'object' ? options: { field: <P> options };

        this.field = o.field;
        this.transform = o.transform;
        this.header = Header.parseOptions(o.header);
        this.header.name ||= <string> this.field;
        
        this.align = o.align ??
            (this.table.rows.every(row => {
                const value = this.getValue(row);
                return typeof value === 'number' || value === undefined || value === null;
            }))
                ? 'number' : 'left';
        this.valign = o.valign ?? 'middle';
        this.color = o.color ?? (this.isNumber ? 'yellow' : 'default');
        this.number = Common.parseNumberOptions(o.number, this.table.number);

        this.empty = Common.parseEmpty(o.empty, this.table.empty);

        this._width = Helpers.Console.getWidth(this.header.name);
    }

    get isNumber() { return this.align === 'number'; }

    get width() {
        return this._width + this._widthDecimals + (this._widthDecimals > 0 ? 1 : 0);
    }

    getValue(o: O) {
        return this.transform ? this.transform(o) : o[this.field!];
    }

    update(o: O) {
        const v = this.getValue(o);

        let s: string = (this.isNumber && typeof v === 'number' && typeof this.number.decimals === 'number')
            ? v.toString()
            : v === null
            ? this.empty.null
            : v === undefined
            ? this.empty.undefined
            : v.toString();

        if (this.isNumber) {
            if (typeof this.number.decimals === 'number' || typeof this.number.multiplier === 'number' || this.number.resolutions) {
                let num = Helpers.getNumber(s);

                if (num) {
                    s = s.replace(num, Common.applyNumberOptions(+num, this.number));
                }
            }

            const parts = s.split('.');
            // if (typeof this.number.decimals === 'number') {
            //     parts[1] = parts[1]?.slice(0, this.number.decimals);
            // }
            this._widthDecimals = Math.max(this._widthDecimals, Helpers.Console.getWidth(parts[1] || ''));
            this._width = Math.max(this._width, Helpers.Console.getWidth(parts[0]) + this._widthDecimals);
            this.cells.push(parts[1] ? parts.join('.') : parts[0]);
        } else {
            this._width = Math.max(this._width, Helpers.Console.getWidth(s));
            this.cells.push(s);
        }
    }

    get isFirst() {
        return this.table.columns[0] === this;
    }

    get isLast() {
        return this.table.columns.at(-1) === this;
    }
}
