import { Model, ModelOptions, QueryContext } from 'objection';

class BaseModel extends Model {
  id!: number;
  createdAt!: Date;
  updatedAt!: Date;

  async $beforeUpdate(opt: ModelOptions, context: QueryContext) {
    await super.$beforeUpdate(opt, context);
    this.updatedAt = new Date();
  }
}

export { BaseModel };
