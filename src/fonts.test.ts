import { describe, expect, it } from "vitest";
import { subsets } from "./fonts.js";

const families = (text: string) => [...subsets(text).keys()];

describe("subsets", () => {
  it("asks for Inter alone when the text is Latin", () => {
    expect(families("Hello, world · 2026")).toEqual(["Inter"]);
  });

  it("keeps Cyrillic and Greek on Inter, which covers them", () => {
    expect(families("Привет κόσμε")).toEqual(["Inter"]);
  });

  it("adds both CJK families, JP first, for Han and kana", () => {
    expect(families("· ブログを作り直した")).toEqual([
      "Inter",
      "Noto Sans JP",
      "Noto Sans SC",
    ]);
    // 贴 and 线 are not in Noto Sans JP, so SC is the one that draws them
    expect(families("· 一个解决通用剪贴板失效的曲线救国方案")).toEqual([
      "Inter",
      "Noto Sans JP",
      "Noto Sans SC",
    ]);
  });

  it("picks the family each script needs", () => {
    expect(families("· 안녕하세요")).toEqual(["Inter", "Noto Sans KR"]);
    expect(families("· สวัสดี")).toEqual(["Inter", "Noto Sans Thai"]);
    expect(families("· مرحبا")).toEqual(["Inter", "Noto Sans Arabic"]);
    expect(families("· नमस्ते")).toEqual(["Inter", "Noto Sans Devanagari"]);
  });

  it("leaves Inter out when there is no Latin to draw with it", () => {
    expect(families("안녕하세요")).toEqual(["Noto Sans KR"]);
  });

  it("orders the families the way satori should try them", () => {
    expect(families("A 안녕 日本語 สวัสดี")).toEqual([
      "Inter",
      "Noto Sans JP",
      "Noto Sans SC",
      "Noto Sans KR",
      "Noto Sans Thai",
    ]);
  });

  it("sends each family only its own characters, without repeats", () => {
    expect(subsets("Hi 日日本 안녕")).toEqual(
      new Map([
        ["Inter", "Hi "],
        ["Noto Sans JP", "日本"],
        ["Noto Sans SC", "日本"],
        ["Noto Sans KR", "안녕"],
      ]),
    );
  });

  it("asks for nothing when there is nothing to draw", () => {
    expect(subsets("")).toEqual(new Map());
  });
});
