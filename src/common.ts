import { TransactWriteItem } from '@aws-sdk/client-dynamodb';

export type Comparator = '=' | '<>' | '<' | '>' | '<=' | '>=';
export type VerboseType = 'String' | 'String Set' | 'Number' | 'Number Set' | 'Binary' | 'Binary Set' | 'Boolean' | 'Null' | 'List' | 'Map';
export type Select = | 'ALL_ATTRIBUTES' | 'ALL_PROJECTED_ATTRIBUTES' | 'COUNT' | 'SPECIFIC_ATTRIBUTES';
export type ReturnConsumedCapacity = 'INDEXES' | 'TOTAL' | 'NONE';
export type ReturnItemCollectionMetrics = 'SIZE' | 'NONE';

export interface TransactWritable { transactWriteItem(): TransactWriteItem }