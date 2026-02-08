import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { GistBackupProvider } from "@/lib/backup/gist-provider";

const provider = new GistBackupProvider();

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const info = await provider.getBackupInfo(session.accessToken);
  return NextResponse.json({ info });
}
