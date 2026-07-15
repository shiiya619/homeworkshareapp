import type { NextFunction, Request, Response } from "express";

// Express 4 は async ハンドラのthrowを拾わないため、Promiseのrejectをnextへ流す
type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

export function asyncHandler(handler: AsyncHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
}
