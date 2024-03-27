import { Request, Response } from "express"
import { OutputErrorsType } from './input-output-types/output-errors-type';
import { Resolutions } from "./input-output-types/video-types";

export type ParamType = {
    id: string
}

export type BodyType = {
  id?: number;
  title: string;
  author: string;
  availableResolutions?: (keyof typeof Resolutions)[] | null;
};

export type QueryType = {
    search?: string
}

export type ControllerType = (req: Request<ParamType, {}, BodyType, QueryType>, res: Response<void | OutputErrorsType>) => {}