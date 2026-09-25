import { Reveal } from "@/components/motion/reveal";
import { OnboardingView } from "@/features/auth-views";
export default function Page() {
  return (
    <Reveal y={8}>
      <OnboardingView />
    </Reveal>
  );
}
