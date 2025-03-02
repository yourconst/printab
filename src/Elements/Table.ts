import * as Helpers from '../helpers';
import * as Common from "./common";
import { Column, TColumnOptions } from './Column';
import { Header, THeaderOptions } from './Header';

export interface ITableOptions<O extends Helpers.TRow> {
    header?: THeaderOptions;
    columns?: TColumnOptions<O, keyof O>[];
    border?: Common.IBorderOptions;
    order?: Helpers.OrderBy<keyof O>[];
    number?: Common.INumberOptions;
    empty?: Common.TEmptyOptions;
    target?: Console | NodeJS.WriteStream | HTMLElement;
}
export type TTableOptions<O extends Helpers.TRow> = ITableOptions<O> | string;
export class Table<O extends Helpers.TRow, P extends keyof O = keyof O> {
    readonly header: Header<O>;
    readonly columns: Column<O>[];
    readonly border: Helpers.RecursiveRequired<Common.IBorderOptions>;
    readonly number: Common.INumberOptions;
    readonly empty: Helpers.RecursiveRequired<Common.IEmptyOptions>;

    constructor(readonly rows: O[], options: TTableOptions<O> = {}) {
        if (typeof options === 'string') {
            options = {header: {name: options}};
        }

        if (options.order) {
            this.rows = Helpers.sortByOrder(this.rows, options.order, false);
        }

        this.header = new Header(this, options.header);
        
        if (!options.columns) {
            // options.columns = <P[]>Object.keys(this.rows[0]);
            options.columns = <P[]>[...new Set(this.rows.flatMap(row => Object.keys(row)))];
        }


        this.empty = Common.parseEmpty(options.empty);

        this.columns = options.columns.map(c => new Column(this, c));

        this.number = Common.parseNumberOptions(options.number);

        this.border = {
            color: 'default',
            indent: 1,
            vindent: 0,
            ...options.border,
        };
    }

    get width() {
        return this.columns.reduce((w, c) => w + c.width, 1 + this.columns.length * (1 + 2 * this.border.indent));
    }

    protected update() {
        for (const r of this.rows) {
            for (const c of this.columns) {
                c.update(r);
            }
        }

        if (this.width < this.header.minWidth) {
            const dw = Math.ceil((this.header.minWidth - this.width) / this.columns.length);

            for (const c of this.columns) {
                c._width += dw;
            }
        }

        return this;
    }

    buildConsole() {
        this.update();

        const buffer: string[] = [];

        if (this.header.hasName) {
            Helpers.Console.buildRow(buffer, [this.header.options.name], {
                colors: [this.header.options.color],
                widths: [[this.width - 2, 0]],
                aligns: [this.header.options.align],
                valigns: ['middle'],
                indent: 0, // this.border.indent,
                vindent: 0, // this.border.vindent,
                borderColor: this.border.color,
                type: 'top',
            });
        }

        const headersOptions: Parameters<typeof Helpers.Console.buildRow>[2] = {
            colors: [],
            widths: [],
            aligns: [],
            valigns: [],
            indent: this.border.indent,
            vindent: this.border.vindent,
            borderColor: this.border.color,
            type: this.header.hasName ? 'aftertop' : 'top',
        };

        const rowsOptions: Parameters<typeof Helpers.Console.buildRow>[2] = {
            colors: [],
            widths: [],
            aligns: [],
            valigns: [],
            indent: this.border.indent,
            vindent: this.border.vindent,
            borderColor: this.border.color,
            type: 'middle',
        };

        for (const column of this.columns) {
            headersOptions.colors.push(column.header.color);
            headersOptions.widths.push([column.width, 0]);
            headersOptions.aligns.push(column.header.align);
            headersOptions.valigns.push('middle');

            rowsOptions.colors.push(column.color);
            rowsOptions.widths.push([column.width, column._widthDecimals]);
            rowsOptions.aligns.push(column.align);
            rowsOptions.valigns.push(column.valign);
        }

        Helpers.Console.buildRow(buffer, this.columns.map(c => c.header.name), headersOptions);

        for (let i = 0; i < this.rows.length; ++i) {
            if (i === this.rows.length - 1) {
                rowsOptions.type = 'bottom';
            }

            Helpers.Console.buildRow(buffer, this.columns.map(c => c.cells[i]), rowsOptions);
        }

        return buffer.join('');
    }

    buildHtml() {
        this.update();

        const buffer: string[] = [];

        // cellspacing,cellpadding,border
        buffer.push(`<table cellspacing="0" border="1" cellpadding="${this.border.indent*10}" style="border-color: ${this.border.color}">`);

        const headersOptions: Parameters<typeof Helpers.Html.buildRow>[2] = {
            colors: [],
            widths: [],
            aligns: [],
            valigns: [],
            indent: this.border.indent,
            vindent: this.border.vindent,
            td: 'th',
        };

        const rowsOptions: Parameters<typeof Helpers.Html.buildRow>[2] = {
            colors: [],
            widths: [],
            aligns: [],
            valigns: [],
            indent: this.border.indent,
            vindent: this.border.vindent,
            td: 'td',
        };

        for (const column of this.columns) {
            headersOptions.colors.push(column.header.color);
            headersOptions.widths.push([column.width, 0]);
            headersOptions.aligns.push(column.header.align);
            headersOptions.valigns.push('middle');

            rowsOptions.colors.push(column.color);
            rowsOptions.widths.push([column.width, column._widthDecimals]);
            rowsOptions.aligns.push(column.align);
            rowsOptions.valigns.push(column.valign);
        }

        buffer.push('<thead>');
        if (this.header.hasName) {
            Helpers.Html.buildRow(buffer, [this.header.options.name], {
                colors: [this.header.options.color],
                widths: [[this.width - 2, 0]],
                aligns: [this.header.options.align],
                valigns: ['middle'],
                indent: 0,
                vindent: 0,
                td: 'th',
            });

            buffer[buffer.length - 2] = buffer[buffer.length - 2].replace('<th ', `<th colspan=${this.columns.length} `);
        }

        Helpers.Html.buildRow(buffer, this.columns.map(c => c.header.name), headersOptions);
        buffer.push('</thead>');

        buffer.push('<tbody>');
        for (let i = 0; i < this.rows.length; ++i) {
            Helpers.Html.buildRow(buffer, this.columns.map(c => c.cells[i]), rowsOptions);
        }
        buffer.push('</tbody>');

        buffer.push('</table>');

        return buffer.join('\n');
    }
}
