import * as Helpers from '../helpers';

export interface INumberOptions {
    decimals?: number;
    multiplier?: number;
    resolutions?: Record<string, number>;
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
