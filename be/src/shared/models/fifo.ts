export class NonDupFIFO<T> {
  private data: Set<T>;

  get size() {
    return this.data.size;
  }

  constructor(ele?: T[]) {
    this.data = new Set(ele);
  }

  queue(ele: T) {
    this.data.add(ele);
  }

  dequeue() {
    const [head] = this.data;
    this.data.delete(head);
    return head;
  }

  remove(ele: T) {
    this.data.delete(ele);
  }
}
