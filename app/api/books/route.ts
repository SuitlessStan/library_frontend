import { NextResponse, NextRequest } from "next/server"
import type { NextApiRequest, NextApiResponse } from "next"
import { createRouter, expressWrapper } from "next-connect"
import cors from "cors"

const router = createRouter<NextApiRequest, NextApiResponse>()

router.use(cors()).get(async (req, event, next) => {
  console.log(req.query)
  console.log(req.headers)
})
// export default router.handler({
//   onError: (err, req, res) => {
//     console.error(err.stack)
//     return new NextResponse("Something broke!", {
//       status: err.statusCode || 500,
//     })
//   },
// })
