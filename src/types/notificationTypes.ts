export type NotificationSeverity = 'success' | 'info' | 'warn' | 'error';

export interface NotificationModel {
    summary: string;
    detail?: string;
    severity: NotificationSeverity;
    timeout?: number;
}
