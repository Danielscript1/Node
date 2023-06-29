// eslint-disable-next-line prettier/prettier
import {kenx} from './knex';

declare module 'knex/types/tables' {
  export interface tables {
    transactions: {
      id: string
      title: string
      amout: number
      create_at: string
      session_id
    }
  }
}
