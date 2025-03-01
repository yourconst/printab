import { Align, Color, colors, setStringMaxWidth, VAlign } from "./common";

export const lines = { v: '│', h: '─', tl: '┌', tr: '┐', ml: '├', mr: '┤', mt: '┬', mb: '┴', bl: '└', br: '┘', x: '┼' };

export function applyColor(c: Color, s: string) {
    return colors[c] + s;
}

function _getWidth(s: string) {
    return s.replace(/\x1b\[([0-9]{1,2})m/ig, '').length;
}

export interface Size {
    width: number;
    height: number;
}

export function getSizes(s: string): Size {
    const lines = s.split('\n');

    return {
        width: Math.max(...lines.map(line => _getWidth(line))),
        height: lines.length,
    };
}

export function getWidth(s: string) {
    return getSizes(s).width;
}

export function applyAlign(align: Align, value: string, width: number, widthDecimals = 0): string {
    if (align === 'number' && !widthDecimals) {
        align = 'right';
    }

    const consoleLength = getWidth(value);

    const wmvl = Math.max(0, width - consoleLength);

    if (align === 'left') {
        return value + ' '.repeat(wmvl);
    } else
    if (align === 'right') {
        return ' '.repeat(wmvl) + value;
    } else
    if (align === 'center') {
        return ' '.repeat((wmvl) >> 1) + value + ' '.repeat(Math.ceil((wmvl) / 2));
    } else {
        const parts = value.split('.');

        return applyAlign('right', parts[0], width - 1 - widthDecimals) +
            (parts[1] ?
                '.' + applyAlign('left', parts[1], widthDecimals) :
                ' '.repeat(1 + widthDecimals));
    }
}

function buildLine(buffer: string[], options: {
    widths: [number, number][];
    indent: number;
    left: string;
    middle: string;
    right: string;
    delim: string;
    borderColor: Color;
}) {
    const bc = colors[options.borderColor];
    const { left, middle, right, delim } = options;

    buffer.push(bc, left);
    for (let i = 0; i < options.widths.length; ++i) {
        const [columnWidth] = options.widths[i];

        buffer.push(bc, delim.repeat(columnWidth + 2 * options.indent));

        if (i !== options.widths.length - 1) {
            buffer.push(bc, middle);
        }
    }
    buffer.push(bc, right, '\n');
}

export function buildRow(buffer: string[], values: string[], options: {
    colors: Color[];
    widths: [number, number][];
    indent: number;
    vindent: number;
    aligns: Align[];
    valigns: VAlign[];
    type: VAlign | 'aftertop';
    borderColor: Color;
}) {
    // const buffer: string[] = [];

    const bc = colors[options.borderColor];

    const width = options.widths.reduce((acc, width) => acc + width[0] + 2 * options.indent + 1, 1);
    let innerHeight = 0;

    const valuesByLines = values.map((v, i) => {
        const ls = setStringMaxWidth(v, options.widths[i][0]);

        innerHeight = Math.max(innerHeight, ls.length);

        return ls;
    });

    if (options.type === 'top') {
        buildLine(buffer, {
            widths: options.widths,
            indent: options.indent,
            borderColor: options.borderColor,
            delim: lines.h,
            left: lines.tl,
            middle: lines.mt,
            right: lines.tr,
        });
    } else {
        buildLine(buffer, {
            widths: options.widths,
            indent: options.indent,
            borderColor: options.borderColor,
            delim: lines.h,
            left: lines.ml,
            middle: options.type === 'aftertop' ? lines.mt : lines.x,
            right: lines.mr,
        });
    }

    for (let i = 0; i < options.vindent; ++i) {
        buildLine(buffer, {
            widths: options.widths,
            indent: options.indent,
            borderColor: options.borderColor,
            delim: ' ',
            left: lines.v,
            middle: lines.v,
            right: lines.v,
        });
    }

    for (let i = 0; i < valuesByLines.length; ++i) {
        if (options.valigns[i] === 'top') {
            continue;
        }

        const cnt = options.valigns[i] === 'middle'
            ? (innerHeight - valuesByLines[i].length) >> 1
            : innerHeight - valuesByLines[i].length;

        for (let j = 0; j < cnt; ++j) {
            valuesByLines[i].unshift('');
        }
    }

    for (let i = 0; i < innerHeight; ++i) {
        buffer.push(bc, lines.v);
        for (let j = 0; j < valuesByLines.length; ++j) {
            buffer.push(' '.repeat(options.indent));
            buffer.push(applyColor(
                options.colors[j],
                applyAlign(options.aligns[j], valuesByLines[j][i] ?? '', options.widths[j][0], options.widths[j][1]),
            ));
            buffer.push(' '.repeat(options.indent), bc, lines.v);
        }
        buffer.push('\n');
    }

    for (let i = 0; i < options.vindent; ++i) {
        buildLine(buffer, {
            widths: options.widths,
            indent: options.indent,
            borderColor: options.borderColor,
            delim: ' ',
            left: lines.v,
            middle: lines.v,
            right: lines.v,
        });
    }

    if (options.type === 'bottom') {
        buildLine(buffer, {
            widths: options.widths,
            indent: options.indent,
            borderColor: options.borderColor,
            delim: lines.h,
            left: lines.bl,
            middle: lines.mb,
            right: lines.br,
        });
    }
}
