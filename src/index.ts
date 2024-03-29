export { TinymoClient } from "./client";
export { Update } from './update';
export { Put } from './put';
export { Delete } from './delete';
export { Get } from './get';
export { Search } from './search';
export { Query } from './query';
export { Scan } from './scan';
export { Transaction } from './transaction';
export { BatchGet } from './batch-get';
export { BatchWrite } from './batch-write';
export { TransactGet } from './transact-get';
export { Write } from './write';

import { TinymoClient } from "./client";
export const tinymo = TinymoClient.default();