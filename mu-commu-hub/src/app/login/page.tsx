import { Reveal } from "@/components/motion/reveal";
import { LoginView } from "@/features/auth-views";
export default function Page() {
  return (
    <Reveal y={8}>
      <LoginView />
    </Reveal>
  );
}
