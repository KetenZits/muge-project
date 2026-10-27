"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Folder from "@/components/Folder";
import { welcomeBenefits } from "@/data/welcome";

export default function Benefits() {
  return (
    <section className="welcome-benefits" aria-labelledby="welcome-benefits-title">
      <div className="welcome-section-heading">
        <span className="welcome-kicker">01 / THE POSSIBILITIES</span>
        <h2 id="welcome-benefits-title">Good things begin<br /><em>together.</em></h2>
        <p>MU Connect gives your next idea a place to find its people. Open a folder to see where you could begin.</p>
      </div>
      <div className="welcome-benefit-grid">
        {welcomeBenefits.map((benefit) => (
          <article key={benefit.number} className="welcome-benefit-card">
            <div className="welcome-benefit-top"><span>{benefit.number} / 04</span><span>EXPLORE</span></div>
            <div className="welcome-benefit-folder">
              <Folder
                label={benefit.title}
                items={[...benefit.items]}
                color={benefit.color}
                variant="matte"
                theme="light"
                size={0.82}
                draggable={false}
                zoomOnClick
                peek
                intro={false}
                openOn="click"
              />
            </div>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
            <Link href={benefit.href} className="welcome-benefit-link">{benefit.action}<ArrowUpRight size={17} aria-hidden="true" /></Link>
          </article>
        ))}
      </div>
    </section>
  );
}
