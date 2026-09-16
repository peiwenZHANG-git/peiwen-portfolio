import Image from "next/image";
import styles from "./peiwen-left-environment.module.css";

export default function PeiwenLeftEnvironment() {
  return (
    <div className={styles.environment} aria-hidden="true">
      <div className={styles.road} data-left-env="road">
        <Image className={styles.source} src="/home-master/master.png" width={1536} height={1024} unoptimized alt="" />
      </div>
      <div className={styles.distant} data-left-env="distant">
        <Image className={styles.source} src="/home-master/master.png" width={1536} height={1024} unoptimized alt="" />
      </div>
      <div className={styles.experienceCopy} data-left-env="copy">
        <span>Experience</span>
        <span>How I got here.</span>
      </div>
      <div className={styles.seedNear} data-left-env="seed-near">
        <Image className={styles.seedImage} src="/peiwen-phase5/fluffy-dandelion-near.png" width={140} height={185} unoptimized alt="" />
      </div>
      <div className={styles.seedFar} data-left-env="seed-far">
        <Image className={styles.seedImage} src="/peiwen-phase5/fluffy-dandelion-far.png" width={96} height={122} unoptimized alt="" />
      </div>
      <div className={styles.fireflyNear} data-left-env="firefly-near">
        <Image className={styles.fireflyImage} src="/assets/world/firefly-v2.webp" width={320} height={320} unoptimized alt="" />
      </div>
      <div className={styles.fireflyFar} data-left-env="firefly-far">
        <Image className={styles.fireflyImage} src="/assets/world/firefly-v2.webp" width={320} height={320} unoptimized alt="" />
      </div>
    </div>
  );
}
