import { Either, left, right } from "./either";

function doSomething(shouldSuccess: boolean): Either<string, string> {
  if (!shouldSuccess) {
    return left("error");
  }
  return right("success");
}

describe("Either", () => {
  test("Right result", () => {
    const sut = doSomething(true);
    expect(sut.isLeft()).toEqual(false);
    expect(sut.isRight()).toEqual(true);
    expect(sut.value).toEqual("success");
  });

  test("Left result", () => {
    const sut = doSomething(false);
    expect(sut.isLeft()).toEqual(true);
    expect(sut.isRight()).toEqual(false);
    expect(sut.value).toEqual("error");
  });
});
