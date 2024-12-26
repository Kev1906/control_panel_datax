import { NextResponse } from "next/server"

export async function POST(request:Request) {
    const response = await request.json()
    console.log(response['fields']['customfield_10059'])
    
    return NextResponse.json(
        {
            hola: "jkkakaka",
            response: response
        }
    )
}