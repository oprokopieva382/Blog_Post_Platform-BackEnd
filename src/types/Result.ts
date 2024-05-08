export type Result<T=null> = {
    status: number,
    message?: string,
    extensions?: [{field: "", message: ""}],
    data: T
}