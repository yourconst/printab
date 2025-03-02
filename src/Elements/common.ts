import * as Helpers from '../helpers';

export type ResolutionsDictionary = Record<string, number>;

export interface INumberOptions {
    decimals?: number;
    /**
     * @deprecated Multiply first number entry
     * 
     * NOTE: this functionality may change in future
     */
    multiplier?: number;
    resolutions?: ResolutionsDictionary;
    resolutionDelimeter?: string;
}

export type TEmptyReplacement = string | number | boolean;
export interface IEmptyOptions {
    null?: TEmptyReplacement;
    undefined?: TEmptyReplacement;
}
export type TEmptyOptions = TEmptyReplacement | IEmptyOptions;

export interface IBorderOptions {
    color?: Helpers.Color;
    indent?: number;
    vindent?: number;
};

export function parseNumberOptions(o?: INumberOptions, ref?: INumberOptions): Helpers.RecursiveRequired<INumberOptions> {
    return {
        decimals: <any> ref?.decimals ?? o?.decimals ?? 3,
        multiplier: <any> ref?.multiplier ?? o?.multiplier ?? undefined,
        resolutions: <any> ref?.resolutions ?? o?.resolutions ?? undefined,
        resolutionDelimeter: <any> ref?.resolutionDelimeter ?? o?.resolutionDelimeter ?? undefined,
        ...ref,
        ...o,
    };
}

export function parseEmpty(options?: TEmptyOptions, ref?: IEmptyOptions): Helpers.RecursiveRequired<IEmptyOptions> {
    return typeof options === 'object'
        ? {
            null: options.null ?? ref?.null ?? '',
            undefined: options.undefined ?? ref?.undefined ?? '',
        }
        : {
            null: options ?? ref?.null ?? '',
            undefined: options ?? ref?.undefined ?? '',
        };
}

export function getOrderedResolutions(resolutions: ResolutionsDictionary) {
    return Object.entries(resolutions).map(([key, unit]) => ({ key, unit })).sort((a, b) => a.unit - b.unit);
}

export function applyNumberOptions(value: number, options: INumberOptions) {
    const { decimals, multiplier = 1, resolutions, resolutionDelimeter } = options;

    value *= multiplier;

    if (!resolutions) {
        return String(+value.toFixed(decimals));
    }

    const rs = getOrderedResolutions(resolutions);

    let selected = rs[0];

    for (const r of rs) {
        selected = r;

        const tv = Math.abs(value / r.unit);
        // const tcv = Math.trunc(tv);
        // const tdv = tv % 1;

        if (1 < tv && tv < 1000) {
            break;
        }
    }

    const tv = value / selected.unit;

    return `${+tv.toFixed(decimals)}${resolutionDelimeter ?? ' '}${selected.key}`;
}
