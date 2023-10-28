export type NoneJSONRequestBody = Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream;
export type TableCellType = string | number | HTMLElement | React.ReactNode | null;
export type ConfirmModalConfirmCallback = (isConfirmed: boolean) => void;
export type ConfirmModalCallback = (callback?: ConfirmModalConfirmCallback) => void;
