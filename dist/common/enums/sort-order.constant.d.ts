/** Sort direction accepted by cursor-paginated HTTP endpoints. */
export declare const SortOrder: {
    readonly ASC: "ASC";
    readonly DESC: "DESC";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
