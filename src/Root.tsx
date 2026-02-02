import { Composition } from "remotion";
import { SmallERPExplainer } from "./SmallERPExplainer";
import { ChatbotBuilderDemo } from "./ChatbotBuilderDemo";
import { ChatbotSalesDemo } from "./ChatbotSalesDemo";

export const RemotionRoot = () => {
  return (
    <>
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
