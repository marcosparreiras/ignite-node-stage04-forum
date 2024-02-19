import { Slug } from "./slug";

test("it should be able to create a new slug from test", () => {
  const slug = Slug.createFromText("  Slug Example TEST ");
  expect(slug).instanceOf(Slug);
  expect(slug.value).toEqual("slug-example-test");
});
