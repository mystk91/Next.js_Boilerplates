import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Slide from "@/app/ui/Intersection Animate/slide";

export default function Page() {
  return (
    <div className={styles.page}>
      <Slide
        headline={`Cool Stuff`}
        body={`There is a lot of cool stuff here. You should really consider doing this kind of cool stuff.`}
      />
      <Slide
        headline={`Get Involved!`}
        body={`There are more ways than ever to contribute to this project. You could put up posters around the neighborhood or even help organize an event. `}
      />
      <Slide
        headline={`More Cool Stuff`}
        body={`There is a lot of cool stuff here. You should really consider doing this kind of cool stuff.`}
      />
      <Slide
        headline={`Conclusion`}
        body={`With more ways to do cool stuff than ever, you should get started doing said cool stuff.`}
      />
    </div>
  );
}
