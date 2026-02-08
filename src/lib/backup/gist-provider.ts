import type {
  BackupProvider,
  BackupMetadata,
  BackupResult,
  RestoreResult,
} from "./types";

const GIST_DESCRIPTION = "metering-do-backup";
const GIST_FILENAME = "metering-do-backup.json";
const GITHUB_API = "https://api.github.com";

export class GistBackupProvider implements BackupProvider {
  readonly id = "github-gist";
  readonly name = "GitHub Gist";

  private headers(token: string): Record<string, string> {
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
  }

  private async findExistingGist(
    token: string
  ): Promise<{ id: string; updated_at: string } | null> {
    const res = await fetch(`${GITHUB_API}/gists?per_page=100`, {
      headers: this.headers(token),
    });
    if (!res.ok) return null;

    const gists: Array<{ id: string; description: string; updated_at: string }> =
      await res.json();
    const found = gists.find((g) => g.description === GIST_DESCRIPTION);
    return found ? { id: found.id, updated_at: found.updated_at } : null;
  }

  async backup(data: string, token: string): Promise<BackupResult> {
    const existing = await this.findExistingGist(token);

    const url = existing
      ? `${GITHUB_API}/gists/${existing.id}`
      : `${GITHUB_API}/gists`;

    const method = existing ? "PATCH" : "POST";

    const body = existing
      ? { files: { [GIST_FILENAME]: { content: data } } }
      : {
          description: GIST_DESCRIPTION,
          public: false,
          files: { [GIST_FILENAME]: { content: data } },
        };

    const res = await fetch(url, {
      method,
      headers: this.headers(token),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return { success: false, error: `GitHub API error: ${res.status}` };
    }

    const gist = await res.json();
    return {
      success: true,
      metadata: {
        id: gist.id,
        updatedAt: gist.updated_at,
        description: GIST_DESCRIPTION,
        provider: this.id,
      },
    };
  }

  async restore(token: string): Promise<RestoreResult> {
    const existing = await this.findExistingGist(token);
    if (!existing) {
      return { success: false, error: "没有找到云端备份" };
    }

    const res = await fetch(`${GITHUB_API}/gists/${existing.id}`, {
      headers: this.headers(token),
    });
    if (!res.ok) {
      return { success: false, error: `GitHub API error: ${res.status}` };
    }

    const gist = await res.json();
    const file = gist.files?.[GIST_FILENAME];
    if (!file) {
      return { success: false, error: "备份文件格式异常" };
    }

    return {
      success: true,
      data: file.content,
      metadata: {
        id: gist.id,
        updatedAt: gist.updated_at,
        description: GIST_DESCRIPTION,
        provider: this.id,
      },
    };
  }

  async getBackupInfo(token: string): Promise<BackupMetadata | null> {
    const existing = await this.findExistingGist(token);
    if (!existing) return null;
    return {
      id: existing.id,
      updatedAt: existing.updated_at,
      description: GIST_DESCRIPTION,
      provider: this.id,
    };
  }

  async deleteBackup(
    token: string
  ): Promise<{ success: boolean; error?: string }> {
    const existing = await this.findExistingGist(token);
    if (!existing) return { success: true };

    const res = await fetch(`${GITHUB_API}/gists/${existing.id}`, {
      method: "DELETE",
      headers: this.headers(token),
    });
    if (!res.ok) {
      return { success: false, error: `GitHub API error: ${res.status}` };
    }
    return { success: true };
  }
}
