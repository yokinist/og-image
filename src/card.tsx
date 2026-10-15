import type { ReactNode } from "react";
import type { CardOptions } from "./options.js";

export const WIDTH = 1200;
export const HEIGHT = 630;
const PADDING = 72;

// Rough width of a character in em: CJK and emoji are square, Latin narrower
const charWidth = (char: string) =>
  /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯]|\p{Extended_Pictographic}/u.test(char) ? 1 : 0.56;

/** The largest size, up to `max`, at which `text` fits `lines` lines of `width`. */
export const fitFontSize = (
  text: string,
  { max, width, lines }: { max: number; width: number; lines: number },
) => {
  const em = [...text].reduce((sum, char) => sum + charWidth(char), 0);
  for (let size = max; size > 32; size -= 2) {
    // Wrapping breaks at words, so leave some slack per line
    if (Math.ceil((em * size) / (width * 0.92)) <= lines) return size;
  }
  return 32;
};

const Muted = ({ children, size }: { children: ReactNode; size: number }) => (
  <div style={{ display: "flex", fontSize: size, opacity: 0.6 }}>
    {children}
  </div>
);

const Site = ({ options }: { options: CardOptions }) =>
  options.siteTitle || options.logo ? (
    <div
      style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30 }}
    >
      {options.logo ? (
        <img
          src={options.logo}
          width={48}
          height={48}
          style={{ borderRadius: 12, objectFit: "cover" }}
          alt=""
        />
      ) : (
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 999,
            background: options.accent,
          }}
        />
      )}
      {options.siteTitle && (
        <div style={{ display: "flex", fontWeight: 700 }}>
          {options.siteTitle}
        </div>
      )}
    </div>
  ) : null;

const Byline = ({ options }: { options: CardOptions }) => {
  const parts = [options.author, options.date].filter(Boolean);
  // An empty box keeps the title in the middle when there is no byline
  return <Muted size={26}>{parts.join("  ·  ")}</Muted>;
};

const Title = ({
  options,
  width,
  center = false,
}: {
  options: CardOptions;
  width: number;
  center?: boolean;
}) => {
  const lines = options.description ? 2 : 3;
  const fontSize = fitFontSize(options.title, {
    max: options.fontSize,
    width,
    lines,
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width,
        gap: 20,
        alignItems: center ? "center" : "flex-start",
        textAlign: center ? "center" : "left",
      }}
    >
      <div
        style={{
          display: "block",
          fontSize,
          fontWeight: 700,
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
          lineClamp: lines,
        }}
      >
        {options.title}
      </div>
      {options.description && (
        <div
          style={{
            display: "block",
            fontSize: 30,
            lineHeight: 1.5,
            opacity: 0.6,
            lineClamp: 2,
          }}
        >
          {options.description}
        </div>
      )}
    </div>
  );
};

const frame = (options: CardOptions) =>
  ({
    width: WIDTH,
    height: HEIGHT,
    display: "flex",
    boxSizing: "border-box",
    color: options.foreground,
    background: options.background,
    fontFamily: "Inter, Noto Sans JP",
  }) as const;

// Title on the left, the site above and the byline below; a glow of the
// accent color in the corner and a bar along the bottom
const Standard = ({ options }: { options: CardOptions }) => (
  <div
    style={{
      ...frame(options),
      flexDirection: "column",
      justifyContent: "space-between",
      padding: PADDING,
      backgroundImage: `radial-gradient(circle at 100% 0%, ${options.accent}33, transparent 55%)`,
    }}
  >
    <Site options={options} />
    <Title options={options} width={WIDTH - PADDING * 2} />
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Byline options={options} />
      <div
        style={{
          width: 120,
          height: 8,
          borderRadius: 999,
          background: options.accent,
        }}
      />
    </div>
  </div>
);

// Everything centered inside a gradient frame
const Center = ({ options }: { options: CardOptions }) => (
  <div
    style={{
      ...frame(options),
      padding: 20,
      backgroundImage: `linear-gradient(135deg, ${options.accent}, ${options.background} 60%, ${options.accent})`,
    }}
  >
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: PADDING - 20,
        borderRadius: 24,
        background: options.background,
      }}
    >
      <Title options={options} width={WIDTH - PADDING * 2} center />
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <Site options={options} />
        <Byline options={options} />
      </div>
    </div>
  </div>
);

// Text on the left, a panel of the accent color on the right
const Split = ({ options }: { options: CardOptions }) => {
  const panel = 300;
  return (
    <div style={frame(options)}>
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: PADDING,
        }}
      >
        <Site options={options} />
        <Title options={options} width={WIDTH - panel - PADDING * 2} />
        <Byline options={options} />
      </div>
      <div
        style={{
          display: "flex",
          width: panel,
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `linear-gradient(160deg, ${options.accent}, ${options.accent}55)`,
        }}
      >
        {options.logo && (
          <img
            src={options.logo}
            width={140}
            height={140}
            style={{ borderRadius: 32, objectFit: "cover" }}
            alt=""
          />
        )}
      </div>
    </div>
  );
};

export const Card = ({ options }: { options: CardOptions }) => {
  switch (options.layout) {
    case "center":
      return <Center options={options} />;
    case "split":
      return <Split options={options} />;
    default:
      return <Standard options={options} />;
  }
};
