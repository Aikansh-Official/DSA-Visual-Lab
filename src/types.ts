export enum DSATopic {
  STACK = 'stack',
  QUEUE = 'queue',
  ARRAY = 'array',
  TREE = 'tree',
}

export interface HistoryItem {
  message: string;
  timestamp: number;
}
