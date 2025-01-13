import { Router, Request, Response } from "express";

import { register } from "controllers/authentication";

export default (router: Router): Router => {
    router.post("/auth/register", async (req: Request, res: Response) => {
        // Explicitly awaiting the return value of `register`
        await register(req, res);
    });

    return router;
};