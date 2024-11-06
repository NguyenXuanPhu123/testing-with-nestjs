export abstract class BaseMockEntity<T> {
  protected abstract entity_stub: T;

  async create(): Promise<{ save: () => T }> {
    return {
      save: () => this.entity_stub,
    };
  }

  async findById(id: string) {
    if (id === '643d0fb80a2f99f4151176c4') {
      return this.entity_stub;
    } else {
      return null;
    }
  }
  findOne(): { exec: () => T } {
    return {
      exec: () => this.entity_stub,
    };
  }
  async countDocuments() {
    return 1;
  }
  async find() {
    return [this.entity_stub];
  }

  async findByIdAndUpdate() {
    return this.entity_stub;
  }

  async findOneAndUpdate() {
    return this.entity_stub;
  }

  async findByIdAndDelete() {
    return this.entity_stub;
  }

  populate() {
    return this.entity_stub;
  }

  exec() {
    return this.entity_stub;
  }
}
