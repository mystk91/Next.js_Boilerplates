import { useEffect, useCallback, useState } from "react";

type AnchorPoint = {
  x: number;
  y: number;
};

const useContextMenu = () => {
  const [anchorPoint, setAnchorPoint] = useState<AnchorPoint>({ x: 0, y: 0 });
  const [isShown, setIsShown] = useState(false);

  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      setAnchorPoint({ x: event.pageX, y: event.pageY });
      setIsShown(true);
    },
    [setIsShown, setAnchorPoint]
  );

  const handleClick = useCallback(() => {
    if (isShown) {
      setIsShown(false);
    }
  }, [isShown]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  return { anchorPoint, isShown };
};

export { useContextMenu };
