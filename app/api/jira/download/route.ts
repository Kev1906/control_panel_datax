import { NextResponse } from "next/server"

export async function POST(request:Request) {
    const response = await request.json()
    // console.log(response['fields'])
    console.log(response['fields']['customfield_10056'])
    console.log(response['fields']['customfield_10054'])
    console.log(response['fields']['customfield_10061'])
    console.log(response['fields']['customfield_10062'])
    console.log(response['fields']['customfield_10063'])
    
    return NextResponse.json(
        {
            hola: "jkkakaka",
            response: response
        }
    )
}