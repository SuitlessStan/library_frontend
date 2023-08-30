import type { NextApiRequest, NextApiResponse } from "next"
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { apiUrl } from "@/config/global"

export async function GET(req: NextApiRequest, { params }) {
  if (req.headers) {
    const config = {
      headers: {
        authentication: req.headers.get("authentication"),
      },
    }
    try {
      const response = await axios.get(`${apiUrl}/users/${params.book}/books`, config)
      if (response.status == 200) {
        return NextResponse.json({ result: response.data }, { status: 200 })
      }
    } catch (err) {
      return NextResponse.json({ err }, { status: 404 })
    }
  }
}
export async function POST() {}
export async function PATCH() {}
