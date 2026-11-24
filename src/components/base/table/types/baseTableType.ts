export interface BaseTableColumn<T = Record<string, unknown>> {
    field: keyof T & string;
    header: string;
    sortable?: boolean;
    checked?: boolean;
    disabled?: boolean;
    slotName?: string;
    width?: string;
    isExpander?: boolean;
}

export interface BaseTableFilter {
    name: string;
    field: string;
    value?: string | number | boolean | null;
    matchMode?: string;
}
