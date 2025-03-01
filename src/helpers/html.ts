import { Align, Color, VAlign } from "./common";
import { applyAlign } from "./console";

export function escape(s: string) {
    // &nbsp;
    return s.replaceAll(' ', ' ').replaceAll('\n', '<br />');
}

function getAlign(align: Align) {
    return align === 'number' ? 'right' : align;
}

function getColor(color: Color) {
    return color === 'default' ? '' : color;
}

export function buildRow(buffer: string[], values: string[], options: {
    colors: Color[];
    widths: [number, number][]
    indent: number;
    vindent: number;
    aligns: Align[];
    valigns: VAlign[];
    td: 'td' | 'th';
}) {
    buffer.push('<tr>');

    for (let i = 0; i < values.length; ++i) {
        let value = applyAlign(options.aligns[i], values[i]??'', options.widths[i][0], options.widths[i][1]);

        if (options.aligns[i] === 'number') {
            // value = value.replace('.', '&nbsp;.');
            if (!value.includes('.') && value.at(-1) === ' ') {
                value = value.slice(0, -1) + '&nbsp;';
            }
        }

        buffer.push(
`    <${options.td} indent=${options.indent} align="${getAlign(options.aligns[i])}" valign="${options.valigns[i]}">
        <font color="${getColor(options.colors[i])}">${escape(value)}</font>
    </${options.td}>`);
    }

    buffer.push('</tr>');
}
