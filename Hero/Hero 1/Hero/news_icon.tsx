"use client";
import * as React from "react";
const SvgComponent = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 50 50"
    {...props}
  >
    <path d="M9 13H1v31c0 2.757 2.243 5 5 5h38c2.757 0 5-2.243 5-5V1H9v12zM3 44V15h6v29c0 1.654-1.346 3-3 3s-3-1.346-3-3zm8-41h36v41c0 1.654-1.346 3-3 3H9.998c.03-.039.051-.084.079-.124.057-.081.107-.166.159-.251a4.887 4.887 0 0 0 .599-1.418c.023-.094.052-.184.07-.28.058-.301.095-.609.095-.927V3z" />
    <path d="M15 8h28v2H15zM19 13h20v2H19zM31 21h12v2H31zM31 26h12v2H31zM27 21H15v12h12V21zm-2 10h-8v-8h8v8zM31 31h12v2H31zM15 36h12v2H15zM31 36h12v2H31zM15 41h12v2H15zM31 41h12v2H31z" />
  </svg>
);
export default SvgComponent;
