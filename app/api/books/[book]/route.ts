import type { NextApiRequest, NextApiResponse } from "next"
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { apiUrl } from "@/config/global"

export async function GET(req, { params }) {
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
export async function POST(req, { params }) {
  if (req.headers) {
    const headers = {
      authentication: req.headers.get("authentication"),
    }

    const body = await req.json()
    console.log("request body ", body)
    const options = {
      method: "POST",
      url: `${apiUrl}/users/${params.book}/books`,
      headers: headers,
      data: body,
    }

    try {
      if (body) {
        const response = await axios.request(options)
        return NextResponse.json({ response }, { status: 200 })
      }
    } catch (err) {
      console.error(err)
    }
  }
}
export async function PATCH() {}
