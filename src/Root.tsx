import { Composition } from "remotion";
import { SmallERPExplainer } from "./SmallERPExplainer";
import { ChatbotBuilderDemo } from "./ChatbotBuilderDemo";
import { ChatbotSalesDemo } from "./ChatbotSalesDemo";
import { RealEstateSalesDemo } from "./RealEstateSalesDemo";
import { RealEstateDubai } from "./real-estate-dubai";
import { RealEstateDubaiIG } from "./real-estate-dubai/RealEstateDubaiIG";

export const RemotionRoot = () => {
  return (
    <>
      {/* Dubai Real Estate - PropertyFinder Style */}
      <Composition
        id="RealEstateDubai"
        component={RealEstateDubai}
        durationInFrames={1600}
        fps={30}
        width={1920}
        height={1080}
      />
      
      {/* Instagram Reel Version - 9:16 Vertical */}
      <Composition
        id="RealEstateDubaiIG"
        component={RealEstateDubaiIG}
        durationInFrames={1000}
        fps={30}
        width={1080}
        height={1920}
      />
      
      <Composition
        id="RealEstateSalesDemo"
        component={RealEstateSalesDemo}
        durationInFrames={1640}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ChatbotSalesDemo"
        component={ChatbotSalesDemo}
        durationInFrames={1530}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ChatbotBuilderDemo"
        component={ChatbotBuilderDemo}
        durationInFrames={1110}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SmallERPExplainer"
        component={SmallERPExplainer}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
