export type OutputErrorsType = {
  errorsMessages: Error[]
};

type Error = {
    message: string
    field: string
}