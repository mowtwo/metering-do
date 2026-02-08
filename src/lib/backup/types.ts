export interface BackupMetadata {
  id: string;
  updatedAt: string;
  description: string;
  provider: string;
}

export interface BackupResult {
  success: boolean;
  metadata?: BackupMetadata;
  error?: string;
}

export interface RestoreResult {
  success: boolean;
  data?: string;
  metadata?: BackupMetadata;
  error?: string;
}

export interface BackupProvider {
  readonly id: string;
  readonly name: string;

  backup(data: string, accessToken: string): Promise<BackupResult>;
  restore(accessToken: string): Promise<RestoreResult>;
  getBackupInfo(accessToken: string): Promise<BackupMetadata | null>;
  deleteBackup(
    accessToken: string
  ): Promise<{ success: boolean; error?: string }>;
}
