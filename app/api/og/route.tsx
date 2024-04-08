import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { Icons, RaycastLogoNegIcon } from "@raycast/icons";
import { Preset } from "../../../data/presets";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const hasTitle = searchParams.has("title");
    const title = hasTitle ? searchParams.get("title")?.slice(0, 100) : "";
    const hasDescription = searchParams.has("description");
    const description = hasDescription
      ? searchParams.get("description")?.slice(0, 240)
      : "Raycast AI Preset";
    const icon = searchParams.get("icon") as Preset["icon"];
    const IconComponent = Icons[icon] ? Icons[icon] : null;

    const interRegular = await fetch(
      new URL("../../../public/inter-Regular.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());
    const interSemiBold = await fetch(
      new URL("../../../public/inter-SemiBold.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    const bgImageData = await fetch(
      new URL("../../../public/og-bg.png", import.meta.url)
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "black",
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <img
            width="1024"
            height="512"
            src={bgImageData as any}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              flex: 1,
            }}
          >
            {icon && (
              <div
                style={{
                  color: "white",
                  display: "flex",
                  border: "1px solid rgba(255, 255, 255, 0.20)",
                  borderRadius: "9999px",
                  backgroundImage:
                    "radial-gradient(150.08% 117.14% at 31.25% 9.37%, #171717 0%, #000 100%)",
                  width: 88,
                  height: 88,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                {IconComponent && <IconComponent width={44} height={44} />}
              </div>
            )}
            <div
              style={{
                fontSize: 60,
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                color: "white",
                padding: "0 120px",
                lineHeight: 1.4,
                fontWeight: 600,
                whiteSpace: "nowrap",
                fontFamily: "Inter",
              }}
            >
              {title}
            </div>
            {description && (
              <div
                style={{
                  fontSize: 28,
                  color: "rgba(255, 255, 255, 0.60)",
                  marginTop: 16,
                  textAlign: "center",
                  lineHeight: 1.55,
                  fontFamily: "Inter",
                  paddingLeft: 100,
                  paddingRight: 100,
                }}
              >
                {description}
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "white",
              fontSize: 26,
              fontWeight: 400,
              gap: 16,
              paddingBottom: 32,
            }}
          >
            <RaycastLogoNegIcon
              style={{ color: "#FF6362", width: 36, height: 36 }}
            />{" "}
            By Raycast
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Inter",
            data: interRegular,
            weight: 400,
            style: "normal",
          },
          {
            name: "Inter",
            data: interSemiBold,
            weight: 600,
            style: "normal",
          },
        ],
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
