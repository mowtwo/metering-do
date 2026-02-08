import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { GistBackupProvider } from "@/lib/backup/gist-provider";

const provider = new GistBackupProvider();

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { data } = await request.json();
  if (!data || typeof data !== "string") {
    return NextResponse.json({ error: "无效的备份数据" }, { status: 400 });
  }

  const result = await provider.backup(data, session.accessToken);
  return NextResponse.json(result);
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const result = await provider.restore(session.accessToken);
  return NextResponse.json(result);
}

export async function DELETE() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const result = await provider.deleteBackup(session.accessToken);
  return NextResponse.json(result);
}
