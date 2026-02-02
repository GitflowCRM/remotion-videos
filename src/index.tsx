import { registerRoot, Composition } from 'remotion';
import { SmallERPExplainer } from './SmallERPExplainer';
import { Dashboard } from './Dashboard';
import { InvoiceFlow } from './InvoiceFlow';
import { CopilotChat } from './CopilotChat';
import { DashboardReal } from './DashboardReal';
import { DashboardReal2 } from './DashboardReal2';
import { InvoiceFlow2 } from './InvoiceFlow2';
import { CopilotChat2 } from './CopilotChat2';
import { InventoryFlow } from './InventoryFlow';
import { CustomersFlow } from './CustomersFlow';
import { ExpensesFlow } from './ExpensesFlow';
import { ReportsFlow } from './ReportsFlow';
import { InstagramReel } from './InstagramReel';
import { InstagramReelV2 } from './InstagramReelV2';
import { InstagramReelV3 } from './InstagramReelV3';
import { InstagramReelV4 } from './InstagramReelV4';
import { InstagramReelV5 } from './InstagramReelV5';
import { InstagramReelV6 } from './InstagramReelV6';
import { InstagramReelV7 } from './InstagramReelV7';
import { InstagramReelHindi } from './InstagramReelHindi';
import { LogoIntro } from './LogoIntro';
import { ChatbotBuilderDemo } from './ChatbotBuilderDemo';

const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ChatbotBuilderDemo"
        component={ChatbotBuilderDemo}
        durationInFrames={1110}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LogoIntro"
        component={LogoIntro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Dashboard"
        component={Dashboard}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="InvoiceFlow"
        component={InvoiceFlow}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CopilotChat"
        component={CopilotChat}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SmallERPExplainer"
        component={SmallERPExplainer}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DashboardReal"
        component={DashboardReal}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DashboardReal2"
        component={DashboardReal2}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="InvoiceFlow2"
        component={InvoiceFlow2}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CopilotChat2"
        component={CopilotChat2}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="InventoryFlow"
        component={InventoryFlow}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CustomersFlow"
        component={CustomersFlow}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ExpensesFlow"
        component={ExpensesFlow}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ReportsFlow"
        component={ReportsFlow}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="InstagramReel"
        component={InstagramReel}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="InstagramReelV2"
        component={InstagramReelV2}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="InstagramReelV3"
        component={InstagramReelV3}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="InstagramReelV4"
        component={InstagramReelV4}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="InstagramReelV5"
        component={InstagramReelV5}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="InstagramReelV6"
        component={InstagramReelV6}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="InstagramReelV7"
        component={InstagramReelV7}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="InstagramReelHindi"
        component={InstagramReelHindi}
        durationInFrames={1005}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

registerRoot(RemotionRoot);
