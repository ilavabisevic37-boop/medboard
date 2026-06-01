export class SupabaseWebhookDto {
  type!: 'INSERT' | 'UPDATE' | 'DELETE';
  table!: string;
  record: any;
  old_record: any;
}
