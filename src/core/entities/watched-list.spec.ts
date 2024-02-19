import { WatchedList } from "./watched-list";

class NumbersWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number) {
    return a === b;
  }
}

describe("WatchedList", () => {
  it("Should be able to create a watched list with inital items", () => {
    const list = new NumbersWatchedList([1, 2, 3]);
    expect(list.getItems()).toEqual([1, 2, 3]);
  });

  it("Should be able to add new items to the list", () => {
    const list = new NumbersWatchedList([1, 2, 3]);
    list.add(4);
    expect(list.getItems()).toEqual([1, 2, 3, 4]);
    expect(list.getNewItems()).toEqual([4]);
  });

  it("Should be able to remove items from the list", () => {
    const list = new NumbersWatchedList([1, 2, 3]);
    list.remove(2);
    list.remove(1);
    expect(list.getItems()).toEqual([3]);
    expect(list.getRemovedItems()).toEqual([2, 1]);
  });

  it("Should be able to add an item even if it was removed before", () => {
    const list = new NumbersWatchedList([1, 2, 3]);
    list.remove(2);
    list.add(2);
    expect(list.getItems()).toEqual([1, 3, 2]);
    expect(list.getNewItems()).toEqual([]);
    expect(list.getRemovedItems()).toEqual([]);
  });

  it("Should be able to remove an item even if it was added before", () => {
    const list = new NumbersWatchedList([1, 2, 3]);
    list.add(4);
    list.remove(4);
    expect(list.getItems()).toEqual([1, 2, 3]);
    expect(list.getNewItems()).toEqual([]);
    expect(list.getRemovedItems()).toEqual([]);
  });

  it("Should be able to update watched list items", () => {
    const list = new NumbersWatchedList([1, 2, 3]);
    list.update([1, 3, 5]);
    expect(list.getItems()).toEqual([1, 3, 5]);
    expect(list.getNewItems()).toEqual([5]);
    expect(list.getRemovedItems()).toEqual([2]);
  });
});
