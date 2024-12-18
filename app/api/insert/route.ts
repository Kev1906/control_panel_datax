import { NextResponse } from "next/server";
import poolDevDb from "@/lib/postgresDevDb";
import poolProdDb from "@/lib/postgresProdDb";

// type Data = {
//     code?: string
//     main_url?: string
// }

async function insertReports(id_file: number, arrayCubeIds: any) {
  for (const row of arrayCubeIds) {
    const insertReportQuery =
      "INSERT INTO report (id_file, id_cube) VALUES ($1, $2)";
    await poolProdDb.query(insertReportQuery, [id_file, row["id_cube"]]);
  }
}
export async function POST(request: Request) {
  const { data } = await request.json();

  if (!data) {
    return NextResponse.json({ error: "Data is required" }, { status: 400 });
  }

  try {
    let resultCubeId = null
    if (data["cube"].length) {
      const cubeIds = data["cube"].map((id:any) => `'${id}'`).join(", ");

      const cubeIdQuery = `SELECT id_cube FROM cube WHERE code IN (${cubeIds})`;
      resultCubeId = await poolProdDb.query(cubeIdQuery);
      if (resultCubeId.rowCount === 0) {
        return NextResponse.json({ error: "Cube not found" }, { status: 404 });
      }
    } 

    const getQuery = "SELECT code FROM file WHERE code LIKE 'D_BO_%'";
    const insertquery =
      "INSERT INTO file (id_source, name, main_url, path, publication_frequency, state, updated_to, last_file_path,schedule_interval,  key_words, download_type, code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";
    const result = await poolProdDb.query(getQuery);
    let codeNumbers: number[] = [];

    result["rows"].forEach((row:any) => {
      const match = row.code.match(/_(\d+)/);
      if (match) {
        codeNumbers.push(Number(match[1]));
      }
    });

    codeNumbers = codeNumbers.sort((a, b) => a - b);
    const lastCode = codeNumbers[codeNumbers.length - 1] + 1;
    const currentRobotCode = `D_BO_${lastCode.toString().padStart(9, "0")}`;

    await poolDevDb.query(insertquery, [
      1,
      data["name"].trim(),
      data["main_url"].trim(),
      data["path"].trim(),
      data["publication_frequency"].trim(),
      "activo",
      data["updated_to"].trim(),
      data["last_file_path"].trim(),
      data["schedule_interval"].trim(),
      data["key_words"].trim(),
      data["download_type"].trim(),
      currentRobotCode,
    ]);
    await poolProdDb.query(insertquery, [
      1,
      data["name"].trim(),
      data["main_url"].trim(),
      data["path"].trim(),
      data["publication_frequency"].trim(),
      "activo",
      data["updated_to"].trim(),
      data["last_file_path"].trim(),
      data["schedule_interval"].trim(),
      data["key_words"].trim(),
      data["download_type"].trim(),
      currentRobotCode,
    ]);
    const robotIdQuery = `SELECT id_file FROM file WHERE code = '${currentRobotCode}'`;

    const resultRobotId = await poolProdDb.query(robotIdQuery);

    const { id_file } = resultRobotId["rows"][0];
    if (resultCubeId) {
      const id_cubes = resultCubeId["rows"];
      insertReports(id_file, id_cubes)
        .then(() => console.log("All reports inserted successfully"))
        .catch((err) => console.error("Error inserting reports:", err));
    }
    return NextResponse.json(
      {
        robot_code: currentRobotCode,
        message: "The robot was created successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
